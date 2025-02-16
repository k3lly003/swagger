"use client";

import Script from "next/script";

export function CloudflareAnalytics({ token }: { token?: string }) {
  // Only include the beacon if a token is provided
  if (!token) return null;

  return (
    <>
      {/* Cloudflare Web Analytics */}
      <Script
        id="cloudflare-analytics"
        strategy="afterInteractive"
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={`{"token": "${token}"}`}
      />
    </>
  );
}

export function CloudflareSpeedInsights() {
  return (
    <>
      {/* Cloudflare Web Vitals Monitoring */}
      <Script id="cloudflare-web-vitals" strategy="afterInteractive">
        {`
          // Simple web vitals reporting using Browser's native Performance API
          function sendToCloudflare(metric) {
            console.log('Web Vital:', metric.name, metric.value);
            
            // Example of how you might log this with a Cloudflare Worker
            if (navigator.sendBeacon) {
              const url = '/api/vitals';
              const data = JSON.stringify({
                name: metric.name,
                value: metric.value,
                id: metric.id,
                page: window.location.pathname,
              });
              navigator.sendBeacon(url, data);
            }
          }

          // Use native Performance API instead of web-vitals library
          if ('PerformanceObserver' in window) {
            // FID: First Input Delay
            new PerformanceObserver((entryList) => {
              for (const entry of entryList.getEntries()) {
                const metric = {
                  name: 'FID',
                  value: entry.processingStart - entry.startTime,
                  id: entry.id
                };
                sendToCloudflare(metric);
              }
            }).observe({ type: 'first-input', buffered: true });
            
            // LCP: Largest Contentful Paint
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries();
              const lastEntry = entries[entries.length - 1];
              const metric = {
                name: 'LCP',
                value: lastEntry.startTime,
                id: lastEntry.id
              };
              sendToCloudflare(metric);
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            
            // CLS: Cumulative Layout Shift
            let clsValue = 0;
            let clsEntries = [];
            
            new PerformanceObserver((entryList) => {
              for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                  clsEntries.push(entry);
                }
              }
              
              const metric = {
                name: 'CLS',
                value: clsValue,
                id: 'cls-' + Date.now()
              };
              sendToCloudflare(metric);
            }).observe({ type: 'layout-shift', buffered: true });
          }
        `}
      </Script>
    </>
  );
}
