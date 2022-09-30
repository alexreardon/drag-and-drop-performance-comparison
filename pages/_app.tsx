import '../styles/globals.css';
import '@atlaskit/css-reset';
import '@atlaskit/tokens/css/atlassian-light.css';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

function useFPS() {
  useEffect(() => {
    let frameId: number | null = null;
    let runningAverage: { count: number; total: number } | null = null;

    function run(last: number) {
      frameId = requestAnimationFrame((now) => {
        const diff = now - last;
        const fps = toFixed(1000 / diff);
        if (diff < 0) {
          run(now);
          return;
        }
        // debugger;

        if (!runningAverage) {
          runningAverage = { count: 1, total: fps };
        } else {
          runningAverage.count++;
          runningAverage.total += fps;
        }

        console.log({
          diff,
          fps,
          averageFps: toFixed(runningAverage.total / runningAverage.count),
        });
        run(now);
      });
    }
    run(performance.now());

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  // useFPS();

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
    observer.observe({ entryTypes: ['longtask', 'event'] });
    console.log('what have we got', PerformanceObserver.supportedEntryTypes);

    return () => observer.disconnect();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
