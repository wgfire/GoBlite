import { EventScript } from "types";

const login: EventScript = {
  name: "跳转卡券中心",
  version: "1.0.0",
  description: "跳转卡券中心",
  handler: context => {
    console.log(context, "跳转卡券中心");
    const { window } = context;
    window?.openH5Detail &&
      window.openH5Detail({
        url: window.location.origin + "/h5/activity/welfare-center?needTitle=true"
      });
    // context.window?.location.replace(context.window?.location.origin + "/h5/activity/welfare-center?needTitle=true");
  }
};

export default login;
