export function getRequestCookieHeaders(request: Request): Record<string, string> {
  const cookie = request.headers.get("Cookie");
  return cookie ? { Cookie: cookie } : {};
}
