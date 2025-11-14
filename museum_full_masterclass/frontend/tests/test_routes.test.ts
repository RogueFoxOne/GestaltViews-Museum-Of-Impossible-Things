// tests/frontend/test_routes.test.ts
/**
 * Frontend Route Tests for Museum of Impossible Things
 * Tests Next.js API routes and data fetching
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createMocks } from 'node-mocks-http';

describe('Exhibit Routes', () => {
  it('should fetch all exhibits from API', async () => {
    const response = await fetch('http://localhost:8000/api/exhibits');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('exhibits');
    expect(Array.isArray(data.exhibits)).toBe(true);
  });
  
  it('should fetch single exhibit by slug', async () => {
    const slug = 'gestaltview-consciousness-ai';
    const response = await fetch(`http://localhost:8000/api/exhibits/${slug}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.slug).toBe(slug);
    expect(data).toHaveProperty('title');
  });
  
  it('should return 404 for invalid slug', async () => {
    const response = await fetch('http://localhost:8000/api/exhibits/invalid-slug');
    expect(response.status).toBe(404);
  });
});

describe('Curator Routes', () => {
  it('should fetch curator greeting', async () => {
    const response = await fetch('http://localhost:8000/api/curator/greeting');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('timestamp');
    expect(typeof data.message).toBe('string');
  });
});
