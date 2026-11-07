// Google Analytics 4 (G-04NB5N7QZ9) runs through this Google Tag Manager container.
export const GTM_ID = 'GTM-WJCRNK4Q';

/** localStorage key that holds the visitor's choice: "granted" or "denied". */
export const CONSENT_KEY = 'sqd-consent';

/** Only production builds load GTM, so local development sends no data. */
export const analyticsEnabled = process.env.NODE_ENV === 'production';

/**
 * Inline head script. Sets Google Consent Mode v2 to "denied" before GTM loads,
 * so no analytics cookies are set until the visitor allows them. A stored
 * "granted" choice is applied right away on later visits.
 *
 * Clicks on elements with data-track become dataLayer events (copy_email,
 * cta_click, linkedin_click) with the data-track-location as cta_location.
 * GTM sends them to GA4 under the same consent state as page views.
 */
export function consentAndGtmScript(): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var c = null;
try { c = localStorage.getItem('${CONSENT_KEY}'); } catch (e) {}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: c === 'granted' ? 'granted' : 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
document.addEventListener('click', function (e) {
  var t = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
  if (t) dataLayer.push({ event: t.getAttribute('data-track'), cta_location: t.getAttribute('data-track-location') || undefined });
}, true);
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
`;
}
