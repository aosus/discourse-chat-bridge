import { describe, expect, test, vi } from 'vitest';
import createConfig from '../../utils/createConfig.js';
import translationFixture from '../../fixtures/platform/matrixTranslation.json';

const readJsonSyncMock = vi.fn();
const translationMock = vi.fn();

vi.mock('fs-extra', () => ({
  default: {
    readJsonSync: readJsonSyncMock,
  },
}));

vi.mock('../../../module/translation.js', () => ({
  default: translationMock,
}));

describe('matrix/start smoke', () => {
  test('builds and sends start menu for start command', async () => {
    vi.stubEnv('LANGUAGE', 'en');
    readJsonSyncMock.mockReturnValue(createConfig());
    translationMock.mockResolvedValue(translationFixture);

    const sendMessage = vi.fn().mockResolvedValue(undefined);
    const createFor = vi.fn((roomId, eventId, html, body) => ({ roomId, eventId, html, body }));

    const { default: start } = await import('../../../matrix/start.js');
    await start('!room:example.com', '@user:example.com', 'Alice', 'start', '$event', { createFor }, { sendMessage });

    expect(translationMock).toHaveBeenCalledWith('en');
    expect(createFor).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledTimes(1);

    const [roomId, reply] = sendMessage.mock.calls[0];
    expect(roomId).toBe('!room:example.com');
    expect(reply.html).toContain('Welcome Alice in bridge Discourse community');
    expect(reply.html).toContain('1- get_latest_posts');
    expect(reply.html).toContain('7- activation');
  });
});
