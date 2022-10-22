import '../styles/globals.css';
import '@atlaskit/css-reset';
import '@atlaskit/tokens/css/atlassian-light.css';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { token } from '@atlaskit/tokens';

function format(value: number): number {
  // return Number(value.toFixed(1));
  return Math.round(value);
}

function useFPS() {
  useEffect(() => {
    const output = document.createElement('code');
    Object.assign(output.style, {
      position: 'absolute',
      display: 'block',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: token('color.accent.subtleGreen'),
      padding: 'var(--grid) calc(var(--grid) * 2)',
      fontSize: '20px',
      borderRadius: 'var(--border-radius)',
      border: `var(--border-width) solid ${token('color.accent.boldGreen')}`,
    });
    document.body.appendChild(output);

    let frameId: number | null = null;

    function run(last: number) {
      frameId = requestAnimationFrame((now) => {
        const diff = now - last;
        const fps = format(1000 / diff);

        output.innerText = `${fps}fps`;
        run(now);
      });
    }
    run(performance.now());

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      document.body.removeChild(output);
    };
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  useFPS();

  useEffect(() => {
    const observer = new PerformanceObserver((list, obj) => {
      list.getEntries().forEach((entry) => {
        // Display each reported measurement on console
        console.log(
          'Name: ' +
            entry.name +
            ', Type: ' +
            entry.entryType +
            ', Start: ' +
            entry.startTime +
            ', Duration: ' +
            entry.duration +
            '\n',
        );
      });
    });
    observer.observe({ entryTypes: ['longtask', 'event', 'paint'] });
    console.log('what have we got', PerformanceObserver.supportedEntryTypes);

    return () => observer.disconnect();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
