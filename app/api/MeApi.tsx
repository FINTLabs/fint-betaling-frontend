// import type { IUser } from "~/types/user";
// import {NovariApiManager} from "novari-frontend-components";
//
// const baseUrl = import.meta.env.VITE_API_URL;
// console.log("Base URL: ", baseUrl)
//
// const apiManager = new NovariApiManager({
//   baseUrl: import.meta.env.VITE_API_URL ?? "",
// });
//
// class MeApi {
//   static async fetchMe(): Promise<IUser> {
//     console.log("Fetching me");
//     const res = await apiManager.call<IUser>({
//       method: "GET",
//       endpoint: "/api/me",
//       functionName: "fetchMe",
//       customErrorMessage: "Kunne ikke hente brukerdata",
//       customSuccessMessage: "Brukerdata hentet",
//     });
//     console.log("from backend", res);
//     if (res.success && res.data) {
//       console.log("from backend data", res.data);
//       return res.data;
//     }
//
//     throw new Response("Ingen tilkobling til server", {
//       status: 500,
//       statusText:
//         "Ingen brukerdata funnet, vurder å logge ut og logge inn igjen.",
//     });
//   }
// }
//
// export default MeApi;
import type { IUser } from "~/types/user";

// const baseUrl = import.meta.env.VITE_API_URL ?? "";
const baseUrl = "http://localhost:8080";

class MeApi {
  static async fetchMe(): Promise<IUser> {
    console.log("Fetching me");
    console.log("URL:", `${baseUrl}/api/me`);

    const response = await fetch(`${baseUrl}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", response.status);
    console.log("Content-Type:", response.headers.get("Content-Type"));

    if (!response.ok) {
      const text = await response.text();
      console.error("Error response:", text);

      throw new Response(text, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const text = await response.text();
    console.log("Raw response:", text);

    const data = JSON.parse(text) as IUser;
    console.log("Parsed user:", data);

    return data;
  }
}

export default MeApi;