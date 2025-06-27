import { ElementBoxView, useNode, UserComponent } from "@go-blite/design";
import React from "react";
import { ChartKline } from "./components/charkLine";
import { SymbolCardSettings } from "./SymbolCardSettings";
import { defaultProps } from "./constant";
import { useMount } from "ahooks";
import { MainSymbolProps } from "./type";
import { formatKlineData } from "./utils";
const mockData = [
  {
    close: 2874.18,
    datetime: "2025-02-10T22:00:00",
    high: 2910.17,
    low: 2869.93,
    open: 2875.55
  },
  {
    close: 2867.16,
    datetime: "2025-02-16T21:00:00",
    high: 2874.27,
    low: 2856.4,
    open: 2871.18
  },
  {
    close: 2901.32,
    datetime: "2025-02-17T21:00:00",
    high: 2904.6,
    low: 2860.09,
    open: 2867.15
  },
  {
    close: 2903.53,
    datetime: "2025-02-18T21:00:00",
    high: 2914.44,
    low: 2886.47,
    open: 2901.35
  },
  {
    close: 2905.43,
    datetime: "2025-02-19T21:00:00",
    high: 2922.15,
    low: 2892.11,
    open: 2903.32
  },
  {
    close: 2902.47,
    datetime: "2025-02-20T21:00:00",
    high: 2917.09,
    low: 2884.64,
    open: 2905.55
  },
  {
    close: 2903.95,
    datetime: "2025-02-21T21:00:00",
    high: 2905.8,
    low: 2899.63,
    open: 2902.5
  },
  {
    close: 2911.56,
    datetime: "2025-02-23T21:00:00",
    high: 2923.6,
    low: 2889.1,
    open: 2902.39
  },
  {
    close: 2880.62,
    datetime: "2025-02-24T21:00:00",
    high: 2921.46,
    low: 2856.85,
    open: 2918.44
  },
  {
    close: 2884.28,
    datetime: "2025-02-25T21:00:00",
    high: 2897.74,
    low: 2859.1,
    open: 2880.66
  },
  {
    close: 2842.13,
    datetime: "2025-02-26T21:00:00",
    high: 2888.51,
    low: 2836.34,
    open: 2884.31
  },
  {
    close: 2823.39,
    datetime: "2025-02-27T21:00:00",
    high: 2853.15,
    low: 2801.44,
    open: 2842.12
  },
  {
    close: 2827.96,
    datetime: "2025-02-28T21:00:00",
    high: 2828.2,
    low: 2822.12,
    open: 2823.71
  },
  {
    close: 2859.03,
    datetime: "2025-03-02T21:00:00",
    high: 2861.17,
    low: 2824.37,
    open: 2824.37
  },
  {
    close: 2885.14,
    datetime: "2025-03-03T21:00:00",
    high: 2895.49,
    low: 2850.13,
    open: 2859.54
  },
  {
    close: 2890.12,
    datetime: "2025-03-04T21:00:00",
    high: 2897.43,
    low: 2862.57,
    open: 2885.5
  },
  {
    close: 2905.67,
    datetime: "2025-03-05T21:00:00",
    high: 2919.73,
    low: 2882.53,
    open: 2890.67
  },
  {
    close: 2906.73,
    datetime: "2025-03-06T21:00:00",
    high: 2927.24,
    low: 2898.94,
    open: 2919.41
  },
  {
    close: 2906.19,
    datetime: "2025-03-07T21:00:00",
    high: 2909.74,
    low: 2905.08,
    open: 2906.71
  },
  {
    close: 2886.12,
    datetime: "2025-03-09T21:00:00",
    high: 2915.29,
    low: 2877.25,
    open: 2908.99
  },
  {
    close: 2912.91,
    datetime: "2025-03-10T21:00:00",
    high: 2919.19,
    low: 2877.25,
    open: 2886.12
  },
  {
    close: 2930.72,
    datetime: "2025-03-11T21:00:00",
    high: 2937.48,
    low: 2903.02,
    open: 2912.59
  },
  {
    close: 2985.9,
    datetime: "2025-03-12T21:00:00",
    high: 2986.3,
    low: 2929.95,
    open: 2930.7
  },
  {
    close: 2981.44,
    datetime: "2025-03-13T21:00:00",
    high: 3001.8,
    low: 2975.29,
    open: 2984.87
  },
  {
    close: 3000.38,
    datetime: "2025-03-16T21:00:00",
    high: 3001.75,
    low: 2982.1,
    open: 2984.46
  },
  {
    close: 3034.22,
    datetime: "2025-03-17T21:00:00",
    high: 3038.13,
    low: 2999.35,
    open: 3000.85
  },
  {
    close: 3047.63,
    datetime: "2025-03-18T21:00:00",
    high: 3051.83,
    low: 3022.73,
    open: 3034.02
  },
  {
    close: 3044.66,
    datetime: "2025-03-19T21:00:00",
    high: 3057.32,
    low: 3025.56,
    open: 3048.33
  },
  {
    close: 3023.4,
    datetime: "2025-03-20T21:00:00",
    high: 3047.35,
    low: 2999.37,
    open: 3044.84
  },
  {
    close: 3011.6,
    datetime: "2025-03-23T21:00:00",
    high: 3033.14,
    low: 3002.33,
    open: 3024.05
  },
  {
    close: 3019.63,
    datetime: "2025-03-24T21:00:00",
    high: 3035.94,
    low: 3007.42,
    open: 3011.22
  },
  {
    close: 3019.25,
    datetime: "2025-03-25T21:00:00",
    high: 3032.15,
    low: 3012.27,
    open: 3019.32
  },
  {
    close: 3056.17,
    datetime: "2025-03-26T21:00:00",
    high: 3059.65,
    low: 3017.51,
    open: 3019.1
  },
  {
    close: 3084.95,
    datetime: "2025-03-27T21:00:00",
    high: 3086.75,
    low: 3053.9,
    open: 3055.9
  },
  {
    close: 3123.51,
    datetime: "2025-03-30T21:00:00",
    high: 3127.83,
    low: 3076.7,
    open: 3088.26
  },
  {
    close: 3114.45,
    datetime: "2025-03-31T21:00:00",
    high: 3148.91,
    low: 3100.77,
    open: 3124.17
  },
  {
    close: 3133.74,
    datetime: "2025-04-01T21:00:00",
    high: 3142.33,
    low: 3104.66,
    open: 3113.99
  },
  {
    close: 3114.35,
    datetime: "2025-04-02T21:00:00",
    high: 3167.68,
    low: 3054.02,
    open: 3133
  },
  {
    close: 3038.05,
    datetime: "2025-04-03T21:00:00",
    high: 3136.35,
    low: 3015.66,
    open: 3113.86
  },
  {
    close: 2982.71,
    datetime: "2025-04-06T21:00:00",
    high: 3055.22,
    low: 2956.31,
    open: 3027.64
  },
  {
    close: 2982.44,
    datetime: "2025-04-07T21:00:00",
    high: 3022.44,
    low: 2974.59,
    open: 2981.95
  },
  {
    close: 3082.2,
    datetime: "2025-04-08T21:00:00",
    high: 3099.57,
    low: 2969.86,
    open: 2982.86
  },
  {
    close: 3175.28,
    datetime: "2025-04-09T21:00:00",
    high: 3176.43,
    low: 3071.09,
    open: 3080.56
  },
  {
    close: 3237.1,
    datetime: "2025-04-10T21:00:00",
    high: 3245.27,
    low: 3176.03,
    open: 3176.59
  },
  {
    close: 3210.67,
    datetime: "2025-04-13T21:00:00",
    high: 3245.52,
    low: 3193.55,
    open: 3219.57
  },
  {
    close: 3229.71,
    datetime: "2025-04-14T21:00:00",
    high: 3233.52,
    low: 3209.92,
    open: 3211.62
  },
  {
    close: 3343.11,
    datetime: "2025-04-15T21:00:00",
    high: 3343.12,
    low: 3229.91,
    open: 3230.68
  },
  {
    close: 3327.12,
    datetime: "2025-04-16T21:00:00",
    high: 3357.61,
    low: 3283.81,
    open: 3343.43
  },
  {
    close: 3424.48,
    datetime: "2025-04-20T21:00:00",
    high: 3430.45,
    low: 3328.98,
    open: 3331.62
  },
  {
    close: 3380.56,
    datetime: "2025-04-21T21:00:00",
    high: 3499.92,
    low: 3366.65,
    open: 3424.07
  },
  {
    close: 3289.35,
    datetime: "2025-04-22T21:00:00",
    high: 3386.39,
    low: 3260.68,
    open: 3325.86
  },
  {
    close: 3349.55,
    datetime: "2025-04-23T21:00:00",
    high: 3367.1,
    low: 3305.21,
    open: 3306.09
  },
  {
    close: 3319.3,
    datetime: "2025-04-24T21:00:00",
    high: 3370.29,
    low: 3265.05,
    open: 3350.95
  },
  {
    close: 3343.65,
    datetime: "2025-04-27T21:00:00",
    high: 3352.94,
    low: 3267.92,
    open: 3329.7
  },
  {
    close: 3317.18,
    datetime: "2025-04-28T21:00:00",
    high: 3348.42,
    low: 3299.52,
    open: 3344.9
  },
  {
    close: 3288.31,
    datetime: "2025-04-29T21:00:00",
    high: 3327.85,
    low: 3266.89,
    open: 3314.67
  },
  {
    close: 3238.59,
    datetime: "2025-04-30T21:00:00",
    high: 3290.26,
    low: 3201.86,
    open: 3288.04
  },
  {
    close: 3240.17,
    datetime: "2025-05-01T21:00:00",
    high: 3269.07,
    low: 3222.72,
    open: 3240.7
  },
  {
    close: 3333.89,
    datetime: "2025-05-04T21:00:00",
    high: 3337.55,
    low: 3237.38,
    open: 3242.34
  },
  {
    close: 3431.19,
    datetime: "2025-05-05T21:00:00",
    high: 3434.91,
    low: 3323.24,
    open: 3336.8
  },
  {
    close: 3364.35,
    datetime: "2025-05-06T21:00:00",
    high: 3433.2,
    low: 3360.11,
    open: 3432.8
  },
  {
    close: 3305.63,
    datetime: "2025-05-07T21:00:00",
    high: 3414.66,
    low: 3288.65,
    open: 3364.8
  },
  {
    close: 3324.5,
    datetime: "2025-05-08T21:00:00",
    high: 3347.37,
    low: 3274.57,
    open: 3308.59
  },
  {
    close: 3235.59,
    datetime: "2025-05-11T21:00:00",
    high: 3301.9,
    low: 3207.68,
    open: 3298.02
  },
  {
    close: 3250.03,
    datetime: "2025-05-12T21:00:00",
    high: 3265.47,
    low: 3215.76,
    open: 3240.25
  },
  {
    close: 3177.43,
    datetime: "2025-05-13T21:00:00",
    high: 3256.95,
    low: 3167.94,
    open: 3251.15
  },
  {
    close: 3239.9,
    datetime: "2025-05-14T21:00:00",
    high: 3240.6,
    low: 3120.51,
    open: 3180.29
  },
  {
    close: 3203.17,
    datetime: "2025-05-15T21:00:00",
    high: 3251.91,
    low: 3154.22,
    open: 3239.3
  },
  {
    close: 3229.8,
    datetime: "2025-05-18T21:00:00",
    high: 3249.67,
    low: 3205.85,
    open: 3211.88
  },
  {
    close: 3289.83,
    datetime: "2025-05-19T21:00:00",
    high: 3295.7,
    low: 3204.56,
    open: 3229.24
  },
  {
    close: 3315.3,
    datetime: "2025-05-20T21:00:00",
    high: 3324.81,
    low: 3285.36,
    open: 3291.22
  },
  {
    close: 3294.84,
    datetime: "2025-05-21T21:00:00",
    high: 3345.31,
    low: 3279.46,
    open: 3315.3
  },
  {
    close: 3357.54,
    datetime: "2025-05-22T21:00:00",
    high: 3365.88,
    low: 3287.05,
    open: 3296.24
  },
  {
    close: 3342.08,
    datetime: "2025-05-25T21:00:00",
    high: 3356.59,
    low: 3323.7,
    open: 3352.09
  },
  {
    close: 3300.72,
    datetime: "2025-05-26T21:00:00",
    high: 3349.85,
    low: 3285.31,
    open: 3342.91
  },
  {
    close: 3287.29,
    datetime: "2025-05-27T21:00:00",
    high: 3325.37,
    low: 3276.61,
    open: 3301.02
  },
  {
    close: 3317.55,
    datetime: "2025-05-28T21:00:00",
    high: 3330.87,
    low: 3245.34,
    open: 3286.66
  },
  {
    close: 3289.03,
    datetime: "2025-05-29T21:00:00",
    high: 3322.58,
    low: 3271.39,
    open: 3318.72
  },
  {
    close: 3381.3,
    datetime: "2025-06-01T21:00:00",
    high: 3382.72,
    low: 3298.02,
    open: 3298.32
  },
  {
    close: 3353.02,
    datetime: "2025-06-02T21:00:00",
    high: 3391.92,
    low: 3333.09,
    open: 3383.02
  },
  {
    close: 3371.99,
    datetime: "2025-06-03T21:00:00",
    high: 3384.59,
    low: 3343.67,
    open: 3354.45
  },
  {
    close: 3352.68,
    datetime: "2025-06-04T21:00:00",
    high: 3403.35,
    low: 3339.32,
    open: 3374.32
  },
  {
    close: 3310.47,
    datetime: "2025-06-05T21:00:00",
    high: 3375.57,
    low: 3307.02,
    open: 3354.07
  },
  {
    close: 3325.92,
    datetime: "2025-06-08T21:00:00",
    high: 3338.14,
    low: 3293.52,
    open: 3315.39
  },
  {
    close: 3322.97,
    datetime: "2025-06-09T21:00:00",
    high: 3349.05,
    low: 3301.91,
    open: 3326.55
  },
  {
    close: 3354.95,
    datetime: "2025-06-10T21:00:00",
    high: 3360.5,
    low: 3315.34,
    open: 3321.92
  },
  {
    close: 3386.22,
    datetime: "2025-06-11T21:00:00",
    high: 3398.92,
    low: 3338.5,
    open: 3358.24
  },
  {
    close: 3432.23,
    datetime: "2025-06-12T21:00:00",
    high: 3446.76,
    low: 3379.7,
    open: 3385.97
  },
  {
    close: 3385.21,
    datetime: "2025-06-15T21:00:00",
    high: 3451.04,
    low: 3382.83,
    open: 3442.76
  },
  {
    close: 3388.05,
    datetime: "2025-06-16T21:00:00",
    high: 3403.2,
    low: 3366.01,
    open: 3386.29
  },
  {
    close: 3389.58,
    datetime: "2025-06-17T21:00:00",
    high: 3396.08,
    low: 3370.56,
    open: 3391.88
  }
];

