# MAP Homepage Signup Intake Contract
Last updated: 2026-04-23

## Purpose
This document defines the public homepage signup payload, the intended same-origin intake route, the live fallback intake path, and the backend assumptions for the MAP Customer Onboarding Automation workstream.

## Public Route
- Page: `/signup/`
- Submission endpoint: `/api/onboarding/signup`

The browser should submit only to the same-origin MAP endpoint above. Public traffic should not post directly to a raw n8n webhook from the browser.

## Current Production Intake Path
- Intended primary route: `/api/onboarding/signup`
- Current live fallback: `https://zgkxrlednyovuytaejok.supabase.co/functions/v1/homepage-signup-intake`

Production currently falls back to the Supabase Edge Function because the Cloudflare Pages backend route still returns `404`. This is acceptable for now and is tracked as future cleanup.

The public signup experience is intentionally simplified to a single subscription:
- 30-day free trial
- no card required at signup
- `$25/month` only if the customer continues after the trial

## Current Hardening
- public intake endpoints now reject cross-site `Origin` / `Referer` values outside:
  - `myautomationpartner.com`
  - `www.myautomationpartner.com`
  - `localhost`
  - `127.0.0.1`
- shared-secret validation is not used on the browser-facing fallback path because the browser cannot safely hold that secret

## Canonical Submitted Payload
The signup page currently submits this JSON shape from the browser:

```json
{
  "business_name": "Example Studio Co.",
  "contact_name": "Jordan Lee",
  "contact_email": "jordan@example.com",
  "website_url": "https://www.example.com",
  "selected_plan": "starter",
  "phone": "",
  "primary_goal": "",
  "preferred_contact_method": "",
  "social_platforms_requested": [],
  "notes": "Need help getting our portal set up.",
  "agreed_to_terms": true,
  "company_address": ""
}
```

### Required fields
- `business_name`
- `contact_name`
- `contact_email`
- `website_url`
- `selected_plan`
- `agreed_to_terms`

### Optional fields currently collected
- `notes`

### Optional fields still supported by the backend but not currently shown in the public form
- `phone`
- `primary_goal`
- `preferred_contact_method`
- `social_platforms_requested`

### Bot-check field
- `company_address`
  - hidden honeypot
  - must remain blank

## Server-Side Intake Behavior
The same-origin Pages Function at `functions/api/onboarding/signup.js` and the live Supabase Edge fallback currently share the same contract:

1. accepts only `POST`
2. normalizes and validates the payload
3. rejects invalid or obviously spammy submissions
4. calls the live Supabase RPC `public.create_onboarding_signup(...)`
5. optionally forwards a structured internal event to a secure downstream webhook if configured
6. returns a success payload containing `signupId`, `runId`, duplicate-review state, and whether downstream provisioning forwarding is enabled

## Supabase Mapping
The intake function maps the homepage payload to the live DB contract in `db-agent/ONBOARDING_CONTRACT.md`.

Current RPC call target:
- `public.create_onboarding_signup(...)`

Current RPC argument mapping:
- `p_business_name <- business_name`
- `p_contact_name <- contact_name`
- `p_contact_email <- contact_email`
- `p_website_url <- website_url`
- `p_selected_plan <- selected_plan`
- `p_agreed_to_terms <- agreed_to_terms`
- `p_phone <- phone`
- `p_primary_goal <- primary_goal`
- `p_notes <- notes`
- `p_preferred_contact_method <- preferred_contact_method`
- `p_social_platforms_requested <- social_platforms_requested`
- `p_intake_source <- homepage_signup` by default
- `p_flow_version <- homepage-signup-v1` by default

## Environment Variables
The intended same-origin intake route expects these Cloudflare Pages / runtime variables:

### Required now
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Optional but recommended
- `ONBOARDING_INTAKE_SOURCE`
- `ONBOARDING_FLOW_VERSION`
- `ONBOARDING_FORWARD_WEBHOOK_URL`
- `ONBOARDING_FORWARD_WEBHOOK_SECRET`

## Current Downstream State
The live fallback endpoint is already forwarding into:
- `https://n8n.myautomationpartner.com/webhook/client-onboarding-provisioning`

So production signup now creates the canonical Supabase intake record and queues downstream provisioning automatically.

## Current Billing Posture
- signup currently collects no payment information
- this public form is intended to start a 30-day free trial without card collection
- MAP should send a billing reminder when 5 days remain in the trial
- payment collection belongs in a later Stripe Checkout step, not in the initial homepage signup payload

## Future Cleanup
- keep the Supabase Edge fallback as the current production intake backend
- repair/remove the broken Cloudflare Pages backend route at `/api/onboarding/signup` only if MAP later wants same-origin intake restored
- revisit shared-secret validation only if the intake path becomes fully server-to-server later

## Recommended n8n Handoff Shape
If MAP enables the forwarding webhook, the same-origin intake route will send:

```json
{
  "request_id": "uuid",
  "intake_source": "homepage_signup",
  "flow_version": "homepage-signup-v1",
  "signup": {
    "...": "validated homepage payload"
  },
  "supabase_result": {
    "signup_id": "uuid",
    "run_id": "uuid",
    "duplicate_status": "unique",
    "duplicate_reasons": [],
    "manual_attention_required": false,
    "existing_client_id": null,
    "existing_client_slug": null
  }
}
```

This keeps the DB contract as the durable source of truth while still giving n8n the identifiers it needs for stage advancement and provisioning.
