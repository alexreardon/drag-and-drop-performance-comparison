import fs from 'node:fs/promises';
import { getThemeHtmlAttrs, getThemeStyles, getSSRAutoScript } from '@atlaskit/tokens';
import invariant from 'tiny-invariant';

async function tryMakeDirectory(directory: string): Promise<void> {
  // if directory already exists, use that
  try {
    await fs.access(directory);
    return;
  } catch (e) {
    // continue;
  }
  try {
    await fs.mkdir(directory);
    return;
  } catch (e) {
    throw e;
  }
}

(async () => {
  const themeAttrs = getThemeHtmlAttrs({ colorMode: 'light' });
  const themeStyles = await getThemeStyles({ colorMode: 'light' });
  const ssrAutoScript = getSSRAutoScript('light');
  const light = themeStyles.find((theme) => theme.id === 'light');
  invariant(light, 'Could not find light theme');

  const output = { themeAttrs, light };

  await tryMakeDirectory('./generated');
  await fs.writeFile('./generated/theme.json', JSON.stringify(output));
})();