export const SymbolCardView: UserComponent<Partial<React.PropsWithChildren<MainSymbolProps>>> = props => {
  // 组件属性
  const { id, setProp } = useNode();

  // 合并默认属性和组件属性
  const options = {
    ...defaultProps,
    ...props
  };

  const klineData = formatKlineData(mockData);

  // 图表说明
  const chartDesc = [
    {
      color: "#042499",
      text: "非农支撑位：3323、3300、3270"
    },
    {
      color: "#F6223C",
      text: "非农阻力位：3323、3300、3270"
    }
  ];

  useMount(() => {});

  return (
    <ElementBoxView id={id} data-id={id} style={{ width: "100%" }}>
      <div className="mb-[8px] w-full bg-white px-[16px] py-[20px]">
        {/* 标题 */}
        <div className="mb-[15px] w-full">
          <span
            contentEditable={true}
            suppressContentEditableWarning={true}
            className="font-bold text-black"
            onInput={e => {
              setProp(prop => (prop.title = e.currentTarget.innerHTML));
            }}
            dangerouslySetInnerHTML={{ __html: options.title || "" }}
          />
        </div>

        {/* 图表 */}
        <div className="mb-[10px] w-full rounded-[10px] bg-[#006CF6]/10 px-[10px] py-[12px]">
          <p className="mb-[12px] text-center text-[15px] font-medium text-black">黄金</p>
          <div className="mb-[10px] min-h-[200px] rounded-[8px] bg-white p-2">
            {/* 图表数据 */}
            <div className="mb-[10px] flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-up text-[26px] font-bold leading-[32px]">1920.89</span>
                <span className="text-up text-[12px] leading-[14px]">+19.01 (+1.01%)</span>
              </div>
              <div className="flex flex-col justify-end gap-[2px] pt-1">
                <div className="flex gap-[26px] text-[12px] leading-[14px] text-[#3C3F43]/60">
                  <span>近30天最高</span>
                  <span className="text-up">3423.56</span>
                </div>
                <div className="flex gap-[26px] text-[12px] leading-[14px] text-[#3C3F43]/60">
                  <span>近30天最低</span>
                  <span className="text-down">3423.57</span>
                </div>
              </div>
            </div>
            {/* 图表 */}
            <div className="h-[180px] w-full overflow-hidden rounded-[4px] border border-[#eeeeee] p-[1px]">
              <ChartKline data={klineData || []} />
            </div>
          </div>
          {/* 图表说明 */}
          <div className="flex flex-col gap-1">
            {chartDesc?.map((item, index) => (
              <div className="flex items-center gap-[6px] text-[12px] text-black" key={index}>
                <div className={"h-[4px] w-[4px] rounded-full bg-[#042499]"}></div>
                <div>{item?.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 交易按钮 */}
        <div className="mb-3 flex w-full justify-between gap-[10px]">
          <button className="h-[50px] flex-1 rounded-[8px] border-0 bg-[#F6223C] text-lg font-semibold text-white outline-none">
            卖出
          </button>
          <button className="h-[50px] flex-1 rounded-[8px] border-0 bg-[#34C759] text-lg font-semibold text-white outline-none">
            买入
          </button>
        </div>
      </div>
    </ElementBoxView>
  );
};

SymbolCardView.craft = {
  props: defaultProps,
  rules: {
    canDrag: () => true
  },
  related: {
    settings: SymbolCardSettings
  },
  name: "SymbolCard",
  custom: {
    displayName: "品种走势卡"
  }
};
