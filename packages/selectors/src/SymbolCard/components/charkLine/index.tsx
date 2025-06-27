import React, { useRef, useEffect } from "react";
import { createChart, CandlestickSeries, ColorType } from "lightweight-charts";
import "./style.css";
import { KlineData } from "../../utils";

interface ChartProps {
  data: KlineData[];
}

export const ChartKline: React.FC<ChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: "white"
        },
        textColor: "#c1c1c1"
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      rightPriceScale: {
        borderColor: "#eeeeee",
        textColor: "#c1c1c1",
        borderVisible: false
      },
      crosshair: {
        vertLine: {
          labelBackgroundColor: "#009E4A"
        },
        horzLine: {
          labelBackgroundColor: "#009E4A"
        }
      },
      timeScale: {
        borderColor: "#eeeeee",
        visible: true,
        timeVisible: true,
        allowBoldLabels: false,
        minBarSpacing: 10,
        rightOffset: 0,
        fixRightEdge: true,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toISOString().split("T")[0];
        }
      },
      grid: {
        vertLines: {
          color: "#eeeeee"
        },
        horzLines: {
          color: "#eeeeee"
        }
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#009E4A",
      downColor: "#F6223C",
      borderVisible: false,
      wickUpColor: "#009E4A",
      wickDownColor: "#F6223C"
    });

    candlestickSeries.setData(data);
    chart.timeScale().fitContent();

    // 清理函数
    return () => {
      chart.remove();
    };
  }, [data]); // 依赖于data变化

  return (
    <div className="relative h-full w-full">
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
};
