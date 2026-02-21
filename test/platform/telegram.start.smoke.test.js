import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTelegramContext } from '../utils/mocks.js';
import { readFixture } from '../utils/fixtures.js';

const mocks = vi.hoisted(() => ({
  databaseTelegramMock: vi.fn(),
  translationMock: vi.fn(),
  readJsonSyncMock: vi.fn()
}));

vi.mock('../../module/database_telegram.js', () => ({
  default: mocks.databaseTelegramMock
}));

vi.mock('../../module/translation.js', () => ({
  default: mocks.translationMock
}));

vi.mock('fs-extra', () => ({
  default: {
    readJsonSync: mocks.readJsonSyncMock
  }
}));

describe('telegram/command/start smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    mocks.readJsonSyncMock.mockReturnValue({
      language: 'en',
      discourse_forum_name: 'Discourse Forum',
      url: 'https://forum.example'
    });

    mocks.translationMock.mockResolvedValue({
      welcome: 'Welcome',
      in_the_bridge: 'to bridge',
      view_last_topic: 'View latest topic',
      view_categories: 'View categories',
      write_new_topic: 'Write topic',
      write_new_comment: 'Write comment',
      send_message_private: 'Send private message',
      link_your_account_to: 'Link account to',
      activate_the_bot: 'Activate bot'
    });
  });

  it('registers /start and replies in private chat', async () => {
    const client = {
      start: vi.fn((handler) => {
        client.handler = handler;
      })
    };

    const Markup = {
      button: {
        url: (text, url) => ({ text, url })
      },
      inlineKeyboard: (rows) => ({
        reply_markup: {
          inline_keyboard: rows
        }
      })
    };

    const fixture = readFixture('telegram', 'start-private.json');
    const ctx = createTelegramContext({
      ...fixture,
      reply: vi.fn()
    });

    const { default: start } = await import('../../telegram/command/start.js');

    await start(client, Markup);
    expect(client.start).toHaveBeenCalledTimes(1);

    await client.handler(ctx);

    expect(mocks.databaseTelegramMock).toHaveBeenCalledWith(2001, 'private_user', 'Private', 'from', 9001);
    expect(ctx.reply).toHaveBeenCalledTimes(1);
    expect(ctx.reply).toHaveBeenCalledWith(
      expect.stringContaining('/get_latest_posts'),
      expect.objectContaining({ parse_mode: 'HTML' })
    );
  });
});
