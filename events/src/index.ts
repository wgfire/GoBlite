export * from '../types'
import register,{a} from "./register";
import login from "./login";
import { EventScript } from '../types';

// // 具名导出
// export const register = registerAlias;
// export const login = loginAlias;
console.log(a)
const event: Record<string, EventScript> = {
  register,
  login,
};

export default event;
