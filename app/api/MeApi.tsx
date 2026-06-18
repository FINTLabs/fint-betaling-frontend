import type { IUser } from "~/types/user";
import { createApiManager } from "~/api/apiBaseUrl";

class MeApi {
  static async fetchMe(request?: Request): Promise<IUser> {
    const res = await createApiManager(request).call<IUser>({
      method: "GET",
      endpoint: "/api/me",
      functionName: "fetchMe",
      customErrorMessage: "Kunne ikke hente brukerdata",
      customSuccessMessage: "Brukerdata hentet",
    });

    if (res.success && res.data) {
      return res.data;
    }

    throw new Response("Ingen tilkobling til server", {
      status: 500,
      statusText:
        "Ingen brukerdata funnet, vurder å logge ut og logge inn igjen.",
    });
  }
}

export default MeApi;
