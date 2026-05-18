/**
 * Content-Security-Policy (CSP) configuration
 * 
 * CSP helps prevent XSS attacks by restricting which resources the browser can load.
 * This includes scripts, stylesheets, images, fonts, and other resources.
 */

/**
 * Generates a Content-Security-Policy header string
 * 
 * This is a basic CSP policy. You may need to adjust it based on:
 * - External APIs you call (add to connect-src)
 * - External fonts/stylesheets (add to font-src, style-src)
 * - Inline scripts/styles (if needed, use 'unsafe-inline' - not recommended)
 * - External images (add to img-src)
 */
export function getContentSecurityPolicy(): string {
  const policies = [
    // Default source - fallback for directives not explicitly set
    "default-src 'self'",
    
    // Scripts - only from same origin and inline scripts (needed for React Router)
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for dev mode
    
    // Stylesheets - same origin and inline styles (needed for CSS-in-JS)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Images - same origin and data URIs
    "img-src 'self' data: https:",
    
    // Fonts - same origin and Google Fonts
    "font-src 'self' data: https://fonts.gstatic.com",
    
    // Connect/AJAX - same origin and your API
    "connect-src 'self' " + (process.env.API_URL || ""),
    
    // Forms - only submit to same origin
    "form-action 'self'",
    
    // Frame ancestors - prevent clickjacking
    "frame-ancestors 'none'",
    
    // Base URI - prevent base tag injection
    "base-uri 'self'",
    
    // Object sources - prevent plugins
    "object-src 'none'",
  ];

  return policies.join("; ");
}

/**
 * Helper to merge CSP header with existing headers
 */
export function mergeHeaders(
  existingHeaders: HeadersInit = {},
  additionalHeaders: HeadersInit = {},
): HeadersInit {
  const merged = new Headers(existingHeaders);
  const additional = new Headers(additionalHeaders);
  
  // Copy all additional headers
  additional.forEach((value, key) => {
    merged.set(key, value);
  });
  
  return merged;
}
