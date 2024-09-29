import { UserComponent, useNode } from "@craftjs/core";
import cx from "classnames";
import { styled } from "styled-components";
/**
 * next.js服务端加载为cjs，es6模块引用commonjs模块时，因为import name from '..'想取的是模块的default属性，而commonjs模块没有暴露default的方法，
 * 所以webpack将整个模块作为了default属性的值输出，并且如果是用commonjs规范打的esm包会增加 Object.defineProperty(exports, "__esModule", { value: true });
 * 然后将export default的值 挂载到 exports.default上。
 * 
 * 导致遇到这种问题，都需要根据库的导出方式 手动处理一下 比如styled 需要改成具名导出
 * import  {styled}  from "styled-components";
 * 
 * import _ContentEditable from "react-contenteditable"; 他没有exports.contentEditable 所以还得用default
   const ContentEditable = _ContentEditable.default;

   感觉还是使用具名导出吧，可以避免一些问题
 */

import events, { EventScript } from "@go-blite/events";
import { ButtonSettings } from "./ButtonSettings";

import { Text } from "../Text";
import { useCustomContext } from "../../context";

type ButtonProps = {
  background?: Record<"r" | "g" | "b" | "a", number>;
  color?: Record<"r" | "g" | "b" | "a", number>;
  buttonStyle?: string;
  margin?: any[];
  text?: string;
  textComponent?: any;
  event?: Record<string, any>;
};

const StyledButton = styled.button<ButtonProps>`
  background: ${(props) => (props.buttonStyle === "full" ? `rgba(${Object.values(props.background)})` : "transparent")};
  border: 2px solid transparent;
  border-color: ${(props) => (props.buttonStyle === "outline" ? `rgba(${Object.values(props.background)})` : "transparent")};
  margin: ${({ margin }) => `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`};
`;

export const Button: UserComponent<ButtonProps> = (props: any) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const { publish } = useCustomContext();

  const { text, textComponent, color, event, ...otherProps } = props;

  /*
   * 如果是构建部署环境，那么需要从window找到当前的脚本handler
   */
  const handleClick = (e) => {
    if (event) {
      const handler = !publish ? events[event]?.handler : (window[event] as unknown as EventScript)?.handler;
      console.log("click event", event, handler);
      handler && handler({ target: e, eventName: event, data: "携带的数据" });
      return;
    }
  };
  return (
    <StyledButton
      ref={connect}
      className={cx([
        "rounded w-full px-4 py-2",
        {
          "shadow-lg": props.buttonStyle === "full",
        },
      ])}
      onClick={(e) => handleClick(e)}
      {...otherProps}
    >
      <Text {...textComponent} text={text} color={props.color} />
    </StyledButton>
  );
};

Button.craft = {
  displayName: "Button",
  props: {
    background: { r: 255, g: 255, b: 255, a: 0.5 },
    color: { r: 92, g: 90, b: 90, a: 1 },
    buttonStyle: "full",
    text: "Button",
    margin: ["5", "0", "5", "0"],
    textComponent: {
      ...Text.craft.props,
      textAlign: "center",
    },
  },
  related: {
    toolbar: ButtonSettings,
  },
};
