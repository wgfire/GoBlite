import React from "react";

import { ToolbarSection, ToolbarItem } from "../../editor/Toolbar";
import { ToolbarRadio } from "../../editor/Toolbar/ToolbarRadio";
import events from "@platform/events";
import { FormControl, Input, InputLabel } from "@material-ui/core";
export const ButtonSettings = () => {
  const eventOptions = Object.values(events).map((key) => {
    return {
      label: key.name ,
      value: key.handler, 
    };
  });
  console.log(eventOptions, "eventOptions");
  return (
    <React.Fragment>
      <ToolbarSection
        title="Colors"
        props={["background", "color"]}
        summary={({ background, color }: any) => {
          return (
            <div className="flex flex-row-reverse">
              <div
                style={{
                  background: background && `rgba(${Object.values(background)})`,
                }}
                className="shadow-md flex-end w-6 h-6 text-center flex items-center rounded-full bg-black"
              >
                <p
                  style={{
                    color: color && `rgba(${Object.values(color)})`,
                  }}
                  className="text-white w-full text-center"
                >
                  T
                </p>
              </div>
            </div>
          );
        }}
      >
        <ToolbarItem full={true} propKey="background" type="bg" label="Background" />
        <ToolbarItem full={true} propKey="color" type="color" label="Text" />
      </ToolbarSection>
      <ToolbarSection
        title="Margin"
        props={["margin"]}
        summary={({ margin }: any) => {
          return `${margin[0] || 0}px ${margin[1] || 0}px ${margin[2] || 0}px ${margin[3] || 0}px`;
        }}
      >
        <ToolbarItem propKey="margin" index={0} type="slider" label="Top" />
        <ToolbarItem propKey="margin" index={1} type="slider" label="Right" />
        <ToolbarItem propKey="margin" index={2} type="slider" label="Bottom" />
        <ToolbarItem propKey="margin" index={3} type="slider" label="Left" />
      </ToolbarSection>
      <ToolbarSection title="Decoration">
        <ToolbarItem propKey="buttonStyle" type="radio" label="Style">
          <ToolbarRadio value="full" label="Full" />
          <ToolbarRadio value="outline" label="Outline" />
        </ToolbarItem>
      </ToolbarSection>
      <ToolbarSection
        title="Events"
        summary={({ event }) => {
          return <span>{event?.name || "none"}</span>;
        }}
      >
        <ToolbarItem
          label="Event"
          propKey="event"
          type="radio"
          onChange={(value) => {
            return value;
          }}
        >
          {eventOptions.map((item) => {
            return <ToolbarRadio value={item.label} label={item.label} />;
          })}
        </ToolbarItem>

        <FormControl>
          <InputLabel>远程事件地址</InputLabel>
          <Input placeholder="请输入远程事件地址" type="url"></Input>
        </FormControl>
        <FormControl>
          <InputLabel>事件名称</InputLabel>
          <Input placeholder="请输入事件名称" type="string"></Input>
        </FormControl>
      </ToolbarSection>
    </React.Fragment>
  );
};
