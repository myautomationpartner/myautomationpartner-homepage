# MAP Homepage Signup Intake Contract
Last updated: 2026-04-23

## Purpose
This document defines the public homepage signup payload, the same-origin intake route, and the backend assumptions for the MAP Customer Onboarding Automation workstream.

## Public Route
- Page: `/signup/`
- Submission endpoint: `/api/onboarding/signup`

The browser should submit only to the same-origin MAP endpoint above. Public traffic should not post directly to a raw n8n webhook from the browser.

## Canonical Submitted Payload
The signup page currently submits this JSON shape from the browser:

```json
{
  "business_name": "Example Studio Co.",
  "contact_name": "Jordan Lee",
  "contact_email": "jordan@example.com",
  "website_url": "https://www.example.com",
  "selected_plan": "growth",
  "phone": "(555) 555-5555",
  "primary_goal": "portal_rollout",
  "preferred_contact_method": "email",
  "social_platforms_requested": ["instagram", "facebook"],
  "notes": "Need a MAP-managed portal domain for launch.",
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
- `phone`
- `primary_goal`
- `preferred_contact_method`
- `social_platforms_requested`
- `notes`

### Bot-check field
- `company_address`
  - hidden honeypot
  - must remain blank

## Server-Side Intake Behavior
The same-origin Pages Function at `functions/api/onboarding/signup.js` currently:

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
The intake route expects these Cloudflare Pages / runtime variables:

### Required now
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Optional but recommended
- `ONBOARDING_INTAKE_SOURCE`
- `ONBOARDING_FLOW_VERSION`
- `ONBOARDING_FORWARD_WEBHOOK_URL`
- `ONBOARDING_FORWARD_WEBHOOK_SECRET`

## Downstream Service Still Needed
If `ONBOARDING_FORWARD_WEBHOOK_URL` is not configured, the homepage signup still creates the canonical Supabase intake record, but it does not yet hand off automatically into the next provisioning workflow.

That means the remaining downstream implementation is:
- a secure internal webhook or service endpoint for n8n intake/provisioning handoff
- workflow logic that consumes the signup/run identifiers returned from `create_onboarding_signup(...)`
- any additional rate limiting, alerting, and operational logging MAP wants on the intake layer

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
