/**
 * AetherOS — Web Vitals Reporter
 * Measures Core Web Vitals: CLS, FID, FCP, LCP, TTFB
 * Pass a callback to send metrics to your analytics endpoint.
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);   // Cumulative Layout Shift
      getFID(onPerfEntry);   // First Input Delay
      getFCP(onPerfEntry);   // First Contentful Paint
      getLCP(onPerfEntry);   // Largest Contentful Paint
      getTTFB(onPerfEntry);  // Time to First Byte
    });
  }
};

export default reportWebVitals;
