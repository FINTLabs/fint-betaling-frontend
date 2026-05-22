export class HeaderProperties {
  static cookies: string = "";
  static schoolOrgId: string = "";

  static setProperties(request: Request) {
    HeaderProperties.cookies = request.headers.get("Cookie") || "";
    HeaderProperties.schoolOrgId =
      request.headers.get("x-school-org-id") ||
      HeaderProperties.schoolOrgId ||
      "";
  }

  static getSchoolOrgId() {
    return HeaderProperties.schoolOrgId;
  }
  static setSchoolOrgId(schoolOrgId: string) {
    HeaderProperties.schoolOrgId = schoolOrgId;
  }

  static getCookie() {
    return HeaderProperties.cookies;
  }
}
