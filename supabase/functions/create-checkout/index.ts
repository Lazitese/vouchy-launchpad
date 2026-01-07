const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  productId: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DODO_API_KEY = Deno.env.get('DODO_API_KEY');
    if (!DODO_API_KEY) {
      console.error('DODO_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured (Missing DODO_API_KEY)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    const { productId, customerEmail, customerName, returnUrl }: CheckoutRequest = await req.json();

    console.log('Creating checkout session for:', { productId, customerEmail, customerName });

    // Automatically determine environment based on key prefix
    const isTestMode = DODO_API_KEY.startsWith('test_');
    const apiBaseUrl = isTestMode ? 'https://test.dodopayments.com' : 'https://live.dodopayments.com';

    console.log(`Using Dodo Payments (${isTestMode ? 'TEST' : 'LIVE'})`);

    const response = await fetch(`${apiBaseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DODO_API_KEY}`,
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          }
        ],
        customer: {
          email: customerEmail,
          name: customerName,
        },
        payment_link: true,
        success_url: returnUrl || 'https://vouchy.click/dashboard?payment=success',
        metadata: {
          customer_email: customerEmail,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dodo API error:', response.status, errorText);
      throw new Error(`Failed to create checkout session: ${response.status}`);
    }

    const data = await response.json();
    console.log('Checkout session created:', data);

    return new Response(
      JSON.stringify({
        paymentLink: data.checkout_url,
        sessionId: data.session_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Checkout error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
