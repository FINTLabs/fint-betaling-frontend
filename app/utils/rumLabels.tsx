export function normalizeRoute(pathname: string) {
    return pathname
        .replace(/\/\d+(?=\/|$)/g, "/:id")
        .replace(
            /\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?=\/|$)/gi,
            "/:id"
        );
}

export function appFromPath(pathname: string) {
    const first = pathname.split("/").filter(Boolean)[0];
    return first ?? "main";
}

export function envLabel() {
    return process.env.NODE_ENV ?? "unknown";
}