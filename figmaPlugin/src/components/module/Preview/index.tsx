export interface PreviewProps {
  data: ExportPreview[];
  width: number;
  height?: number;
}
export interface ExportPreview {
  props: {
    src: string;
    name: string;
  };
}
export const Preview: React.FC<PreviewProps> = (props) => {
  const { data, width, height } = props;
  console.log(data, "预览数据");
  return (
    <div className="flex flex-col " style={{ width: width, height: height ?? "auto" }}>
      {data.map((item, index) => {
        const { src } = item.props;
        const base64 = `data:image/png;base64,${src}`;
        return <img key={index} src={base64} className="w-full" />;
      })}
    </div>
  );
};
