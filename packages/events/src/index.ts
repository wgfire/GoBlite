export * from "../types";
import register from "./register";
import login from "./login";
import { EventScript } from "../types";

// // 具名导出
// export const register = registerAlias;
// export const login = loginAlias;

const event: Record<string, EventScript> = {
  register,
  login
};

export default event;
