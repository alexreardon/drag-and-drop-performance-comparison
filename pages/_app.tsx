import '../styles/globals.css';
import '@atlaskit/css-reset';
import '@atlaskit/tokens/css/atlassian-light.css';

import type { AppProps } from 'next/app';
import { observePerformance } from '../pieces/util/perf';

observePerformance();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
