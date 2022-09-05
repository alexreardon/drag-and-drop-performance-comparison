export function observePerformance() {
  if (typeof window === 'undefined') {
    return;
  }
  const observer = new PerformanceObserver(function observe(entries) {
    console.log(entries.getEntriesByType('measure'));
  });
  observer.observe({ entryTypes: ['measure'] });
}
