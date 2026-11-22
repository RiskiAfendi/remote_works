import assert from 'node:assert/strict';
import {
  fromFirestoreFields,
  normalizeApplication,
  normalizeJobSource,
  normalizeJobDirectory,
  toFirestoreFields,
} from './mcp-lib.mjs';

const application = normalizeApplication({
  company_name: 'Example Company',
  job_title: 'Remote Engineer',
  status: 'applied',
  employment_type: 'full time',
  applied_date: '2026-11-22',
  skills_required: 'TypeScript, React',
});
assert.equal(application.status, 'Applied');
assert.equal(application.employment_type, 'Full-time');
assert.deepEqual(application.skills_required, ['TypeScript', 'React']);

const source = normalizeJobSource({
  name: 'Remote Board',
  url: 'https://example.com/jobs',
  status: 'active',
  payment_category: 'International',
  region_category: 'Both',
});
assert.equal(source.status, 'active');

const directory = normalizeJobDirectory({
  name: 'Global Jobs',
  url: 'https://example.com',
  description: 'Remote jobs worldwide',
  category: 'tech',
  region_scope: 'Worldwide',
  compensation_model: 'Mixed',
  tags: 'Remote, Software',
});
assert.deepEqual(directory.tags, ['Remote', 'Software']);

const firestoreFields = toFirestoreFields({
  name: 'Example',
  active: true,
  count: 3,
  tags: ['remote', 'typescript'],
});
assert.equal(firestoreFields.name.stringValue, 'Example');
assert.equal(firestoreFields.active.booleanValue, true);
assert.equal(firestoreFields.count.integerValue, '3');
assert.deepEqual(fromFirestoreFields(firestoreFields), {
  name: 'Example',
  active: true,
  count: 3,
  tags: ['remote', 'typescript'],
});

console.log('MCP normalization and Firestore conversion tests passed.');
