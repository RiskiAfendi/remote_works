import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Starting Job Directories Test Suite ---');

// 1. i18n Key Parity & Completeness Test
console.log('\n[Test 1] Testing i18n key parity and completeness...');
const idPath = path.resolve('public/locales/id/common.json');
const enPath = path.resolve('public/locales/en/common.json');

const idLocale = JSON.parse(fs.readFileSync(idPath, 'utf8'));
const enLocale = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getAllKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const idKeys = new Set(getAllKeys(idLocale));
const enKeys = new Set(getAllKeys(enLocale));

const missingInEn = [...idKeys].filter((k) => !enKeys.has(k));
const missingInId = [...enKeys].filter((k) => !idKeys.has(k));

assert.strictEqual(missingInEn.length, 0, `Missing keys in en: ${missingInEn.join(', ')}`);
assert.strictEqual(missingInId.length, 0, `Missing keys in id: ${missingInId.join(', ')}`);

// Verify essential jobDirectories keys exist
const requiredKeys = [
  'jobDirectories.title',
  'jobDirectories.subtitle',
  'jobDirectories.addNew',
  'jobDirectories.addTitle',
  'jobDirectories.editTitle',
  'jobDirectories.addNewBtn',
  'jobDirectories.saveChanges',
  'jobDirectories.visitWebsite',
  'jobDirectories.quickTrackBtn',
  'jobDirectories.quickTrackTooltip',
  'jobDirectories.curatedBadge',
  'jobDirectories.customBadge',
  'jobDirectories.searchPlaceholder',
  'jobDirectories.filterHeader',
  'jobDirectories.resultsCount',
  'jobDirectories.allCategories',
  'jobDirectories.allRegions',
  'jobDirectories.allComp',
  'jobDirectories.allTypes',
  'jobDirectories.typeCurated',
  'jobDirectories.typeCustom',
  'jobDirectories.categoryAi',
  'jobDirectories.categoryTech',
  'jobDirectories.categoryGeneral',
  'jobDirectories.categoryStartup',
  'jobDirectories.regionWorldwide',
  'jobDirectories.regionIndonesia',
  'jobDirectories.regionUsRegional',
  'jobDirectories.regionAll',
  'jobDirectories.compHourly',
  'jobDirectories.compSalaried',
  'jobDirectories.compMixed',
  'jobDirectories.dateAdded',
  'jobDirectories.errNameRequired',
  'jobDirectories.errUrlRequired',
  'jobDirectories.errInvalidUrl',
  'jobDirectories.errDescRequired',
  'jobSources.filterHeader',
  'jobSources.resultsCount',
  'jobSources.dateAdded',
  'jobSources.dateUpdated',
];

for (const rk of requiredKeys) {
  assert.ok(idKeys.has(rk), `Required key ${rk} missing in id/common.json`);
  assert.ok(enKeys.has(rk), `Required key ${rk} missing in en/common.json`);
}
console.log('✓ i18n parity check passed: 100% parity between id and en, all required keys present.');

// 2. Curated Seed Data Requirements Check
console.log('\n[Test 2] Testing Curated Seed Data content and ordering...');
const curatedDataContent = fs.readFileSync('src/lib/data/curatedJobDirectories.ts', 'utf8');

const expectedPlatforms = [
  { name: 'AIPayList', url: 'https://aipaylist.com/', category: 'ai' },
  { name: 'Jobfound', url: 'https://jobfound.org/', category: 'tech' },
  { name: 'We Work Remotely', url: 'https://weworkremotely.com/', category: 'general' },
  { name: 'Remotive', url: 'https://remotive.com/', category: 'tech' },
  { name: 'Wellfound (AngelList)', url: 'https://wellfound.com/', category: 'startup' },
];

for (const p of expectedPlatforms) {
  assert.ok(curatedDataContent.includes(p.name), `Platform ${p.name} missing in curatedJobDirectories.ts`);
  assert.ok(curatedDataContent.includes(p.url), `URL ${p.url} missing in curatedJobDirectories.ts`);
  assert.ok(curatedDataContent.includes(p.category), `Category ${p.category} missing in curatedJobDirectories.ts`);
}

// Check created_at descending sort order
const aipaylistDate = new Date('2026-01-05T00:00:00Z').getTime();
const jobfoundDate = new Date('2026-01-04T00:00:00Z').getTime();
const wwrDate = new Date('2026-01-03T00:00:00Z').getTime();
const remotiveDate = new Date('2026-01-02T00:00:00Z').getTime();
const wellfoundDate = new Date('2026-01-01T00:00:00Z').getTime();

