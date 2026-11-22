import http from 'node:http';
import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import {
  fromFirestoreFields,
  normalizeApplication,
  normalizeJobDirectory,
  normalizeJobSource,
  requireValue,
  toFirestoreFields,
} from './mcp-lib.mjs';

loadDotEnv();

const projectId =
  process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const accessToken = process.env.MCP_ACCESS_TOKEN || '';

if (!projectId) {
  throw new Error(
    'Missing FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID).'
  );
}

const firestoreBase = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;

function loadDotEnv() {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const separator = trimmed.indexOf('=');
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function firestoreUrl(collection, id) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const url = `${firestoreBase}/${collection}${suffix}`;
  return apiKey ? `${url}?key=${encodeURIComponent(apiKey)}` : url;
}

async function firestoreRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firestore ${response.status}: ${body || response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function documentId(documentName) {
  return documentName.split('/').pop();
}

async function listCollection(collection) {
  let pageToken = '';
  const documents = [];
  do {
    const url = firestoreUrl(collection);
    const separator = url.includes('?') ? '&' : '?';
    const pagedUrl =
      `${url}${separator}pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const response = await firestoreRequest(pagedUrl);
    for (const document of response.documents || []) {
      documents.push({
        id: documentId(document.name),
        ...fromFirestoreFields(document.fields),
      });
    }
    pageToken = response.nextPageToken || '';
  } while (pageToken);
  return documents;
}

async function createDocument(collection, data) {
  const now = new Date().toISOString();
  const payload = {
    fields: toFirestoreFields({
      ...data,
      created_at: now,
      updated_at: now,
    }),
  };
  const document = await firestoreRequest(firestoreUrl(collection), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return {
    id: documentId(document.name),
  };
}

async function updateDocument(collection, id, data) {
  requireValue(id, 'id');
  const fields = toFirestoreFields({
    ...data,
    updated_at: new Date().toISOString(),
  });
  const existing = await firestoreRequest(firestoreUrl(collection, id));
  const mergedFields = {
    ...(existing.fields || {}),
    ...fields,
  };
  const url = firestoreUrl(collection, id);
  const separator = url.includes('?') ? '&' : '?';
  const updateMask = Object.keys(fields)
    .map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`)
    .join('&');
  await firestoreRequest(`${url}${separator}${updateMask}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: mergedFields }),
  });
  return { id };
}

async function deleteDocument(collection, id) {
  requireValue(id, 'id');
  await firestoreRequest(firestoreUrl(collection, id), { method: 'DELETE' });
  return { id };
}

function textResult(data) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function isoSort(records, field) {
  return [...records].sort((a, b) => {
    const left = new Date(a[field] || 0).getTime();
    const right = new Date(b[field] || 0).getTime();
    return right - left;
  });
}

const tools = [
  {
    name: 'list_applications',
    description: 'List all job applications, optionally filtered and limited.',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        status: { type: 'string', enum: ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted'] },
        limit: { type: 'integer', minimum: 1, maximum: 1000 },
      },
    },
  },
  {
    name: 'create_application',
    description: 'Create one job application.',
    inputSchema: {
      type: 'object',
      required: ['company_name', 'job_title'],
      properties: {
        company_name: { type: 'string' },
        job_title: { type: 'string' },
        account_email: { type: 'string' },
        applied_date: { type: 'string', description: 'ISO date, for example 2026-11-22' },
        status: { type: 'string' },
        employment_type: { type: 'string' },
        source_url: { type: 'string' },
        apply_url: { type: 'string' },
        salary_rate: { type: 'string' },
        skills_required: { oneOf: [{ type: 'array', items: { type: 'string' } }, { type: 'string' }] },
        notes: { type: 'string' },
        image_url: { type: 'string' },
      },
    },
  },
  {
    name: 'bulk_create_applications',
    description: 'Create multiple job applications in one MCP call.',
    inputSchema: {
      type: 'object',
      required: ['applications'],
      properties: {
        applications: { type: 'array', items: { type: 'object' } },
      },
    },
  },
  {
    name: 'update_application',
    description: 'Update an existing job application.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        company_name: { type: 'string' },
        job_title: { type: 'string' },
        account_email: { type: 'string' },
        applied_date: { type: 'string' },
        status: { type: 'string' },
        employment_type: { type: 'string' },
        source_url: { type: 'string' },
        apply_url: { type: 'string' },
        salary_rate: { type: 'string' },
        skills_required: { oneOf: [{ type: 'array', items: { type: 'string' } }, { type: 'string' }] },
        notes: { type: 'string' },
        image_url: { type: 'string' },
      },
    },
  },
  {
    name: 'delete_application',
    description: 'Delete a job application by id.',
    inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
  },
  {
    name: 'list_job_sources',
    description: 'List every configured job source/account.',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
        limit: { type: 'integer', minimum: 1, maximum: 1000 },
      },
    },
  },
  {
    name: 'create_job_source',
    description: 'Create a job source or job board account.',
    inputSchema: {
      type: 'object',
      required: ['name', 'url'],
      properties: {
        name: { type: 'string' },
        url: { type: 'string' },
        logo_url: { type: 'string' },
        payment_category: { type: 'string' },
        region_category: { type: 'string' },
        login_email: { type: 'string' },
        account_username: { type: 'string' },
        status: { type: 'string' },
        notes: { type: 'string' },
      },
    },
  },
  {
    name: 'update_job_source',
    description: 'Update a job source.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        url: { type: 'string' },
        logo_url: { type: 'string' },
        payment_category: { type: 'string' },
        region_category: { type: 'string' },
        login_email: { type: 'string' },
        account_username: { type: 'string' },
        status: { type: 'string' },
        notes: { type: 'string' },
      },
    },
  },
  {
    name: 'delete_job_source',
    description: 'Delete a job source.',
    inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
  },
  {
    name: 'list_job_directories',
    description: 'List curated and custom job directories.',
    inputSchema: { type: 'object', properties: { search: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 1000 } } },
  },
  {
    name: 'create_job_directory',
    description: 'Create a job directory or aggregator.',
    inputSchema: {
      type: 'object',
      required: ['name', 'url', 'description', 'category', 'region_scope', 'compensation_model'],
      properties: {
        name: { type: 'string' },
        url: { type: 'string' },
        logo_url: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        region_scope: { type: 'string' },
        compensation_model: { type: 'string' },
        tags: { oneOf: [{ type: 'array', items: { type: 'string' } }, { type: 'string' }] },
      },
    },
  },
  {
    name: 'get_summary',
    description: 'Return counts by application status and database totals.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name, args = {}) {
  if (name === 'list_applications') {
    let records = isoSort(await listCollection('applications'), 'applied_date');
    if (args.status) records = records.filter((item) => item.status === args.status);
    if (args.search) {
      const needle = args.search.toLowerCase();
      records = records.filter((item) =>
        [item.company_name, item.job_title, item.account_email, item.notes]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      );
    }
    if (args.limit) records = records.slice(0, args.limit);
    return textResult(records);
  }
  if (name === 'create_application') {
    const data = normalizeApplication(args);
    return textResult({ created: true, ...(await createDocument('applications', data)), data });
  }
  if (name === 'bulk_create_applications') {
    if (!Array.isArray(args.applications) || !args.applications.length) {
      throw new Error('applications must be a non-empty array');
    }
    const results = [];
    for (const application of args.applications) {
      const data = normalizeApplication(application);
      results.push({ ...(await createDocument('applications', data)), data });
    }
    return textResult({ created: results.length, results });
  }
  if (name === 'update_application') {
    const { id, ...raw } = args;
    const existing = (await listCollection('applications')).find((item) => item.id === id);
    if (!existing) throw new Error(`Application not found: ${id}`);
    const merged = normalizeApplication({ ...existing, ...raw });
    return textResult({ updated: true, ...(await updateDocument('applications', id, merged)) });
  }
  if (name === 'delete_application') {
    return textResult({ deleted: true, ...(await deleteDocument('applications', args.id)) });
  }
  if (name === 'list_job_sources') {
    let records = isoSort(await listCollection('jobSources'), 'created_at');
    if (args.status) records = records.filter((item) => item.status === args.status);
    if (args.search) {
      const needle = args.search.toLowerCase();
      records = records.filter((item) =>
        [item.name, item.url, item.login_email, item.account_username, item.notes]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      );
    }
    if (args.limit) records = records.slice(0, args.limit);
    return textResult(records);
  }
  if (name === 'create_job_source') {
    const data = normalizeJobSource(args);
    return textResult({ created: true, ...(await createDocument('jobSources', data)), data });
  }
  if (name === 'update_job_source') {
    const { id, ...raw } = args;
    const existing = (await listCollection('jobSources')).find((item) => item.id === id);
    if (!existing) throw new Error(`Job source not found: ${id}`);
    const merged = normalizeJobSource({ ...existing, ...raw });
    return textResult({ updated: true, ...(await updateDocument('jobSources', id, merged)) });
  }
  if (name === 'delete_job_source') {
    return textResult({ deleted: true, ...(await deleteDocument('jobSources', args.id)) });
  }
  if (name === 'list_job_directories') {
    let records = isoSort(await listCollection('jobDirectories'), 'created_at');
    if (args.search) {
      const needle = args.search.toLowerCase();
      records = records.filter((item) =>
        [item.name, item.url, item.description, ...(item.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      );
    }
    if (args.limit) records = records.slice(0, args.limit);
    return textResult(records);
  }
  if (name === 'create_job_directory') {
    const data = normalizeJobDirectory(args);
    return textResult({
      created: true,
      ...(await createDocument('jobDirectories', data)),
      data,
    });
  }
  if (name === 'get_summary') {
    const applications = await listCollection('applications');
    const jobSources = await listCollection('jobSources');
    const jobDirectories = await listCollection('jobDirectories');
    const byStatus = applications.reduce((totals, application) => {
      totals[application.status || 'Applied'] =
        (totals[application.status || 'Applied'] || 0) + 1;
      return totals;
    }, {});
    return textResult({
      applications: applications.length,
      jobSources: jobSources.length,
      jobDirectories: jobDirectories.length,
      byStatus,
    });
  }
  throw new Error(`Unknown tool: ${name}`);
}

async function handleMessage(message) {
  if (!message || !Object.hasOwn(message, 'method')) return null;
  const { id, method, params } = message;
  if (method === 'notifications/initialized') return null;
  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: params?.protocolVersion || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'remote-works-mcp', version: '1.0.0' },
        instructions:
          'Manage Remote Works applications, job sources, and job directories.',
      },
    };
  }
  if (method === 'ping') return { jsonrpc: '2.0', id, result: {} };
  if (method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools } };
  if (method === 'tools/call') {
    try {
      const result = await callTool(params?.name, params?.arguments || {});
      return { jsonrpc: '2.0', id, result };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }],
          isError: true,
        },
      };
    }
  }
  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

function startStdio() {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on('line', async (line) => {
    if (!line.trim()) return;
    try {
      const response = await handleMessage(JSON.parse(line));
      if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
    } catch (error) {
      process.stdout.write(
        `${JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: error instanceof Error ? error.message : String(error) },
        })}\n`
      );
    }
  });
}

function startHttp() {
  const port = Number(process.env.MCP_HTTP_PORT || 8787);
  const server = http.createServer(async (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (request.method === 'OPTIONS') {
      response.statusCode = 204;
      return response.end();
    }
    if (request.url === '/health' && request.method === 'GET') {
      return response.end(JSON.stringify({ status: 'ok', server: 'remote-works-mcp' }));
    }
    if (request.url !== '/mcp' || request.method !== 'POST') {
      response.statusCode = 404;
      return response.end(JSON.stringify({ error: 'Not found' }));
    }
    if (accessToken) {
      const authorization = request.headers.authorization || '';
      if (authorization !== `Bearer ${accessToken}`) {
        response.statusCode = 401;
        return response.end(JSON.stringify({ error: 'Unauthorized' }));
      }
    }
    let body = '';
    for await (const chunk of request) body += chunk;
    try {
      const result = await handleMessage(JSON.parse(body));
      if (result) return response.end(JSON.stringify(result));
      response.statusCode = 202;
      return response.end('');
    } catch (error) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: error instanceof Error ? error.message : String(error) },
        })
      );
    }
  });
  server.listen(port, '127.0.0.1', () => {
    console.error(`Remote Works MCP HTTP server listening at http://127.0.0.1:${port}/mcp`);
  });
}

if (process.argv.includes('--http')) startHttp();
else startStdio();
