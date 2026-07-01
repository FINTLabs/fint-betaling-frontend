import type { IUser } from "~/types/user";
import {NovariApiManager} from "novari-frontend-components";

const baseUrl = import.meta.env.VITE_API_URL;
console.log("Base URL: ", baseUrl)

const apiManager = new NovariApiManager({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
});

class MeApi {
  static async fetchMe(): Promise<IUser> {
    const res = await apiManager.call<IUser>({
      method: "GET",
      endpoint: "/api/me",
      functionName: "fetchMe",
      customErrorMessage: "Kunne ikke hente brukerdata",
      customSuccessMessage: "Brukerdata hentet",
    });

    if (res.success && res.data) {
      console.log(res.data);
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
