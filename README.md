# Original Goods Co. — Stripe Checkout store

A minimal storefront that redirects customers to a Stripe-hosted Checkout
page to pay, using the recommended low-code integration (Checkout Sessions
API + hosted page).

## 1. Install dependencies

```
npm install
```

## 2. Add your Stripe keys

Copy `.env.example` to `.env` and fill in your **test** keys from
https://dashboard.stripe.com/test/apikeys:

```
cp .env.example .env
```

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
DOMAIN=http://localhost:4242
```

Never commit `.env` or share your secret key (`sk_...`) — the `.gitignore`
already excludes it.

## 3. Edit your product catalog

Open `products.js` and add/edit your products. Amounts are in cents
(e.g. `3500` = $35.00).

## 4. Run it

```
node server.js
```

Visit http://localhost:4242 — click "Buy now" on any product to be
redirected to Stripe's hosted Checkout page. Use a
[test card](https://docs.stripe.com/testing) like `4242 4242 4242 4242`,
any future expiry date, and any 3-digit CVC.

## 5. (Recommended) Set up the webhook

The success page shows immediately after a customer pays, but the *reliable*
way to know a payment succeeded — and to trigger fulfillment (e.g. sending
that "access" email) — is the webhook, not the redirect. Customers can close
the tab before the redirect fires, so treat the webhook as the source of
truth.

To test webhooks locally, install the
[Stripe CLI](https://docs.stripe.com/stripe-cli) and run:

```
stripe listen --forward-to localhost:4242/webhook
```

This prints a webhook signing secret (`whsec_...`) — add it to your `.env`
as `STRIPE_WEBHOOK_SECRET`. When you go live, create a webhook endpoint in
the Stripe Dashboard pointed at `https://yourdomain.com/webhook` and use
the signing secret it gives you there instead.

## 6. Going live

1. Complete your Stripe account activation (business details, bank
   account) in the Dashboard.
2. Switch the Dashboard toggle from **Test mode** to **Live mode**.
3. Swap your `.env` keys for the live `sk_live_...` / `pk_live_...` pair.
4. Update `DOMAIN` to your real production URL.
5. Re-create your webhook endpoint in live mode (test-mode webhooks don't
   carry over).

## Where to customize fulfillment

Look for the `TODO` comment in `server.js` inside the webhook handler —
that's where you'd trigger sending your access email, updating a database,
etc. once a payment is confirmed.
