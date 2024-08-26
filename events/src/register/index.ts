import { EventScript } from "type";

 const testRegister: EventScript = {
  name: "testRegister",
  version: "1.0.0",
  description: "测试事件注册",
  handler: (context) => {
    console.log(context);
  },
};

export default testRegister;
