import fs from 'node:fs';
import path from 'node:path';

export default function loadFixture(relativePath) {
  const fixturePath = path.join(process.cwd(), 'test', 'fixtures', relativePath);
  return JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
}
