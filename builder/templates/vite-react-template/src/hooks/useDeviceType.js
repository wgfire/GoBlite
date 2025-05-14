import { useState, useEffect } from "react";

const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)"
};

export function useDeviceType(defaultDevice = "desktop") {
  const [deviceType, setDeviceType] = useState(() => {
    if (typeof window === "undefined") return defaultDevice; // SSR/Pre-render guard
    if (window.matchMedia(breakpoints.mobile).matches) return "mobile";
    if (window.matchMedia(breakpoints.tablet).matches) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (window.matchMedia(breakpoints.mobile).matches) {
        setDeviceType("mobile");
      } else if (window.matchMedia(breakpoints.tablet).matches) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
}
