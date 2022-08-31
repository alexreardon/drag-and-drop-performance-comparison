import '../styles/globals.css';
import '@atlaskit/css-reset';
import '@atlaskit/tokens/css/atlassian-light.css';
import { useRouter } from 'next/router';
import * as fathom from 'fathom-client';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    fathom.load('RAXVWOFR', {
      includedDomains: ['drag-and-drop-performance-comparison.vercel.app/'],
    });

    function onRouteChangeComplete() {
      fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
