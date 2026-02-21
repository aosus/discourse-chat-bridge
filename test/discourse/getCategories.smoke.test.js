import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFetchJsonResponse } from '../utils/mocks.js';
import { readFixture } from '../utils/fixtures.js';

const mocks = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  readJsonSyncMock: vi.fn()
}));

vi.mock('node-fetch', () => ({
  default: mocks.fetchMock
}));

vi.mock('fs-extra', () => ({
  default: {
    readJsonSync: mocks.readJsonSyncMock
  }
}));

describe('discourse/getCategories smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    delete process.env.URL;
  });

  it('returns unrestricted categories from discourse payload', async () => {
    mocks.readJsonSyncMock.mockReturnValue({ url: 'https://forum.example' });
    mocks.fetchMock.mockResolvedValue(createFetchJsonResponse(readFixture('discourse', 'categories.json')));

    const { default: getCategories } = await import('../../discourse/getCategories.js');
    const categories = await getCategories();

    expect(mocks.fetchMock).toHaveBeenCalledWith('https://forum.example/categories.json', { method: 'GET' });
    expect(categories).toEqual([
      {
        id: 1,
        name: 'General',
        slug: 'general',
        description: 'General discussions',
        topics_day: 1,
        topics_week: 5,
        topics_month: 15,
        topics_all_time: 150
      },
      {
        id: 3,
        name: 'Announcements',
        slug: 'announcements',
        description: 'Public updates',
        topics_day: 2,
        topics_week: 6,
        topics_month: 18,
        topics_all_time: 180
      }
    ]);
  });
});
