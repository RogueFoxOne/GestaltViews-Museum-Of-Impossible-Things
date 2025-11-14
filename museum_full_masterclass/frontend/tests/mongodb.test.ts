import * as fs from 'fs';
import path from 'path';

describe('frontend mongodb module', () => {
  test('mongodb.ts exists', () => {
    const p = path.resolve(__dirname, '../lib/mongodb.ts');
    expect(fs.existsSync(p)).toBeTruthy();
  });
});
