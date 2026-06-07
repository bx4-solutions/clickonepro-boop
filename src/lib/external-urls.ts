// ============================================
// External URLs - Centralized Constants
// ============================================
// This file centralizes all external URLs used across the site
// to ensure consistency and easy maintenance.

export const EXTERNAL_URLS = {
  // GoHighLevel - Demo Booking
  GHL_BOOKING: "https://links.clickonepro.com/widget/bookings/clickoneus",
  
  // App Login
  APP_LOGIN: "https://app.clickonepro.com/",
  
  // Chat Widget
  CHAT_WIDGET_SCRIPT: "https://beta.leadconnectorhq.com/loader.js",
  CHAT_WIDGET_RESOURCES: "https://beta.leadconnectorhq.com/chat-widget/loader.js",
  CHAT_WIDGET_ID: "6958160ae056feed599822d0",
} as const;

// Contact Information
export const CONTACT_INFO = {
  EMAIL: "info@clickonepro.com",
  PHONE: "+1 (770) 501-7321",
  PHONE_HREF: "tel:+17705017321",
  LOCATION: "United States",
} as const;

// UTM Parameter Helper
export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

/**
 * Appends UTM parameters to a URL for campaign tracking
 */
export const appendUTMParams = (baseUrl: string, utmParams: UTMParams): string => {
  const url = new URL(baseUrl);
  if (utmParams.source) url.searchParams.set("utm_source", utmParams.source);
  if (utmParams.medium) url.searchParams.set("utm_medium", utmParams.medium);
  if (utmParams.campaign) url.searchParams.set("utm_campaign", utmParams.campaign);
  if (utmParams.content) url.searchParams.set("utm_content", utmParams.content);
  if (utmParams.term) url.searchParams.set("utm_term", utmParams.term);
  return url.toString();
};
