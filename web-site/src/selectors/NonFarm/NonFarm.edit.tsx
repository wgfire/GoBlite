/**
 * 非农的业务倒计时组件
 */

import { useEditor, useNode, UserComponent, ElementBox } from "@go-blite/design";
import { NonFarmProps } from "./type";
import { useDateSubtr } from "./hooks/useDateSubtr";
import { NonFarmSettings } from "./NonFarmSettings";
import { NonFarmSettingsFast } from "./NonFarmSettingsFast";
import { useAppEnv } from "../hooks/useAppEnv";
import { useEffect } from "react";

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
  const { envData } = useAppEnv();
  useEffect(() => {
    console.log(envData, "envData");
  }, [envData]);
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
          <p
            contentEditable={enabled}
            suppressContentEditableWarning={true}
            onInput={e => {
              setProp(prop => (prop.timeText = e.currentTarget.innerHTML), 500);
            }}
            style={{
              fontSize: parseInt(style?.fontSize as string) + "px",
              width: "max-content"
            }}
            dangerouslySetInnerHTML={{ __html: options.timeText || "" }}
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
          <p
            contentEditable={enabled}
            suppressContentEditableWarning={true}
            onInput={e => {
              setProp(prop => (prop.dayText = e.currentTarget.innerHTML), 500);
            }}
            style={{
              fontSize: parseInt(style?.fontSize as string) + "px",
              width: "max-content"
            }}
            dangerouslySetInnerHTML={{ __html: options.dayText || "" }}
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
