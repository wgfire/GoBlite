import { ItemColor } from "@/components/Settings/ItemColor";
import { ItemInput } from "@/components/Settings/ItemInput";
import { ItemSelect, ItemSelectProps } from "@/components/Settings/ItemSelect";
import { ItemSlide, ItemSliderProps } from "@/components/Settings/ItemSlider";
import { Layout } from "@/components/Settings/Layout";
import { Section } from "@/components/Settings/Section";
import { defaultProps } from "@/components/Settings/types";
import React, { ReactNode } from "react";

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? T[K] extends ArrayLike<unknown>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof unknown[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

export interface SettingProps<T> {
  children: React.ReactNode;
  setProp: (cb: (props: T) => void, throttleRate?: number) => void;
  value: T;
}
interface ContentProps {
  children: ReactNode;
}

export const Content = ({ children }: ContentProps) => {
  return <div className="space-y-4">{children}</div>;
};

class Settingx<T> extends React.Component<SettingProps<T>> {
  constructor(props: SettingProps<T>) {
    super(props);
  }

  static Content = Content;
  static Layout = Layout;
  static Section = Section;

  static Select<T>({ propKey, ...rest }: { propKey: Path<T> } & ItemSelectProps) {
    const value = this.props.value[propKey as keyof T];
    return (
      <ItemSelect
        {...rest}
        value={value as string}
        onChange={value => {
          console.log(value);
        }}
      />
    );
  }

  Color = ({ propKey, ...rest }: { propKey: Path<T> } & defaultProps<{}>) => {
    const value = this.props.value[propKey as keyof T];
    return (
      <ItemColor
        {...rest}
        value={value as string}
        onChange={color => {
          // props.setProp(p => {
          //   p[propkey as keyof T] = color.rgb;
          // });
          console.log(color);
        }}
      />
    );
  };
  static ItemInput<T>({ propKey, ...rest }: { propKey: keyof T } & defaultProps<string>) {
    const value = this.props.value[propKey as keyof T];
    return (
      <ItemInput
        {...rest}
        value={value as string}
        onChange={(newValue: string) => {
          this.props.setProp(p => {
            p[propKey as keyof T] = newValue as T[keyof T];
          });
        }}
      />
    );
  }

  Slider = ({ propKey, ...rest }: { propKey: Path<T> } & ItemSliderProps<number>) => {
    const value = this.props.value[propKey as keyof T];
    return (
      <ItemSlide
        {...rest}
        value={value as number}
        onChange={value => {
          console.log(value);
        }}
      />
    );
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default Settingx;
