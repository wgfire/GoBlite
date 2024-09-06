import { EventScript } from "types";

const register: EventScript = {
  name: "register",
  version: "1.0.0",
  description: "测试事件注册",
  handler: (context) => {
    console.log(context);
  },
};
export const a = 50
export default register;
