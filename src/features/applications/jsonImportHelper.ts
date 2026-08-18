import { CreateApplicationData, ApplicationStatus, EmploymentType } from '@/lib/types';
import { validateApplication, ApplicationFormErrors } from '@/lib/validations/applicationValidation';

export const AI_APPLICATION_IMPORT_TEMPLATE = `Please extract or format the job application details into the following JSON schema. Return ONLY valid JSON wrapped in a \`\`\`json code block.

### Rules & Field Specifications:
1. "company_name" (string, REQUIRED): Name of the hiring company (e.g., "Automattic", "OpenAI").
2. "job_title" (string, REQUIRED): Title of the position applied for (e.g., "Senior Full Stack Engineer").
3. "account_email" (string, REQUIRED): The email address used to submit the application (e.g., "john.doe@email.com").
4. "applied_date" (string, REQUIRED): Application date in YYYY-MM-DD format (e.g., "2026-08-18").
5. "status" (string, REQUIRED): Must be EXACTLY one of: "Applied" | "Interview" | "Offer" | "Rejected" | "Ghosted".
6. "employment_type" (string, REQUIRED): Must be EXACTLY one of: "Full-time" | "Part-time" | "Contract" | "Hourly" | "Internship".
7. "source_url" (string, OPTIONAL): URL where the job listing was found (e.g., "https://linkedin.com/jobs/view/...").
8. "apply_url" (string, OPTIONAL): Direct link to application or job board submission (e.g., "https://company.greenhouse.io/...").
9. "salary_rate" (string, OPTIONAL): Salary or hourly compensation (e.g., "$120,000/yr", "$60/hr", or "Rp 25.000.000/bln").
10. "skills_required" (string, OPTIONAL): Comma-separated list of required tech stack or skills (e.g., "React, TypeScript, Next.js, Node.js").
11. "notes" (string, OPTIONAL): Notes about interview stages, HR contacts, referral notes, or portfolio links.
12. "image_url" (string, OPTIONAL): Set to empty string "" (screenshot proof will be uploaded manually later).

### Example JSON Template:
\`\`\`json
{
  "company_name": "Automattic",
  "job_title": "Senior React Developer",
  "account_email": "john.doe@email.com",
  "applied_date": "2026-08-18",
  "status": "Applied",
  "employment_type": "Full-time",
  "source_url": "https://weworkremotely.com/jobs/12345",
  "apply_url": "https://automattic.com/work-with-us/apply",
  "salary_rate": "$110k - $130k / year",
  "skills_required": "React, TypeScript, Next.js, Tailwind CSS, GraphQL",
  "notes": "Applied via company careers page. Recruiter reached out on LinkedIn.",
  "image_url": ""
}
\`\`\``;

const STATUS_MAP: Record<string, ApplicationStatus> = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
};

const EMPLOYMENT_MAP: Record<string, EmploymentType> = {
  'full-time': 'Full-time',
  'fulltime': 'Full-time',
  'full time': 'Full-time',
  'part-time': 'Part-time',
  'parttime': 'Part-time',
  'part time': 'Part-time',
  'contract': 'Contract',
  'hourly': 'Hourly',
  'internship': 'Internship',
  'intern': 'Internship',
};

export interface ParseJsonResult {
  isValid: boolean;
  data?: CreateApplicationData;
  parseError?: string;
  errors?: ApplicationFormErrors;
}

export function extractJsonFromText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();

  // Match markdown code block (```json ... ``` or ``` ... ```)
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    return fenceMatch[1].trim();
  }

  // Look for outer JSON object braces { ... }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.substring(firstBrace, lastBrace + 1).trim();
  }

  return trimmed;
}

export function parseAndValidateApplicationJson(rawInput: string): ParseJsonResult {
  if (!rawInput || !rawInput.trim()) {
    return {
      isValid: false,
      parseError: 'Input is empty. Please paste your AI-generated JSON.',
    };
  }

  const jsonString = extractJsonFromText(rawInput);

  let rawObj: Record<string, unknown>;
  try {
    rawObj = JSON.parse(jsonString);
  } catch {
    return {
      isValid: false,
      parseError: 'Invalid JSON format. Please ensure the pasted text contains valid JSON syntax.',
    };
  }

  if (typeof rawObj !== 'object' || rawObj === null || Array.isArray(rawObj)) {
    return {
      isValid: false,
      parseError: 'Invalid structure. Expected a single JSON object with application fields.',
    };
  }

  // Status coercion
  const rawStatus = typeof rawObj.status === 'string' ? rawObj.status.trim() : '';
  const normalizedStatus = (STATUS_MAP[rawStatus.toLowerCase()] || rawStatus) as ApplicationStatus;

  // Employment type coercion
  const rawEmp = typeof rawObj.employment_type === 'string' ? rawObj.employment_type.trim() : '';
  const normalizedEmp = (EMPLOYMENT_MAP[rawEmp.toLowerCase()] || rawEmp) as EmploymentType;

  // Skills coercion
  let skillsArray: string[] = [];
  if (Array.isArray(rawObj.skills_required)) {
    skillsArray = rawObj.skills_required.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof rawObj.skills_required === 'string') {
    skillsArray = rawObj.skills_required.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Date coercion
  let appliedDate: Date;
  if (rawObj.applied_date) {
    appliedDate = new Date(String(rawObj.applied_date));
  } else {
    appliedDate = new Date(NaN);
  }

  const sanitizedData: CreateApplicationData = {
    company_name: typeof rawObj.company_name === 'string' ? rawObj.company_name.trim() : '',
    job_title: typeof rawObj.job_title === 'string' ? rawObj.job_title.trim() : '',
    account_email: typeof rawObj.account_email === 'string' ? rawObj.account_email.trim() : '',
    applied_date: appliedDate,
    status: normalizedStatus,
    employment_type: normalizedEmp,
    source_url: typeof rawObj.source_url === 'string' ? rawObj.source_url.trim() : '',
    apply_url: typeof rawObj.apply_url === 'string' ? rawObj.apply_url.trim() : '',
    salary_rate:
      rawObj.salary_rate !== undefined && rawObj.salary_rate !== null
        ? String(rawObj.salary_rate).trim()
        : '',
    skills_required: skillsArray,
    notes: typeof rawObj.notes === 'string' ? rawObj.notes.trim() : '',
    image_url: typeof rawObj.image_url === 'string' ? rawObj.image_url.trim() : '',
  };

  const validation = validateApplication(sanitizedData);
  if (!validation.isValid) {
    return {
      isValid: false,
      data: sanitizedData,
      errors: validation.errors,
    };
  }

  return {
    isValid: true,
    data: sanitizedData,
  };
}
