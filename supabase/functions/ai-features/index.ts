import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

async function callAI(prompt: string): Promise<string> {
  console.log('Calling Lovable AI with prompt:', prompt.substring(0, 100) + '...');
  
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 402) {
      throw new Error('AI credits exhausted. Please upgrade your plan.');
    }
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  console.log('AI response received, length:', text.length);
  return text;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    console.log('AI Features request - Action:', action);

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let result: any;

    switch (action) {
      case 'generate-script': {
        // Generate teleprompter script from keywords
        const { keywords, questions } = data;
        const prompt = `You are a testimonial coach. Generate a natural, conversational script for someone recording a video testimonial.

Keywords/Context: ${keywords}

Questions to answer:
${questions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

Generate a flowing, authentic script that answers each question naturally. The script should:
- Sound conversational, not robotic
- Be 60-90 seconds when spoken
- Include natural transitions between points
- Feel genuine and heartfelt

Return ONLY the script text, no headers or labels.`;

        result = { script: await callAI(prompt) };
        break;
      }

      case 'enhance-text': {
        // Enhance testimonial text
        const { text, mode } = data;
        let prompt: string;

        switch (mode) {
          case 'shorten':
            prompt = `Make this testimonial more concise while keeping its impact and authenticity. Reduce it to about 50% of the original length.

Original testimonial:
"${text}"

Return ONLY the shortened testimonial text, no explanations.`;
            break;

          case 'simplify':
            prompt = `Simplify this testimonial to be clearer and easier to read. Use simpler words and shorter sentences while keeping the genuine sentiment.

Original testimonial:
"${text}"

Return ONLY the simplified testimonial text, no explanations.`;
            break;

          case 'translate':
            prompt = `Translate this testimonial to English. Keep the original tone and sentiment.

Original testimonial:
"${text}"

Return ONLY the translated testimonial text, no explanations.`;
            break;

          default:
            throw new Error('Invalid enhance mode');
        }

        result = { text: await callAI(prompt) };
        break;
      }

      case 'summarize-video': {
        // Generate summary and golden quote from video transcript/content
        const { transcript, authorName } = data;
        const prompt = `Analyze this video testimonial transcript and extract key information.

Transcript from ${authorName}:
"${transcript}"

Provide:
1. A one-sentence summary (max 20 words) that captures the essence
2. The most impactful "Golden Quote" - a short, powerful snippet that could be used in marketing (max 15 words)

Format your response EXACTLY like this (keep the labels):
SUMMARY: [your one-sentence summary]
GOLDEN_QUOTE: "[the golden quote]"`;

        const response = await callAI(prompt);
        
        // Parse the response
        const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=\n|GOLDEN_QUOTE|$)/i);
        const quoteMatch = response.match(/GOLDEN_QUOTE:\s*"?([^"]+)"?/i);

        result = {
          summary: summaryMatch?.[1]?.trim() || 'Great testimonial from a satisfied customer.',
          goldenQuote: quoteMatch?.[1]?.trim() || transcript.substring(0, 50) + '...',
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('AI Features response:', JSON.stringify(result).substring(0, 200));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Features error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
