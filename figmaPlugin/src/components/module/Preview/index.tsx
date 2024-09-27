export interface PreviewProps {
  data: ExportPreviewType[];
  width: number;
  height?: number;
}
export interface ExportPreviewType {
  src: string;
  name: string;
  id: string;
}
export const Preview: React.FC<PreviewProps> = (props) => {
  const { data, width, height } = props;
  console.log(data, "预览数据");
  return (
    <div className="flex flex-col " style={{ width: width, height: height ?? "auto" }}>
      {data.map((item, index) => {
        const { src } = item;
        return <img key={index} src={src} className="w-full" />;
      })}
    </div>
  );
};
