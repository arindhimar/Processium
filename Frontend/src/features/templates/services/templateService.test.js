/**
 * TDD: templateService
 *
 * These tests define the contract that templateService must honour.
 * They were written BEFORE the real implementation to drive development.
 *
 * Strategy:
 *   - Mock global `fetch` so no network calls are made.
 *   - Mock `localStorage` to isolate token reads.
 *   - Each test exercises one observable behaviour.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { templateService, normalizeTemplate } from './templateService';

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:8000';
const FAKE_TOKEN = 'fake.jwt.token';

// Backend shape (as returned by Django REST Framework)
const RAW_TEMPLATE = {
  id: 'uuid-1',
  template_name: 'Offer Letter',
  template_description: 'A formal offer letter',
  created_by: 'user-uuid',
  created_by_name: 'Alice Admin',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-02-20T12:00:00Z',
};

// Expected normalized shape consumed by the frontend components
const NORMALIZED_TEMPLATE = {
  id: 'uuid-1',
  name: 'Offer Letter',
  content: 'A formal offer letter',
  subject: '',
  category: '',
  visibility: '',
  status: '',
  createdBy: 'Alice Admin',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-02-20T12:00:00Z',
};

// ── Setup / Teardown ─────────────────────────────────────────────────────────

function mockFetch(body, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

function mockFetchError(status, body) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => {
  // Seed localStorage with a fake token so auth header is injected
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key) => (key === 'access_token' ? FAKE_TOKEN : null)),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── normalizeTemplate ─────────────────────────────────────────────────────────

describe('normalizeTemplate', () => {
  it('maps template_name → name', () => {
    expect(normalizeTemplate(RAW_TEMPLATE).name).toBe('Offer Letter');
  });

  it('maps template_description → content', () => {
    expect(normalizeTemplate(RAW_TEMPLATE).content).toBe('A formal offer letter');
  });

  it('maps created_at → createdAt', () => {
    expect(normalizeTemplate(RAW_TEMPLATE).createdAt).toBe('2024-01-15T10:00:00Z');
  });

  it('maps updated_at → updatedAt', () => {
    expect(normalizeTemplate(RAW_TEMPLATE).updatedAt).toBe('2024-02-20T12:00:00Z');
  });

  it('maps created_by_name → createdBy', () => {
    expect(normalizeTemplate(RAW_TEMPLATE).createdBy).toBe('Alice Admin');
  });

  it('defaults subject to empty string when absent from backend', () => {
    expect(normalizeTemplate(RAW_TEMPLATE).subject).toBe('');
  });

  it('defaults content to empty string when template_description is null', () => {
    expect(normalizeTemplate({ ...RAW_TEMPLATE, template_description: null }).content).toBe('');
  });

  it('produces the full expected normalized object', () => {
    expect(normalizeTemplate(RAW_TEMPLATE)).toEqual(NORMALIZED_TEMPLATE);
  });
});

// ── fetchTemplates ────────────────────────────────────────────────────────────

describe('templateService.fetchTemplates', () => {
  it('calls GET /api/templates/', async () => {
    global.fetch = mockFetch([RAW_TEMPLATE]);
    await templateService.fetchTemplates();
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('injects Authorization header from localStorage', async () => {
    global.fetch = mockFetch([RAW_TEMPLATE]);
    await templateService.fetchTemplates();
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it('returns normalized templates array in response.data', async () => {
    global.fetch = mockFetch([RAW_TEMPLATE]);
    const result = await templateService.fetchTemplates();
    expect(result.data).toEqual([NORMALIZED_TEMPLATE]);
  });

  it('returns success: true on 200', async () => {
    global.fetch = mockFetch([RAW_TEMPLATE]);
    const result = await templateService.fetchTemplates();
    expect(result.success).toBe(true);
  });

  it('throws TemplateApiError on 401 (unauthenticated)', async () => {
    global.fetch = mockFetchError(401, { detail: 'Authentication credentials were not provided.' });
    await expect(templateService.fetchTemplates()).rejects.toThrow(
      'Authentication credentials were not provided.'
    );
  });

  it('throws TemplateApiError on 403 (non-admin)', async () => {
    global.fetch = mockFetchError(403, { detail: 'Admin access required.' });
    await expect(templateService.fetchTemplates()).rejects.toThrow('Admin access required.');
  });

  it('attaches status code to the thrown error', async () => {
    global.fetch = mockFetchError(403, { detail: 'Admin access required.' });
    let caught;
    try { await templateService.fetchTemplates(); } catch (e) { caught = e; }
    expect(caught.status).toBe(403);
  });
});

// ── fetchTemplate (single) ────────────────────────────────────────────────────

describe('templateService.fetchTemplate', () => {
  it('calls GET /api/templates/<id>/', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE);
    await templateService.fetchTemplate('uuid-1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/uuid-1/`,
      expect.anything()
    );
  });

  it('returns normalized template in response.data', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE);
    const result = await templateService.fetchTemplate('uuid-1');
    expect(result.data).toEqual(NORMALIZED_TEMPLATE);
  });

  it('throws on 404 with backend error message', async () => {
    global.fetch = mockFetchError(404, { error: 'Template not found.' });
    await expect(templateService.fetchTemplate('missing')).rejects.toThrow(
      'Template not found.'
    );
  });
});

// ── createTemplate ────────────────────────────────────────────────────────────

describe('templateService.createTemplate', () => {
  it('calls POST /api/templates/', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE, 201);
    await templateService.createTemplate({ name: 'New', content: 'Body' });
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('maps frontend name → template_name in request body', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE, 201);
    await templateService.createTemplate({ name: 'New', content: 'Body' });
    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.template_name).toBe('New');
    expect(body).not.toHaveProperty('name');
  });

  it('maps frontend content → template_description in request body', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE, 201);
    await templateService.createTemplate({ name: 'New', content: 'Body text' });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.template_description).toBe('Body text');
    expect(body).not.toHaveProperty('content');
  });

  it('returns normalized created template in response.data', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE, 201);
    const result = await templateService.createTemplate({ name: 'New', content: '' });
    expect(result.data).toEqual(NORMALIZED_TEMPLATE);
  });

  it('throws on 400 (missing template_name validation error)', async () => {
    global.fetch = mockFetchError(400, { template_name: ['This field is required.'] });
    await expect(
      templateService.createTemplate({ name: '', content: '' })
    ).rejects.toThrow();
  });
});

// ── updateTemplate ────────────────────────────────────────────────────────────

describe('templateService.updateTemplate', () => {
  it('calls PUT /api/templates/<id>/', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE);
    await templateService.updateTemplate('uuid-1', { name: 'Updated', content: '' });
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/uuid-1/`,
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('sends template_name and template_description in body', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE);
    await templateService.updateTemplate('uuid-1', { name: 'NewName', content: 'NewDesc' });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.template_name).toBe('NewName');
    expect(body.template_description).toBe('NewDesc');
  });

  it('returns normalized updated template in response.data', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE);
    const result = await templateService.updateTemplate('uuid-1', { name: 'U', content: '' });
    expect(result.data).toEqual(NORMALIZED_TEMPLATE);
  });

  it('throws on 404 when template does not exist', async () => {
    global.fetch = mockFetchError(404, { error: 'Template not found.' });
    await expect(
      templateService.updateTemplate('bad-id', { name: 'X', content: '' })
    ).rejects.toThrow('Template not found.');
  });
});

// ── cloneTemplate ─────────────────────────────────────────────────────────────

describe('templateService.cloneTemplate', () => {
  it('calls POST /api/templates/<id>/clone/', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE, 201);
    await templateService.cloneTemplate('uuid-1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/uuid-1/clone/`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('returns normalized cloned template in response.data', async () => {
    const clonedRaw = { ...RAW_TEMPLATE, id: 'uuid-clone', template_name: 'Copy of Offer Letter' };
    global.fetch = mockFetch(clonedRaw, 201);
    const result = await templateService.cloneTemplate('uuid-1');
    expect(result.data.id).toBe('uuid-clone');
    expect(result.data.name).toBe('Copy of Offer Letter');
  });

  it('throws on 404 when original template does not exist', async () => {
    global.fetch = mockFetchError(404, { error: 'Template not found.' });
    await expect(templateService.cloneTemplate('missing')).rejects.toThrow(
      'Template not found.'
    );
  });

  it('returns success: true', async () => {
    global.fetch = mockFetch(RAW_TEMPLATE, 201);
    const result = await templateService.cloneTemplate('uuid-1');
    expect(result.success).toBe(true);
  });
});

// ── deleteTemplate ────────────────────────────────────────────────────────────

describe('templateService.deleteTemplate', () => {
  it('calls DELETE /api/templates/<id>/', async () => {
    global.fetch = mockFetch({ message: 'Template deleted successfully.' });
    await templateService.deleteTemplate('uuid-1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/uuid-1/`,
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('returns success: true on 200', async () => {
    global.fetch = mockFetch({ message: 'Template deleted successfully.' });
    const result = await templateService.deleteTemplate('uuid-1');
    expect(result.success).toBe(true);
  });

  it('throws on 404 when template does not exist', async () => {
    global.fetch = mockFetchError(404, { error: 'Template not found.' });
    await expect(templateService.deleteTemplate('missing')).rejects.toThrow(
      'Template not found.'
    );
  });
});