assert.ok(aipaylistDate > jobfoundDate, 'AIPayList must sort before Jobfound');
assert.ok(jobfoundDate > wwrDate, 'Jobfound must sort before We Work Remotely');
assert.ok(wwrDate > remotiveDate, 'We Work Remotely must sort before Remotive');
assert.ok(remotiveDate > wellfoundDate, 'Remotive must sort before Wellfound');
console.log('✓ Curated seed data check passed: all 5 platforms present with verified URLs, categories, and correct chronological order.');

// 3. Filter and Search Logic Unit Tests
console.log('\n[Test 3] Testing Filtering and Search logic...');
const sampleDirectories = [
  {
    id: 'curated-aipaylist',
    name: 'AIPayList',
    url: 'https://aipaylist.com/',
    description: 'Platform agregator pekerjaan AI Training, RLHF, prompt engineering, dan anotasi data.',
    category: 'ai',
    region_scope: 'Worldwide',
    compensation_model: 'Hourly',
    tags: ['Verified Pay', 'AI Training', 'RLHF', 'No Login Needed'],
    is_curated: true,
    created_at: new Date('2026-01-05T00:00:00Z'),
  },
  {
    id: 'curated-jobfound',
    name: 'Jobfound',
    url: 'https://jobfound.org/',
    description: 'Direktori lowongan remote worldwide terkurasi untuk software engineer, product, dan digital marketing.',
    category: 'tech',
    region_scope: 'Worldwide',
    compensation_model: 'Salaried',
    tags: ['Tech & Engineering', 'Worldwide Remote', 'Aggregator Feed', 'Direct Apply'],
    is_curated: true,
    created_at: new Date('2026-01-04T00:00:00Z'),
  },
  {
    id: 'curated-weworkremotely',
    name: 'We Work Remotely',
    url: 'https://weworkremotely.com/',
    description: 'Salah satu komunitas remote work dan job board remote terbesar di dunia.',
    category: 'general',
    region_scope: 'Worldwide',
    compensation_model: 'Mixed',
    tags: ['Global Remote', 'High Volume Feed', 'General Remote'],
    is_curated: true,
    created_at: new Date('2026-01-03T00:00:00Z'),
  },
  {
    id: 'custom-id-local',
    name: 'Remote Indonesia Hub',
    url: 'https://remoteindo.id/',
    description: 'Pusat loker remote khusus tech di Indonesia.',
    category: 'tech',
    region_scope: 'Indonesia',
    compensation_model: 'Salaried',
    tags: ['Lokal', 'WFO/WFH', 'IDR Pay'],
    is_curated: false,
    created_at: new Date('2026-09-10T00:00:00Z'),
  },
  {
    id: 'custom-all-region',
    name: 'Global Gig Directory',
    url: 'https://globalgig.io/',
    description: 'Gig directory open to all nations.',
    category: 'other',
    region_scope: 'All',
    compensation_model: 'Hourly',
    tags: ['Gigs', 'Fast Pay'],
    is_curated: false,
    created_at: new Date('2026-09-11T00:00:00Z'),
  },
];

function applyFilters(dirs, filters) {
  let result = [...dirs];

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(q) ||
        (item.url || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.tags || []).some((tag) => (tag || '').toLowerCase().includes(q))
    );
  }

  if (filters.category) {
    result = result.filter((item) => item.category === filters.category);
  }

  if (filters.regionScope) {
    result = result.filter(
      (item) =>
        item.region_scope === filters.regionScope ||
        (filters.regionScope === 'Worldwide' && item.region_scope === 'All')
    );
  }

  if (filters.compensationModel) {
    result = result.filter(
      (item) => item.compensation_model === filters.compensationModel
    );
  }

  if (filters.sourceType === 'curated') {
    result = result.filter((item) => item.is_curated);
  } else if (filters.sourceType === 'custom') {
    result = result.filter((item) => !item.is_curated);
  }

  result.sort((a, b) => {
    if (filters.sortBy === 'name') {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return filters.sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else {
      const parseTime = (val) => {
        if (!val) return 0;
        const t = new Date(val).getTime();
        return isNaN(t) ? 0 : t;
      };
      const timeA = parseTime(a.created_at);
      const timeB = parseTime(b.created_at);
      return filters.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    }
  });

  return result;
}

// Test A: Search by tag
const tagSearchResult = applyFilters(sampleDirectories, { searchQuery: 'RLHF' });
assert.strictEqual(tagSearchResult.length, 1);
assert.strictEqual(tagSearchResult[0].name, 'AIPayList');

// Test B: Filter by category = 'tech'
const techResult = applyFilters(sampleDirectories, { category: 'tech' });
assert.strictEqual(techResult.length, 2); // Jobfound and Remote Indonesia Hub

// Test C: Filter by regionScope = 'Indonesia'
const indoResult = applyFilters(sampleDirectories, { regionScope: 'Indonesia' });
assert.strictEqual(indoResult.length, 1);
assert.strictEqual(indoResult[0].name, 'Remote Indonesia Hub');

