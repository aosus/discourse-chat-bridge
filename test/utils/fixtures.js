import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const utilsDir = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(utilsDir, '..', 'fixtures');

export function readFixture(...segments) {
  const fixturePath = path.join(fixturesDir, ...segments);
  return JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
}
