export function trackFacebookEvent(event: string, parameters?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, parameters);
  }
}

export function trackTikTokEvent(event: string, parameters?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, parameters);
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { page: () => void; track: (event: string, data?: Record<string, unknown>) => void };
  }
}