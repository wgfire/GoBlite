import { BaseStyle, CommonComponentProps } from "@go-blite/design";

export interface ContainerStyle extends BaseStyle {
  fillSpace?: boolean;
  gridCols?: number;
  gridRows?: number;
}

export interface NonFarmProps extends CommonComponentProps {
  style: ContainerStyle;
  customStyle: ContainerStyle;
  time: string;
  timeText: string;
  dayText: string;
}
