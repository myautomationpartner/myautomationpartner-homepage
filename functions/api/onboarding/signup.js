const CANONICAL_PLAN = 'starter';
const CONTACT_METHOD_VALUES = new Set(['', 'email', 'phone']);
const GOAL_VALUES = new Set([
  '',
  'social_growth',
  'client_reporting',
  'content_scheduling',
  'operations_automation',
  'portal_rollout',
]);
const BUSINESS_TYPE_VALUES = new Set([
  '',
  'dance_studio',
  'gym_fitness',
  'salon_spa',
  'restaurant_cafe',
  'professional_services',
  'home_services',
  'real_estate',
  'medical_wellness',
  'other_small_business',
]);
const ALLOWED_HOSTS = new Set([
  'myautomationpartner.com',
  'www.myautomationpartner.com',
  'localhost',
  '127.0.0.1',
]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function trimText(value, maxLength = 1000) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, maxLength);
}

function normalizeUrl(value) {
  const raw = trimText(value, 2048);
  if (!raw) {
    return '';
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    return '';
  }
}

function normalizeArray(value, maxItems = 8) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => trimText(String(item || ''), 40).toLowerCase())
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeEmail(value) {
  return trimText(value, 320).toLowerCase();
}

function normalizePayload(raw) {
  const preferredContactMethod = trimText(raw.preferred_contact_method, 20).toLowerCase();
  const requestedPlan = trimText(raw.selected_plan, 40).toLowerCase();
  const primaryGoal = trimText(raw.primary_goal, 40).toLowerCase();
  const businessType = trimText(raw.business_type, 40).toLowerCase();

  return {
    business_name: trimText(raw.business_name, 160),
    contact_name: trimText(raw.contact_name, 160),
    contact_email: normalizeEmail(raw.contact_email),
    website_url: normalizeUrl(raw.website_url),
    selected_plan: requestedPlan || CANONICAL_PLAN,
    business_type: businessType,
    phone: trimText(raw.phone, 40),
    primary_goal: primaryGoal,
    preferred_contact_method: preferredContactMethod,
    social_platforms_requested: normalizeArray(raw.social_platforms_requested),
    notes: trimText(raw.notes, 4000),
    agreed_to_terms: raw.agreed_to_terms === true,
    company_address: trimText(raw.company_address, 120),
  };
}

function validatePayload(payload) {
  if (payload.company_address) {
    return 'Submission rejected.';
  }
  if (!payload.business_name) {
    return 'business_name is required';
  }
  if (!payload.contact_name) {
    return 'contact_name is required';
  }
  if (!payload.contact_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contact_email)) {
    return 'contact_email must be valid';
  }
  if (!payload.website_url) {
    return 'website_url must be valid';
  }
  if (!payload.business_type) {
    return 'business_type is required';
  }
  if (!payload.agreed_to_terms) {
    return 'agreed_to_terms must be true';
  }
  if (!BUSINESS_TYPE_VALUES.has(payload.business_type)) {
    return 'business_type is invalid';
  }
  if (!CONTACT_METHOD_VALUES.has(payload.preferred_contact_method)) {
    return 'preferred_contact_method is invalid';
  }
  if (!GOAL_VALUES.has(payload.primary_goal)) {
    return 'primary_goal is invalid';
  }

  return '';
}

function hasAllowedRequestOrigin(request) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const values = [origin, referer].filter(Boolean);
  if (values.length === 0) {
    return true;
  }

  return values.every((value) => {
    try {
      return ALLOWED_HOSTS.has(new URL(value).hostname);
    } catch {
      return false;
    }
  });
}

async function createSignupInSupabase(payload, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('MAP signup intake is not configured yet.');
  }

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/create_onboarding_signup`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      p_business_name: payload.business_name,
      p_contact_name: payload.contact_name,
      p_contact_email: payload.contact_email,
      p_website_url: payload.website_url,
      p_selected_plan: payload.selected_plan,
      p_business_type: payload.business_type || null,
      p_agreed_to_terms: true,
      p_phone: payload.phone || null,
      p_primary_goal: payload.primary_goal || null,
      p_notes: payload.notes || null,
      p_preferred_contact_method: payload.preferred_contact_method || null,
      p_social_platforms_requested: payload.social_platforms_requested,
      p_intake_source: env.ONBOARDING_INTAKE_SOURCE || 'homepage_signup',
      p_flow_version: env.ONBOARDING_FLOW_VERSION || 'homepage-signup-v1',
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !Array.isArray(data) || data.length === 0) {
    const detail = data && typeof data === 'object'
      ? data.message || data.error || JSON.stringify(data)
      : 'Unknown RPC error';
    throw new Error(`Supabase intake failed: ${detail}`);
  }

  return data[0];
}

async function forwardToProvisioningWebhook(payload, signupResult, requestId, env) {
  if (!env.ONBOARDING_FORWARD_WEBHOOK_URL) {
    return false;
  }

  const response = await fetch(env.ONBOARDING_FORWARD_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(env.ONBOARDING_FORWARD_WEBHOOK_SECRET
        ? { 'x-map-intake-secret': env.ONBOARDING_FORWARD_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({
      request_id: requestId,
      intake_source: env.ONBOARDING_INTAKE_SOURCE || 'homepage_signup',
      flow_version: env.ONBOARDING_FLOW_VERSION || 'homepage-signup-v1',
      signup: payload,
      supabase_result: {
        signup_id: signupResult.signup_id,
        run_id: signupResult.run_id,
        duplicate_status: signupResult.duplicate_status,
        duplicate_reasons: signupResult.duplicate_reasons,
        manual_attention_required: signupResult.manual_attention_required,
        existing_client_id: signupResult.existing_client_id,
        existing_client_slug: signupResult.existing_client_slug,
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    console.error('Provisioning forward failed', {
      requestId,
      status: response.status,
      message,
    });
    return false;
  }

  return true;
}

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();

  try {
    if (!hasAllowedRequestOrigin(context.request)) {
      return json({ success: false, error: 'Invalid request origin.' }, 403);
    }

    const rawText = await context.request.text();
    if (!rawText || rawText.length > 20000) {
      return json({ success: false, error: 'Invalid request body.' }, 400);
    }

    const rawBody = JSON.parse(rawText);
    const payload = normalizePayload(rawBody);
    const validationError = validatePayload(payload);

    if (validationError) {
      return json({ success: false, error: validationError }, 400);
    }

    const signupResult = await createSignupInSupabase(payload, context.env);
    const queuedForProvisioning = await forwardToProvisioningWebhook(
      payload,
      signupResult,
      requestId,
      context.env
    );

    return json({
      success: true,
      requestId,
      signupId: signupResult.signup_id,
      runId: signupResult.run_id,
      duplicateStatus: signupResult.duplicate_status,
      manualAttentionRequired: signupResult.manual_attention_required,
      queuedForProvisioning,
    });
  } catch (error) {
    console.error('Homepage signup intake failed', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });

    return json(
      {
        success: false,
        error: 'MAP could not submit your signup right now. Please try again or contact billing@myautomationpartner.com.',
        requestId,
      },
      500
    );
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      allow: 'POST, OPTIONS',
      'cache-control': 'no-store',
    },
  });
}
