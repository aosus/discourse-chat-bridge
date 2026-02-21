export function createFetchJsonResponse(payload) {
  return {
    json: async () => payload
  };
}

export function createTelegramContext(overrides = {}) {
  return {
    from: {
      id: 1001,
      username: 'smoke_user',
      first_name: 'Smoke'
    },
    chat: {
      id: 1001,
      username: 'smoke_user',
      first_name: 'Smoke',
      type: 'private'
    },
    message: {
      message_id: 42
    },
    ...overrides
  };
}
