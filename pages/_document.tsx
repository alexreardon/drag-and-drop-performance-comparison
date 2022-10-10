import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html data-theme="light">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div draggable="true">Unhandled draggable</div>
      </body>
    </Html>
  );
}
