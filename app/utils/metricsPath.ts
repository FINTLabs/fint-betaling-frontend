const ROUTE_PATTERNS = [
    '/',
    '/send',
    '/ny',
    '/historikk',
    '/metrics',
];

function patternToMatcher(pattern: string): RegExp {
    const esc = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = '^' + esc.replace(/:[^/]+/g, '[^/]+') + '$';
    return new RegExp(re);
}

export function normalizePathname(rawPathname: string): string {
    const pathname = rawPathname.replace(/\/+$/, '') || '/';

    for (const pattern of ROUTE_PATTERNS) {
        if (patternToMatcher(pattern).test(pathname)) {
            return pattern;
        }
    }

    return pathname;
}
