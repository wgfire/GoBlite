/**
 * 非农的业务倒计时组件
 */

import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { NonFarmProps } from "./type";
import { useDateSubtr } from "./hooks/useDateSubtr";
import ElementBox from "@/components/ElementBox";
import { NonFarmSettings } from "./NonFarmSettings";
import { NonFarmSettingsFast } from "./NonFarmSettingsFast";
import ContentEditable from "react-contenteditable";

export const defaultProps: NonFarmProps = {
  style: {
    background: "#996741"
  },
  events: {},
  customStyle: {
    maxHeight: 100000,
    maxWidth: 100000,
    padding: 0,
    margin: 0,
    width: "max-content",
    height: "auto"
  },
  animation: [],
  time: "2025-06-04T20:30:00",
  timeText: "非农公布倒计时",
  dayText: "天"
};

export const NonFarm: UserComponent<Partial<React.PropsWithChildren<NonFarmProps>>> = props => {
  const {
    id,
    connectors: { connect },
    setProp
  } = useNode();
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  const options = {
    ...defaultProps,
    ...props
  };
  const { time, style, customStyle } = options;

  const { days, hours, minutes, seconds } = useDateSubtr(time);

  return (
    <ElementBox ref={node => node && connect(node)} id={id} data-id={id} style={{ ...customStyle }}>
      {
        <div
          className="flex justify-around items-center h-full gap-1"
          style={{
            color: "#996741"
          }}
        >
          <ContentEditable
            html={options.timeText || ""}
            disabled={!enabled}
            onChange={e => {
              setProp(prop => (prop.timeText = e.target.value), 500);
            }}
            tagName="p"
            style={{
              fontSize: parseInt(style?.fontSize as string) + "px",
              width: "max-content"
            }}
          />
          <div
            className="time-box flex flex-col justify-center items-center px-2 rounded-sm"
            style={{
              backgroundColor: style?.background,
              color: "white"
            }}
          >
            {days}
          </div>
          <ContentEditable
            html={options.dayText || ""}
            disabled={!enabled}
            onChange={e => {
              setProp(prop => (prop.dayText = e.target.value), 500);
            }}
            tagName="p"
            style={{
              fontSize: parseInt(style?.fontSize as string) + "px",
              width: "max-content"
            }}
          />
          <div
            className="time-box flex flex-col justify-center items-center px-2 rounded-sm"
            style={{
              backgroundColor: style?.background,
              color: "white"
            }}
          >
            {hours}
          </div>
          :
          <div
            className="time-box flex flex-col justify-center items-center px-2 rounded-sm"
            style={{
              backgroundColor: style?.background,
              color: "white"
            }}
          >
            {minutes}
          </div>
          :
          <div
            className="time-box flex flex-col justify-center items-center px-2 rounded-sm"
            style={{
              backgroundColor: style?.background,
              color: "white"
            }}
          >
            {seconds}
          </div>
        </div>
      }
    </ElementBox>
  );
};
NonFarm.craft = {
  props: defaultProps,
  rules: {
    canDrag: () => true
  },
  related: {
    settings: NonFarmSettings,
    fastSettings: NonFarmSettingsFast
  },
  name: "NonFarm",
  displayName: "NonFarm",
  custom: {
    displayName: "NonFarm" // 设置默认的显示名称
  }
};
