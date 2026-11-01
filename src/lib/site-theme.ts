/**
 * The public site's light/dark choice (components/layout/SiteTheme.tsx).
 * Kept out of that client module so the root layout, a server component,
 * can inline the script as a plain string.
 */
export const SITE_THEME_KEY = "nectarray-site-theme";

/** For the root layout's <head>: sets the theme before the page paints. */
export const siteThemeScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(SITE_THEME_KEY)})==="dark")document.documentElement.dataset.siteTheme="dark"}catch(e){}})()`;
