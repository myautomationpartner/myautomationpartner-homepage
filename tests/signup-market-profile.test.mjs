import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const signupPages = [
  'signup/index.html',
  'beta-intake/index.html',
];

test('market profile fields use neutral prompts instead of example customer values', async () => {
  for (const pagePath of signupPages) {
    const html = await readFile(new URL(`../${pagePath}`, import.meta.url), 'utf8');

    assert.equal(html.includes('placeholder="13760"'), false, `${pagePath} should not show a specific ZIP as placeholder text`);
    assert.equal(html.includes('placeholder="Broome County"'), false, `${pagePath} should not show a specific county as placeholder text`);
    assert.match(html, /<option value="">Select country<\/option>/, `${pagePath} should start Country with a neutral prompt`);
    assert.match(html, /placeholder="ZIP or postal code"/, `${pagePath} should use a neutral postal-code hint`);
    assert.match(html, /placeholder="County, parish, or region"/, `${pagePath} should use a neutral county hint`);
  }
});
