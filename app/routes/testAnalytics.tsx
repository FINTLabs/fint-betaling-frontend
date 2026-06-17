import {Button} from "@navikt/ds-react";
import {type ActionFunction} from "react-router";
import AnalyticsApi from "~/api/AnalyticsApi";
import MeApi from "~/api/MeApi";
import { setApiBaseUrlFromRequest } from "~/api/apiBaseUrl";

//TODO: REMOVE BEFORE DEPLOY to API
export default function TestAnalytics() {
    function handleTestClick() {
        void AnalyticsApi.trackButtonClick(
            "test-analytics-button",
            location.pathname,
            "fake.fintlabs.no"
        );
    }

    return (<>
          <div>TestAnalytics</div>
          <Button variant="primary" size="medium" onClick={handleTestClick}>
              Klikk meg
          </Button></>
  );

}

export const action: ActionFunction = async ({ request }) => {
    setApiBaseUrlFromRequest(request);
    const formData = await request.formData();
    const actionType = formData.get("actionType") as string;
    const path = formData.get("path") as string;
    const user = await MeApi.fetchMe();
    if (actionType === "TRACK_VIEW") {
        await AnalyticsApi.trackView(path, user?.organisation?.name || "unknown");
    }
    return {
        success: true,
        message: "TESTING analytics",
        variant: "warning",
    };
};
