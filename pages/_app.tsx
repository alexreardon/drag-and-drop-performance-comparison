import '../styles/globals.css';
import '@atlaskit/css-reset';
import '@atlaskit/tokens/css/atlassian-light.css';

import type { AppProps } from 'next/app';

import { FocusContextProvider } from '../pieces/shared/focus-context';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [hasFocusLock, setHasFocusLock] = useState<boolean>(false);

  const focusContextValue = { hasFocusLock, setHasFocusLock };

  return (
    <FocusContextProvider value={focusContextValue}>
      <Component {...pageProps} />
    </FocusContextProvider>
  );
}

export default MyApp;
