import React from "react";
import DesignPageClient from "./components/DesignPageClient";
import { devices } from "./data/mock";
import { DesignContextProps } from "@go-blite/design";

const App: React.FC = () => {
  const validDevices = Array.isArray(devices) ? devices : [];
  console.log(validDevices, "数据");
  return <DesignPageClient devices={validDevices as unknown as DesignContextProps["device"]} />;
};

export default App;
