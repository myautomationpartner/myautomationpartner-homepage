# My Automation Partner — Consulting Website

Static public website for the My Automation Partner consulting business.

## Current direction

The homepage presents MAP as an independent technology consultant for small businesses, with an initial focus on:

- social-media tool selection and setup
- customer-message and follow-up workflows
- practical AI adoption
- technology and subscription cleanup

The primary conversion path is a direct email conversation at `billing@myautomationpartner.com`. The homepage no longer promotes the former MAP portal product, subscriptions, trials, or software pricing.

## Structure

- `index.html` — current consulting homepage
- `assets/` — MAP brand marks and archived product imagery
- `customer-social-setup/` — existing public social-account setup reference
- `demo.html`, `login.html`, `signup/`, `beta-intake/` — legacy product surfaces retained temporarily during controlled decommission; they are not linked from the consulting homepage

## Hosting

- Cloudflare Pages project: `my-automation-partner`
- Production domain: `https://myautomationpartner.com`
- Production branch: `main`
- No build step is required

The website and Cloudflare account currently operate on free tiers. Preserve the `myautomationpartner.com` zone and the separate `proposals.myautomationpartner.com` dependency used by Delphi Processing.

## Local verification

Serve the repository root with any static HTTP server, then verify desktop, tablet, and mobile widths. The homepage must have no horizontal overflow, load the MAP mark successfully, and keep all consultation buttons pointed to the MAP billing mailbox.

## Deployment boundary

Changing the homepage must not delete or take over:

- the `myautomationpartner.com/portal/*` Worker route while the old portal is being archived
- `proposals.myautomationpartner.com`
- Supabase, Auth, Storage, or Edge Functions
- shared Cloudflare resources used by Delphi, Pacesetter, Family Hub, or SCRIC projects
