import { EventScript } from "types";

const login: EventScript = {
  name: "login",
  version: "1.0.0",
  description: "login事件注册",
  handler: context => {
    console.log(context, "login事件注册");
  }
};

export default login;
