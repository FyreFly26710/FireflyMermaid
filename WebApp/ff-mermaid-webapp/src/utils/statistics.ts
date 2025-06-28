import type { StatisticsData } from '../types';

// Simple logging function - can be enhanced with analytics later
export const logEvent = (eventName: string, properties?: Record<string, any>) => {
  // Only log in development mode - checking for dev server
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log(`[Event] ${eventName}`, properties);
  }
  // TODO: Add actual analytics tracking here
};

// Save statistics about diagram rendering
export const saveStatistics = (data: StatisticsData) => {
  // Only log in development mode - checking for dev server
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('[Statistics]', {
      diagramType: data.diagramType,
      codeLength: data.code.length,
      isRough: data.isRough,
      renderTime: `${data.renderTime}ms`
    });
  }
  // TODO: Add actual statistics saving here
}; 