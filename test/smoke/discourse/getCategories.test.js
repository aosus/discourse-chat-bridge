import { describe, expect, test, vi } from 'vitest';
import loadFixture from '../../utils/loadFixture.js';
import createConfig from '../../utils/createConfig.js';

const fetchMock = vi.fn();
const readJsonSyncMock = vi.fn();

vi.mock('node-fetch', () => ({
  default: fetchMock,
}));

vi.mock('fs-extra', () => ({
  default: {
    readJsonSync: readJsonSyncMock,
  },
}));

describe('discourse/getCategories smoke', () => {
  test('returns only public categories from discourse payload', async () => {
    const fixture = loadFixture('discourse/categories.json');
    readJsonSyncMock.mockReturnValue(createConfig());
    fetchMock.mockResolvedValue({
      json: async () => fixture,
    });

    const { default: getCategories } = await import('../../../discourse/getCategories.js');
    const result = await getCategories();

    expect(fetchMock).toHaveBeenCalledWith('https://discourse.example.com/categories.json', {
      method: 'GET',
    });
    expect(result).toEqual([
      {
        id: 1,
        name: 'General',
        slug: 'general',
        description: 'General discussion',
        topics_day: 1,
        topics_week: 7,
        topics_month: 30,
        topics_all_time: 99,
      },
    ]);
  });
});
