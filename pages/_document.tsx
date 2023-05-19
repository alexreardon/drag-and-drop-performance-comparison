import { Html, Head, Main, NextScript } from 'next/document';
import json from '../generated/theme.json';

export default function Document() {
  return (
    <Html {...json.themeAttrs}>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: json.light.css }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
