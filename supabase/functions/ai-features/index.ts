import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// In-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 5; // max AI requests per window
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

async function callAI(prompt: string): Promise<string> {
  console.log('Calling Gemini AI with prompt:', prompt.substring(0, 100) + '...');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('AI response received, length:', text.length);
  return text;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP for anonymous users
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const authHeader = req.headers.get('Authorization');

    // Only rate limit if no auth header (anonymous users)
    if (!authHeader && !checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again in 10 minutes.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429
        }
      );
    }

    const { action, data } = await req.json();
    console.log('AI Features request - Action:', action);

    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase credentials not configured');

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let userId: string | null = null;
    let spaceId = data.spaceId || null;

    // Space-based validation: If spaceId provided, verify it exists and is active
    if (spaceId) {
      const { data: space, error: spaceError } = await supabaseAdmin
        .from('spaces')
        .select('id, is_active, workspace_id')
        .eq('id', spaceId)
        .single();

      if (spaceError || !space) {
        console.error('Space not found:', spaceId, spaceError);
        return new Response(
          JSON.stringify({ error: 'Invalid space ID' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404
          }
        );
      }

      if (!space.is_active) {
        console.error('Space is not active:', spaceId);
        return new Response(
          JSON.stringify({ error: 'Space is not active' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403
          }
        );
      }

      // Get workspace owner for billing
      const { data: workspace } = await supabaseAdmin
        .from('workspaces')
        .select('user_id')
        .eq('id', space.workspace_id)
        .single();

      if (workspace) {
        userId = workspace.user_id;
        console.log(`Found owner ${userId} for space ${spaceId}`);
      }
    }

    // 1. Try to get user from Auth Header
    if (authHeader) {
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!authError && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      console.error("Could not determine user for billing.");
      throw new Error('Unauthorized: No user or valid space context found.');
    }

    // FEATURE: Check Limits (Optional but requested)
    // We could check ai_credits_used vs limit in profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('ai_credits_used, plan')
      .eq('id', userId)
      .single();

    // Simple Limit Logic (Hardcoded for now based on PlanType in useUserPlan)
    const LIMITS = { free: 0, pro: 200, agency: 500 };
    const userPlan = (profile?.plan || 'free') as keyof typeof LIMITS;
    const limit = LIMITS[userPlan] || 0;
    const used = profile?.ai_credits_used || 0;

    if (used >= limit) {
      console.log(`User ${userId} over limit (${used}/${limit}).`);
      throw new Error(`AI Credit Limit Exceeded for plan ${userPlan}. Upgrade to continue.`);
    }

    let result: any;
    let creditsCost = 1;

    switch (action) {
      case 'generate-script': {
        const { keywords, questions } = data;
        const prompt = `You are a testimonial coach. Generate a natural, conversational script for someone recording a video testimonial.

Keywords/Context: ${keywords}

Questions to answer:
${questions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

Generate a flowing, authentic script that answers each question naturally. The script should:
- Sound conversational, not robotic
- Be VERY SHORT, around 10-15 seconds script. VERY PUNCHY AND CONCISE.
- Include natural transitions between points
- Feel genuine and heartfelt

Return ONLY the script text, no headers or labels.`;

        result = { script: await callAI(prompt) };
        break;
      }

      case 'enhance-text': {
        const { text, mode } = data;
        let prompt: string;

        switch (mode) {
          case 'shorten':
            prompt = `Make this testimonial more concise. Reduce it to be very short and punchy.
Original: "${text}"
Return ONLY the shortened text.`;
            break;
          case 'medium':
            prompt = `Rewrite to be medium length (2-3 sentences).
Original: "${text}"
Return ONLY the rewritten text.`;
            break;
          case 'longer':
            prompt = `Expand to be more detailed (4-5 sentences).
Original: "${text}"
Return ONLY the expanded text.`;
            break;
          case 'simplify':
            prompt = `Simplify to 5th-grade reading level.
Original: "${text}"
Return ONLY the simplified text.`;
            break;
          case 'fix':
            prompt = `Correct grammar and improve flow. Professional yet authentic.
Original: "${text}"
Return ONLY the polished text.`;
            break;
          case 'translate':
            prompt = `Translate to English.
Original: "${text}"
Return ONLY the translation.`;
            break;
          default:
            throw new Error('Invalid enhance mode');
        }

        result = { text: await callAI(prompt) };
        break;
      }

      case 'summarize-video': {
        const { transcript, authorName } = data;
        const prompt = `Analyze this video transcript.
Transcript from ${authorName}:
"${transcript}"

Provide:
1. One-sentence summary (max 20 words)
2. Golden Quote (max 15 words)

Format:
SUMMARY: [summary]
GOLDEN_QUOTE: "[quote]"`;

        const response = await callAI(prompt);
        const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=\n|GOLDEN_QUOTE|$)/i);
        const quoteMatch = response.match(/GOLDEN_QUOTE:\s*"?([^"]+)"?/i);

        result = {
          summary: summaryMatch?.[1]?.trim() || 'Great testimonial.',
          goldenQuote: quoteMatch?.[1]?.trim() || transcript.substring(0, 50) + '...',
        };
        creditsCost = 2;
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log Usage
    if (userId) {
      console.log(`Logging usage: User ${userId}, Space ${spaceId}, Credits ${creditsCost}`);
      const { error: logError } = await supabaseAdmin
        .from('ai_usage_logs')
        .insert({
          user_id: userId,
          space_id: spaceId,
          credits: creditsCost,
          action: action
        });

      if (logError) console.error("Error inserting usage log:", logError);

      // Update Profile Total
      // We'll trust the trigger or client queries for now, 
      // but ideally we increment here.
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ ai_credits_used: (used + creditsCost) })
        .eq('id', userId);

      if (updateError) console.error("Error updating profile stats:", updateError);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Features error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(JSON.stringify({
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
