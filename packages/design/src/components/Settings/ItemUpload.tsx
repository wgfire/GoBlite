import React, { useCallback, useState } from "react";
import { useSettings } from "./Context";
import { Label } from "@go-blite/shadcn";
import { Button } from "@go-blite/shadcn";
import { Loader2, Upload } from "lucide-react";
import { defaultProps } from "./types";
import { set } from "lodash-es";
export interface ItemUploadProps<T> extends defaultProps<T> {
  uploadUrl: string;
  acceptTypes?: string;
  buttonText?: string;
}

export function ItemUpload<T>({
  propKey,
  label,
  uploadUrl,
  acceptTypes = "image/*",
  buttonText = "上传图片"
}: ItemUploadProps<T>) {
  const { setProp } = useSettings<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      // 检查propKey和上传URL是否存在
      if (!propKey) {
        setError("缺少属性路径配置");
        return;
      }

      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setLoading(true);
        setError(null);

        // 创建FormData对象并添加文件
        const formData = new FormData();
        formData.append("file", file);

        // 发送上传请求
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error(`上传失败: ${response.status}`);
        }

        const data = await response.json();

        // 检查接口响应格式
        if (data && data.success && data.value && Array.isArray(data.value) && data.value.length > 0) {
          // 获取上传的文件信息
          const fileInfo = data.value[0];
          const origin = new URL(uploadUrl);
          const imagePath = origin.origin + fileInfo.path;

          setTimeout(() => {
            setProp((props: any) => {
              set(props, propKey, imagePath);
              // 调试信息
              console.log("已更新图片路径:", imagePath);
            });
          }, 9000);
        } else {
          console.error("接口响应格式不符合预期:", data);
          throw new Error("上传成功但接口返回数据格式不正确");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "上传失败");
        console.error("上传错误:", err);
      } finally {
        setLoading(false);
        // 重置input，确保可以上传相同的文件
        event.target.value = "";
      }
    },
    [propKey, setProp, uploadUrl]
  );

  return (
    <div className="w-full mb-4">
      {label && <Label className="text-sm text-gray-400">{label}</Label>}
      <div className="mt-1.5 flex items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileUpload}
          className="hidden"
          disabled={loading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
