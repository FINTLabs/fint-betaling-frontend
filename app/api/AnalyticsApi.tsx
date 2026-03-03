import {NovariApiManager} from "novari-frontend-components";

const ANALYTICS_URL = process.env.ANALYTICS_URL ?? "";

if (!ANALYTICS_URL) {
    console.warn("ANALYTICS_URL is not set");
}
const apiManager = new NovariApiManager({
    baseUrl: ANALYTICS_URL,
});

class AnalyticsApi {
    static async trackEvent(params: {
        app: string;
        type: "page_view" | "button_click" | "search" | "error";
        path?: string;
        element?: string;
        tenant?: string;
        meta?: any;
    }) {
        const body = {
            app: params.app,
            type: params.type,
            path: params.path ?? null,
            element: params.element ?? null,
            tenant: params.tenant ?? null,
            meta: params.meta ?? null,
        };

        console.log("trackEventURL", ANALYTICS_URL);
        const res = await apiManager.call({
            method: "POST",
            endpoint: `/api/events`,
            functionName: "trackEvent",
            body,
            additionalHeaders: {
                "x-analytics-token": "change-me",
            },
        });
        console.log("trackEvent", res);
        return res;
    }

    static async trackView(path: string, tenant?: string) {
        return this.trackEvent({
            app: "fint-betaling-frontend",
            type: "page_view",
            path,
            tenant: tenant || "",
        });
    }

    static async trackButtonClick(element: string, path: string, tenant?: string,
    ) {
        return this.trackEvent({
            app: "fint-betaling-frontend",
            type: "button_click",
            path,
            element,
            tenant: tenant || "",
        });
    }

    static async trackSearch(path: string, meta: Record<string, unknown>,
        tenant?: string,
    ) {
        return this.trackEvent({
            app: "fint-betaling-frontend",
            type: "search",
            path,
            tenant: tenant || "",
            meta
        });
    }

    static async trackError(params: {
        path: string;
        message: string;
        statusCode?: number;
    }) {
        return this.trackEvent({
            app: "fint-betaling-frontend",
            type: "error",
            path: params.path,
            meta: {
                message: params.message,
                statusCode: params.statusCode ?? null,
            },
        });
    }
}
export default AnalyticsApi;
