import '@atlaskit/css-reset';
import '@atlaskit/tokens/css/atlassian-light.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
