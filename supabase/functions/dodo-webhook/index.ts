import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, dodo-signature',
};

// Product ID to plan mapping
const PRODUCT_PLAN_MAP: Record<string, string> = {
  'pdt_0NWYVCyQdmrQ6theVIHik': 'pro',    // Vouchy Pro - $12/month
  'pdt_0NWYW0CEpophu7xCowSWa': 'agency', // Vouchy Agency - $45/month
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Check for both keys for consistency and debugging
    const WEBHOOK_SECRET = Deno.env.get('DODO_WEBHOOK_SECRET');
    const DODO_API_KEY = Deno.env.get('DODO_API_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Capture environment info for debugging (matches create-checkout logic)
    if (DODO_API_KEY) {
      const isTestMode = DODO_API_KEY.startsWith('test_') || DODO_API_KEY.startsWith('cdcj');
      console.log(`Environment matches create-checkout: ${isTestMode ? 'TEST' : 'LIVE'} mode active`);
    } else {
      console.warn('DODO_API_KEY not found in webhook function - check secrets consistency');
    }

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    // Get raw body for signature verification
    const rawBody = await req.text();

    // Get Dodo Payments webhook headers
    const webhookSignature = req.headers.get('webhook-signature');
    const webhookId = req.headers.get('webhook-id');
    const webhookTimestamp = req.headers.get('webhook-timestamp');

    // CRITICAL: Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET) {
      if (!webhookSignature || !webhookId || !webhookTimestamp) {
        console.error('Missing webhook signature headers', {
          hasSignature: !!webhookSignature,
          hasId: !!webhookId,
          hasTimestamp: !!webhookTimestamp
        });
        return new Response(
          JSON.stringify({ error: 'Missing signature headers' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Standard Webhooks signature format: HMAC_SHA256(base64_secret_bytes, msg)
      const signedMessage = `${webhookId}.${webhookTimestamp}.${rawBody}`;

      // Parse signatures from header (v1,prefix)
      const receivedSignatures = (webhookSignature || '').split(' ').map(s => {
        const parts = s.split(',');
        return parts.length === 2 && parts[0] === 'v1' ? parts[1] : null;
      }).filter(Boolean);

      let verified = false;
      let usedMethod = '';

      // Method 1: Decode Base64 Secret (Standard Webhooks Spec / Dodo)
      try {
        let cleanSecret = WEBHOOK_SECRET.startsWith('whsec_') ? WEBHOOK_SECRET.substring(6) : WEBHOOK_SECRET;
        // Ensure valid base64
        cleanSecret = cleanSecret.replace(/-/g, '+').replace(/_/g, '/');
        while (cleanSecret.length % 4) cleanSecret += '=';

        const keyBytes = Uint8Array.from(atob(cleanSecret), c => c.charCodeAt(0));
        const hmac = createHmac('sha256', keyBytes);
        hmac.update(signedMessage);
        const expectedSig = hmac.digest('base64');

        if (receivedSignatures.includes(expectedSig)) {
          verified = true;
          usedMethod = 'base64_secret';
        }
      } catch (e) {
        console.warn('Signature check with base64 secret failed:', e);
      }

      // Method 2: Raw String Secret (Fallback)
      if (!verified) {
        try {
          const hmac = createHmac('sha256', WEBHOOK_SECRET);
          hmac.update(signedMessage);
          const expectedSig = hmac.digest('base64');
          if (receivedSignatures.includes(expectedSig)) {
            verified = true;
            usedMethod = 'raw_secret';
          }
        } catch (e) {
          console.warn('Signature check with raw secret failed:', e);
        }
      }

      if (!verified) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`✅ Webhook signature verified using ${usedMethod}`);
    } else {
      console.warn('⚠️ WEBHOOK_SECRET not configured - signature verification skipped (INSECURE)');
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      // 1. Get the User ID from metadata (Preferred)
      const userId = payload.metadata?.user_id || payload.data?.metadata?.user_id;

      // 2. Fallback to Email if metadata is missing
      const customerEmail = payload.customer?.email ||
        payload.data?.customer?.email ||
        payload.billing?.email ||
        payload.data?.object?.customer_email;

      // 3. Extract product ID from ALL possible locations
      let productId = payload.product_id ||
        payload.data?.product_id ||
        payload.data?.object?.product_id ||
        payload.items?.[0]?.product_id ||
        payload.product?.id ||
        payload.data?.product?.id ||
        payload.line_items?.[0]?.product_id ||
        payload.subscription?.items?.[0]?.product_id ||
        payload.data?.subscription?.items?.[0]?.product_id;

      // 4. If no product ID but we have a subscription_id, fetch from Dodo API
      const subscriptionId = payload.subscription_id || payload.data?.subscription_id;

      if (!productId && subscriptionId) {
        console.log(`No product ID in payload, fetching subscription ${subscriptionId} from Dodo API`);

        const DODO_API_KEY = Deno.env.get('DODO_API_KEY');
        if (DODO_API_KEY) {
          const isTestMode = DODO_API_KEY.startsWith('test_') || DODO_API_KEY.startsWith('cdcj');
          const apiBaseUrl = isTestMode ? 'https://test.dodopayments.com' : 'https://live.dodopayments.com';

          try {
            const subResponse = await fetch(`${apiBaseUrl}/subscriptions/${subscriptionId}`, {
              headers: {
                'Authorization': `Bearer ${DODO_API_KEY}`,
                'Content-Type': 'application/json'
              }
            });

            if (subResponse.ok) {
              const subData = await subResponse.json();
              console.log('Fetched subscription data:', JSON.stringify(subData, null, 2));

              // Extract product ID from subscription
              productId = subData.product_id ||
                subData.items?.[0]?.product_id ||
                subData.line_items?.[0]?.product_id;
            } else {
              console.error('Failed to fetch subscription:', await subResponse.text());
            }
          } catch (error) {
            console.error('Error fetching subscription:', error);
          }
        }
      }

      console.log('Processing payment success:', {
        userId,
        customerEmail,
        productId,
        subscriptionId,
        eventType,
        // Log payload structure to help debug
        payloadKeys: Object.keys(payload),
        dataKeys: payload.data ? Object.keys(payload.data) : null
      });

      // Determine the plan from product ID
      const plan = productId ? PRODUCT_PLAN_MAP[productId] : null;

      if (!plan) {
        console.error('Unknown product ID:', productId);
        console.error('Full payload for debugging:', JSON.stringify(payload, null, 2));
        return new Response(
          JSON.stringify({ error: 'Unknown product ID', productId }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (userId) {
        // FAST PATH: Update using the ID directly
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            plan,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating plan by user ID:', updateError);
          throw updateError;
        }

        console.log(`Successfully upgraded user ID ${userId} to ${plan} plan`);

        return new Response(
          JSON.stringify({ success: true, plan, userId }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (customerEmail) {
        // SLOW PATH: Use email if ID wasn't in metadata
        console.log('No userId in metadata, falling back to email lookup');

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            plan,
            updated_at: new Date().toISOString()
          })
          .eq('email', customerEmail.toLowerCase());

        if (updateError) {
          console.error('Error updating plan by email:', updateError);
          throw updateError;
        }

        console.log(`Successfully upgraded user ${customerEmail} to ${plan} plan`);

        return new Response(
          JSON.stringify({ success: true, plan, email: customerEmail }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('No userId or email found in webhook payload');
        return new Response(
          JSON.stringify({ error: 'No user identifier found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
