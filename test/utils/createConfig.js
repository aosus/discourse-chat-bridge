export default function createConfig(overrides = {}) {
  return {
    url: 'https://discourse.example.com',
    dataPath: './storage',
    discourse_forum_name: 'Discourse community',
    language: 'en',
    ...overrides,
  };
}
