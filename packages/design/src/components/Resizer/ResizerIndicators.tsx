import React from "react";
import "./Resizer.css";

interface ResizerIndicatorsProps {
  bound?: "row" | "column" | false;
}

export const ResizerIndicators: React.FC<ResizerIndicatorsProps> = ({ bound }) => {
  return (
    <div className={`absolute top-0 left-0 w-full h-full pointer-events-none ${bound ? "bound-" + bound : ""}`}>
      {/* 虚线边框 */}
      <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-blue-500"></div>

      {/* 指示圆点 */}
      <span className="absolute w-3 h-3 bg-white rounded-full shadow-md z-50 pointer-events-none border-2 border-blue-500 indicator-1"></span>
      <span className="absolute w-3 h-3 bg-white rounded-full shadow-md z-50 pointer-events-none border-2 border-blue-500 indicator-2"></span>
      <span className="absolute w-3 h-3 bg-white rounded-full shadow-md z-50 pointer-events-none border-2 border-blue-500 indicator-3"></span>
      <span className="absolute w-3 h-3 bg-white rounded-full shadow-md z-50 pointer-events-none border-2 border-blue-500 indicator-4"></span>
    </div>
  );
};
