import React from "react";

import events from "@go-blite/events";

export const ButtonSettings = () => {
  const eventOptions = Object.values(events).map(key => {
    return {
      label: key.name,
      value: key.handler
    };
  });
  console.log(eventOptions, "eventOptions");
  return <React.Fragment>ff</React.Fragment>;
};
