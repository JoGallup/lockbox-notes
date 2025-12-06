"use client";

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  interactionToNextPaint: number;
}

interface NetworkMetrics {
  requests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalDataTransferred: number;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    interactionToNextPaint: 0,
  });

  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    requests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    totalDataTransferred: 0,
  });

  const observerRef = useRef<PerformanceObserver | null>(null);
  const networkObserverRef = useRef<PerformanceObserver | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Page Load Performance
    const updatePageLoadMetrics = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (navigation) {
          setMetrics(prev => ({
            ...prev,
            pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          }));
        }
      }
    };

    // Web Vitals and Core Metrics
    const observePerformance = () => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // First Contentful Paint
        observerRef.current = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime,
              }));
            }
          }
        });
        observerRef.current.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lastEntry.startTime,
          }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            setMetrics(prev => ({
              ...prev,
              firstInputDelay: (entry as any).processingStart - entry.startTime,
            }));
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          setMetrics(prev => ({
            ...prev,
            cumulativeLayoutShift: clsValue,
          }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Interaction to Next Paint
        const inpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            interactionToNextPaint: (lastEntry as any).value,
          }));
        });
        inpObserver.observe({ entryTypes: ['event'] });
      }
    };

    // Network Performance
    const observeNetwork = () => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        networkObserverRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceResourceTiming[];

          setNetworkMetrics(prev => {
            const newRequests = prev.requests + entries.length;
            const newFailedRequests = prev.failedRequests + entries.filter(e => e.transferSize === 0).length;
            const responseTimes = entries.map(e => e.responseEnd - e.requestStart);
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const dataTransferred = entries.reduce((sum, e) => sum + e.transferSize, 0);

            return {
              requests: newRequests,
              failedRequests: newFailedRequests,
              averageResponseTime: isNaN(avgResponseTime) ? prev.averageResponseTime : avgResponseTime,
              totalDataTransferred: prev.totalDataTransferred + dataTransferred,
            };
          });
        });

        networkObserverRef.current.observe({ entryTypes: ['resource'] });
      }
    };

    updatePageLoadMetrics();
    observePerformance();
    observeNetwork();

    return () => {
      observerRef.current?.disconnect();
      networkObserverRef.current?.disconnect();
    };
  }, []);

  const getPerformanceScore = (): number => {
    const { pageLoadTime, firstContentfulPaint, largestContentfulPaint } = metrics;

    // Simple scoring algorithm (0-100)
    let score = 100;

    // Page load time penalties
    if (pageLoadTime > 3000) score -= 20;
    else if (pageLoadTime > 2000) score -= 10;
    else if (pageLoadTime > 1000) score -= 5;

    // FCP penalties
    if (firstContentfulPaint > 2000) score -= 15;
    else if (firstContentfulPaint > 1000) score -= 5;

    // LCP penalties
    if (largestContentfulPaint > 4000) score -= 25;
    else if (largestContentfulPaint > 2500) score -= 15;
    else if (largestContentfulPaint > 1000) score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  const logPerformanceReport = () => {
    console.group('🚀 Performance Report');
    console.log('Core Web Vitals:', {
      'First Contentful Paint': `${metrics.firstContentfulPaint.toFixed(2)}ms`,
      'Largest Contentful Paint': `${metrics.largestContentfulPaint.toFixed(2)}ms`,
      'First Input Delay': `${metrics.firstInputDelay.toFixed(2)}ms`,
      'Cumulative Layout Shift': metrics.cumulativeLayoutShift.toFixed(4),
      'Interaction to Next Paint': `${metrics.interactionToNextPaint.toFixed(2)}ms`,
    });
    console.log('Network Metrics:', {
      'Total Requests': networkMetrics.requests,
      'Failed Requests': networkMetrics.failedRequests,
      'Average Response Time': `${networkMetrics.averageResponseTime.toFixed(2)}ms`,
      'Data Transferred': `${(networkMetrics.totalDataTransferred / 1024).toFixed(2)}KB`,
    });
    console.log('Performance Score:', getPerformanceScore());
    console.groupEnd();
  };

  return {
    metrics,
    networkMetrics,
    performanceScore: getPerformanceScore(),
    logPerformanceReport,
    sessionDuration: Date.now() - startTimeRef.current,
  };
}
