export * from "../type";
import { EventScript } from "../type";
import register from "./register";
import login from "./login";

// // 具名导出
// export const register = registerAlias;
// export const login = loginAlias;

const event: Record<string, EventScript> = {
  register,
  login,
};

export default event;
