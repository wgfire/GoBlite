/**
 * 非农的业务倒计时组件
 */

import { useNode, UserComponent } from "@go-blite/design";
import { NonFarmProps } from "./type";
import { useDateSubtr } from "./hooks/useDateSubtr";
import { ElementBoxView } from "@go-blite/design";
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
    width: "10%",
    height: "auto"
  },
  animation: [],
  time: "2025-06-04T20:30:00",
  timeText: "非农公布倒计时",
  dayText: "天"
};

export const NonFarm: UserComponent<Partial<React.PropsWithChildren<NonFarmProps>>> = props => {
  const { id } = useNode();
  const options = {
    ...defaultProps,
    ...props
  };
  const { time, style, customStyle } = options;

  const { days, hours, minutes, seconds, isEnd } = useDateSubtr(time);

  return (
    <ElementBoxView id={id} data-id={id} style={{ ...customStyle }}>
      {!isEnd && (
        <div
          className="flex justify-around items-center h-full gap-1"
          style={{
            color: "#996741"
          }}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: options.timeText || ""
            }}
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
          <p
            dangerouslySetInnerHTML={{
              __html: options.timeText || ""
            }}
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
      )}
    </ElementBoxView>
  );
};
