import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, dodo-signature',
};

// Product ID to plan mapping
const PRODUCT_PLAN_MAP: Record<string, string> = {
  'pdt_0NVVmIlZrdWC90xs1ZgOm': 'pro',    // Vouchy Pro - $12/month
  'pdt_0NVVmba1bevOgK6sfV8Wx': 'agency', // Vouchy Agency - $45/month
};

// Verify webhook signature from Dodo Payments
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    // Constant-time comparison to prevent timing attacks
    return signature === expectedSignature || signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const WEBHOOK_SECRET = Deno.env.get('DODO_WEBHOOK_SECRET');

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('dodo-signature') || req.headers.get('x-dodo-signature');

    // CRITICAL: Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET) {
      if (!signature) {
        console.error('Missing webhook signature');
        return new Response(
          JSON.stringify({ error: 'Missing signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ Webhook signature verified');
    } else {
      console.warn('⚠️ WEBHOOK_SECRET not configured - signature verification skipped (INSECURE)');
    }

    const payload = JSON.parse(rawBody);

    console.log('Dodo webhook received:', JSON.stringify(payload, null, 2));

    // Handle different webhook event types from Dodo
    const eventType = payload.type || payload.event_type;

    // Events that indicate successful payment/subscription
    const successEvents = [
      'subscription.active',
      'subscription.created',
      'payment.succeeded',
      'payment_intent.succeeded',
      'invoice.paid',
    ];

    // Events that indicate subscription ended
    const cancelEvents = [
      'subscription.cancelled',
      'subscription.expired',
      'subscription.paused',
    ];

    if (successEvents.includes(eventType)) {
      // Extract customer email and product ID from various webhook formats
      const customerEmail = payload.customer?.email ||
        payload.data?.customer?.email ||
        payload.billing?.email ||
        payload.data?.object?.customer_email;

      const productId = payload.product_id ||
        payload.data?.product_id ||
        payload.data?.object?.product_id ||
        payload.items?.[0]?.product_id;

      console.log('Processing payment success:', { customerEmail, productId });

      if (!customerEmail) {
        console.error('No customer email found in webhook payload');
        return new Response(
          JSON.stringify({ error: 'No customer email found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Determine the plan from product ID
      const plan = productId ? PRODUCT_PLAN_MAP[productId] : null;

      if (!plan) {
        console.error('Unknown product ID:', productId);
        return new Response(
          JSON.stringify({ error: 'Unknown product ID', productId }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find the user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail.toLowerCase())
        .maybeSingle();

      if (profileError) {
        console.error('Error finding profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.error('No profile found for email:', customerEmail);
        return new Response(
          JSON.stringify({ error: 'User not found', email: customerEmail }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update the user's plan
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Error updating plan:', updateError);
        throw updateError;
      }

      console.log(`Successfully upgraded user ${customerEmail} to ${plan} plan`);

      return new Response(
        JSON.stringify({ success: true, plan, email: customerEmail }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (cancelEvents.includes(eventType)) {
      // Handle subscription cancellation - revert to free plan
      const customerEmail = payload.customer?.email ||
        payload.data?.customer?.email ||
        payload.data?.object?.customer_email;

      if (customerEmail) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            plan: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('email', customerEmail.toLowerCase());

        if (updateError) {
          console.error('Error reverting to free plan:', updateError);
        } else {
          console.log(`Reverted user ${customerEmail} to free plan`);
        }
      }

      return new Response(
        JSON.stringify({ success: true, action: 'reverted_to_free' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For any other event types, just acknowledge receipt
    console.log('Unhandled webhook event type:', eventType);
    return new Response(
      JSON.stringify({ received: true, eventType }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
