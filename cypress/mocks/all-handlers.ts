import { analyticsHandlers } from "./handlers/analytics";
import { claimHandlers } from "./handlers/claim";
import { groupHandlers } from "./handlers/group";
import { meHandlers } from "./handlers/me";
import { principalHandlers } from "./handlers/principal";

export const handlers = [
  ...meHandlers,
  ...claimHandlers,
  ...groupHandlers,
  ...principalHandlers,
  ...analyticsHandlers,
];
