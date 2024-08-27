export * from "../type";
import { EventScript } from "../type";
import register from "./register";
import login from "./login";

const event: Record<string, EventScript> = {
  register,
  login,
};

export default event;