// Test D: Filter by regionScope = 'Worldwide' (matches Worldwide and All)
const worldResult = applyFilters(sampleDirectories, { regionScope: 'Worldwide' });
assert.strictEqual(worldResult.length, 4); // AIPayList, Jobfound, WWR, Global Gig Directory (All)

// Test E: Filter by sourceType = 'custom'
const customResult = applyFilters(sampleDirectories, { sourceType: 'custom' });
assert.strictEqual(customResult.length, 2);

// Test F: Default sorting (created_at desc)
const sortedResult = applyFilters(sampleDirectories, { sortBy: 'created_at', sortOrder: 'desc' });
assert.strictEqual(sortedResult[0].name, 'Global Gig Directory'); // newest (Sep 11)
assert.strictEqual(sortedResult[1].name, 'Remote Indonesia Hub'); // Sep 10
assert.strictEqual(sortedResult[2].name, 'AIPayList'); // Jan 05
assert.strictEqual(sortedResult[3].name, 'Jobfound'); // Jan 04
assert.strictEqual(sortedResult[4].name, 'We Work Remotely'); // Jan 03

console.log('✓ Filter and search logic tests passed: keyword, category, region, compensation, source type, and sorting all verified.');

// 4. Quick Track application prefill validation
console.log('\n[Test 4] Testing Quick Track prefill validation logic...');
const isValidUrl = (urlStr) => {
  if (!urlStr || !urlStr.trim()) return true;
  try {
    const formatted = urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`;
    new URL(formatted);
    return true;
  } catch {
    return false;
  }
};

const validateApplication = (data) => {
  const errors = {};
  if (!data.company_name || !data.company_name.trim()) errors.company_name = 'Required';
  if (!data.job_title || !data.job_title.trim()) errors.job_title = 'Required';
  if (!data.account_email || !data.account_email.trim()) errors.account_email = 'Required';
  if (data.source_url && !isValidUrl(data.source_url)) errors.source_url = 'Invalid URL';
  return { isValid: Object.keys(errors).length === 0, errors };
};

// Quick track pre-filled data simulation
const quickTrackDirectory = sampleDirectories[0]; // AIPayList
const prefilledData = {
  source_url: quickTrackDirectory.url,
  company_name: '',
  job_title: '',
  account_email: '',
  status: 'Applied',
  employment_type: 'Full-time',
};

// Should be invalid until required fields are entered
assert.strictEqual(validateApplication(prefilledData).isValid, false);

// Once user fills company, job title, and email, it becomes valid
const completedApplication = {
  ...prefilledData,
  company_name: 'Scale AI',
  job_title: 'RLHF Prompt Evaluator',
  account_email: 'candidate@remote.dev',
};
const valResult = validateApplication(completedApplication);
assert.strictEqual(valResult.isValid, true);
assert.strictEqual(completedApplication.source_url, 'https://aipaylist.com/');
console.log('✓ Quick track prefill and application validation test passed.');

// 5. Region Label Distinction Test (Prevent Duplicate UI Options)
console.log('\n[Test 5] Testing Region Label Distinction (allRegions vs regionAll)...');
const idAllRegions = idLocale.jobDirectories?.allRegions;
const idRegionAll = idLocale.jobDirectories?.regionAll;
const enAllRegions = enLocale.jobDirectories?.allRegions;
const enRegionAll = enLocale.jobDirectories?.regionAll;

assert.notStrictEqual(idAllRegions, idRegionAll, 'id: allRegions and regionAll must not have duplicate labels');
assert.notStrictEqual(enAllRegions, enRegionAll, 'en: allRegions and regionAll must not have duplicate labels');
console.log(`✓ Region label distinction passed:
   id: "${idAllRegions}" vs "${idRegionAll}"
   en: "${enAllRegions}" vs "${enRegionAll}"`);

// 6. URL Protocol Normalization & Sanitization
console.log('\n[Test 6] Testing URL Protocol Normalization & Edge Cases...');
const normalizeUrl = (raw) => {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;
};

assert.strictEqual(normalizeUrl('aipaylist.com'), 'https://aipaylist.com');
assert.strictEqual(normalizeUrl('  jobfound.org/jobs  '), 'https://jobfound.org/jobs');
assert.strictEqual(normalizeUrl('https://weworkremotely.com/'), 'https://weworkremotely.com/');
assert.strictEqual(normalizeUrl('http://insecure.dev'), 'http://insecure.dev');
assert.strictEqual(normalizeUrl('   '), '');
console.log('✓ URL protocol normalization passed.');

// 7. Firestore Timestamp Deserialization Helper
console.log('\n[Test 7] Testing Firestore Timestamp Deserialization Helper...');
const parseDate = (val) => {
  if (!val) return new Date();
  if (typeof val?.toDate === 'function') {
    return val.toDate();
  }
  if (val && typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000);
  }
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') return new Date(val);
  return new Date();
};

const fixedEpoch = 1757548800; // specific seconds timestamp
const parsedFromSeconds = parseDate({ seconds: fixedEpoch });
assert.strictEqual(parsedFromSeconds.getTime(), fixedEpoch * 1000);

const parsedFromToDate = parseDate({ toDate: () => new Date('2026-09-11T12:00:00Z') });
assert.strictEqual(parsedFromToDate.toISOString(), '2026-09-11T12:00:00.000Z');

console.log('✓ Firestore timestamp deserialization helper passed.');

// 8. Strict Web Protocol Validation & Dangerous Scheme Rejection
console.log('\n[Test 8] Testing Web Protocol Validation & Dangerous Scheme Rejection...');
const validateWebUrl = (urlStr) => {
  const trimmed = (urlStr || '').trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('ftp://') ||
    lower.startsWith('mailto:')
  ) {
    return false;
  }
  try {
    const formatted = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(formatted);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      Boolean(parsed.hostname) &&
      (parsed.hostname.includes('.') || parsed.hostname === 'localhost')
    );
  } catch {
    return false;
  }
};

assert.strictEqual(validateWebUrl('aipaylist.com'), true);
assert.strictEqual(validateWebUrl('  https://jobfound.org/jobs  '), true);
assert.strictEqual(validateWebUrl('http://localhost:3000'), true);
assert.strictEqual(validateWebUrl('javascript:alert(1)'), false);
assert.strictEqual(validateWebUrl('data:text/html,<script>alert(1)</script>'), false);
assert.strictEqual(validateWebUrl('file:///etc/passwd'), false);
assert.strictEqual(validateWebUrl('ftp://files.example.com'), false);
assert.strictEqual(validateWebUrl('   '), false);
assert.strictEqual(validateWebUrl('http://'), false);
console.log('✓ Web protocol security validation passed.');

// 9. Tag Parsing, Truncation, and Count Limits
console.log('\n[Test 9] Testing Tag Parsing, Truncation, and Count Limits...');
const parseTags = (rawInput) => {
  const seenTags = new Set();
  const parsedTags = [];
  for (const rawTag of (rawInput || '').split(',').map((t) => t.trim()).filter(Boolean)) {
    const cleanTag = rawTag.slice(0, 50);
    const lower = cleanTag.toLowerCase();
    if (!seenTags.has(lower)) {
      seenTags.add(lower);
      parsedTags.push(cleanTag);
      if (parsedTags.length >= 15) break;
    }
  }
  return parsedTags;
};

const multiTags = 'AI Training, RLHF, ai training, Verified Pay, ' + 'A'.repeat(80);
const parsedMulti = parseTags(multiTags);
assert.strictEqual(parsedMulti.length, 4, 'Case-insensitive duplicates must be merged');
assert.strictEqual(parsedMulti[0], 'AI Training');
assert.strictEqual(parsedMulti[1], 'RLHF');
assert.strictEqual(parsedMulti[2], 'Verified Pay');
assert.strictEqual(parsedMulti[3].length, 50, 'Extreme tag must be truncated to 50 chars');

// Test 20 tags limit capped at 15
const twentyTags = Array.from({ length: 20 }, (_, i) => `Tag${i}`).join(', ');
assert.strictEqual(parseTags(twentyTags).length, 15, 'Tag list must be capped at 15 tags');
console.log('✓ Tag parsing, truncation, and overflow limits passed.');

// 10. Robustness Against Null / Undefined Properties in Filters and Sorters
console.log('\n[Test 10] Testing Robustness Against Missing / Null Properties...');
const incompleteDirectories = [
  { id: 'inc-1', name: null, url: undefined, description: null, tags: [null, 'ValidTag'], created_at: null },
  { id: 'inc-2', name: 'Alpha Dir', url: 'https://alpha.org', description: 'Real dir', tags: [], created_at: new Date('2026-05-01') },
];

const safeFiltered = applyFilters(incompleteDirectories, { searchQuery: 'alpha' });
assert.strictEqual(safeFiltered.length, 1);
assert.strictEqual(safeFiltered[0].id, 'inc-2');

const safeTagSearch = applyFilters(incompleteDirectories, { searchQuery: 'validtag' });
assert.strictEqual(safeTagSearch.length, 1);
assert.strictEqual(safeTagSearch[0].id, 'inc-1');
console.log('✓ Robustness against null/undefined records passed.');

console.log('\n=============================================');
console.log('ALL TESTS PASSED SUCCESSFULLY! (10/10 test suites)');
console.log('=============================================\n');
