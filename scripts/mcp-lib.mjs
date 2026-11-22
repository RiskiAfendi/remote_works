const STATUS_VALUES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted'];
const EMPLOYMENT_VALUES = ['Full-time', 'Part-time', 'Contract', 'Hourly', 'Internship'];
const PAYMENT_VALUES = ['IDR', 'International', 'Both'];
const REGION_VALUES = ['Indonesia', 'International', 'Both'];
const JOB_SOURCE_STATUS_VALUES = ['active', 'inactive', 'suspended'];
const DIRECTORY_CATEGORY_VALUES = ['ai', 'tech', 'general', 'startup', 'design', 'marketing', 'other'];
const DIRECTORY_REGION_VALUES = ['Worldwide', 'Indonesia', 'US / Regional', 'All'];
const DIRECTORY_COMPENSATION_VALUES = ['Hourly', 'Salaried', 'Mixed'];

export function requireValue(value, name) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${name} is required`);
  }
  return value.trim();
}

export function assertEnum(value, allowed, name) {
  if (!allowed.includes(value)) {
    throw new Error(`${name} must be one of: ${allowed.join(', ')}`);
  }
  return value;
}

export function normalizeApplication(input) {
  const statusMap = {
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    ghosted: 'Ghosted',
  };
  const employmentMap = {
    'full-time': 'Full-time',
    fulltime: 'Full-time',
    'full time': 'Full-time',
    'part-time': 'Part-time',
    parttime: 'Part-time',
    'part time': 'Part-time',
    contract: 'Contract',
    hourly: 'Hourly',
    internship: 'Internship',
  };

  const statusRaw = String(input.status || 'Applied').trim();
  const employmentRaw = String(input.employment_type || 'Full-time').trim();
  const status = statusMap[statusRaw.toLowerCase()] || statusRaw;
  const employmentType =
    employmentMap[employmentRaw.toLowerCase()] || employmentRaw;

  assertEnum(status, STATUS_VALUES, 'status');
  assertEnum(employmentType, EMPLOYMENT_VALUES, 'employment_type');

  const appliedDate = new Date(input.applied_date || new Date().toISOString().slice(0, 10));
  if (Number.isNaN(appliedDate.getTime())) {
    throw new Error('applied_date must be a valid ISO date');
  }

  const skillsRequired = Array.isArray(input.skills_required)
    ? input.skills_required.map((item) => String(item).trim()).filter(Boolean)
    : String(input.skills_required || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    company_name: requireValue(input.company_name, 'company_name'),
    job_title: requireValue(input.job_title, 'job_title'),
    source_url: String(input.source_url || '').trim(),
    apply_url: String(input.apply_url || '').trim(),
    account_email: String(input.account_email || '').trim(),
    applied_date: appliedDate.toISOString(),
    status,
    image_url: String(input.image_url || '').trim(),
    salary_rate: String(input.salary_rate || '').trim(),
    employment_type: employmentType,
    skills_required: skillsRequired,
    notes: String(input.notes || '').trim(),
  };
}

export function normalizeJobSource(input) {
  return {
    name: requireValue(input.name, 'name'),
    url: requireValue(input.url, 'url'),
    logo_url: String(input.logo_url || '').trim(),
    payment_category: assertEnum(
      String(input.payment_category || 'International'),
      PAYMENT_VALUES,
      'payment_category'
    ),
    region_category: assertEnum(
      String(input.region_category || 'International'),
      REGION_VALUES,
      'region_category'
    ),
    login_email: String(input.login_email || '').trim(),
    account_username: String(input.account_username || '').trim(),
    status: assertEnum(String(input.status || 'active'), JOB_SOURCE_STATUS_VALUES, 'status'),
    notes: String(input.notes || '').trim(),
  };
}

export function normalizeJobDirectory(input) {
  return {
    name: requireValue(input.name, 'name'),
    url: requireValue(input.url, 'url'),
    logo_url: String(input.logo_url || '').trim(),
    description: requireValue(input.description, 'description'),
    category: assertEnum(String(input.category), DIRECTORY_CATEGORY_VALUES, 'category'),
    region_scope: assertEnum(
      String(input.region_scope),
      DIRECTORY_REGION_VALUES,
      'region_scope'
    ),
    compensation_model: assertEnum(
      String(input.compensation_model),
      DIRECTORY_COMPENSATION_VALUES,
      'compensation_model'
    ),
    tags: Array.isArray(input.tags)
      ? input.tags.map((item) => String(item).trim()).filter(Boolean)
      : String(input.tags || '')
          .split(',')
          .map((item) => String(item).trim())
          .filter(Boolean),
  };
}

export function toFirestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(new Date(value).getTime())) {
      return { timestampValue: new Date(value).toISOString() };
    }
    return { stringValue: value };
  }
  if (typeof value === 'object') {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }
  return { stringValue: String(value) };
}

export function fromFirestoreFields(fields = {}) {
  const output = {};
  for (const [key, value] of Object.entries(fields)) {
    output[key] = fromFirestoreValue(value);
  }
  return output;
}

function fromFirestoreValue(value) {
  if ('nullValue' in value) return null;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return new Date(value.timestampValue).toISOString();
  if ('stringValue' in value) return value.stringValue;
  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ('mapValue' in value) return fromFirestoreFields(value.mapValue.fields);
  return null;
}
