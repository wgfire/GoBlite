import { useEffect, useState, useCallback } from "react";
import { writeTextToClipboard } from "@/lib/clipboard";
import { Button } from "@go-blite/shadcn/button";
import "./inde.css";
// 定义解析结果类型
interface ImageParseResult {
  [nodeId: string]: {
    resolvedName: string;
    props: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };
    imageData?: {
      format: string;
      width: number;
      height: number;
      aspectRatio: number;
      originalNodeType: string;
    };
  };
}

// 定义解析状态类型
type ParseStatus = "idle" | "parsing" | "success" | "error" | "empty";

export const AutoParser = () => {
  // 状态管理
  const [parseResult, setParseResult] = useState<ImageParseResult | null>(null);
  const [parseStatus, setParseStatus] = useState<ParseStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [copiedNodeId, setCopiedNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // 处理复制到剪贴板
  const handleCopy = useCallback(
    async (nodeId?: string) => {
      try {
        if (!parseResult) return;
        setIsCopying(true);

        const textToCopy = nodeId
          ? JSON.stringify({ [nodeId]: parseResult[nodeId] }, null, 2)
          : JSON.stringify(parseResult, null, 2);

        await writeTextToClipboard(textToCopy);

        // 设置复制成功状态
        setCopiedNodeId(nodeId || "all");

        // 显示成功动画
        const timer = setTimeout(() => {
          setCopiedNodeId(null);
        }, 2000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("复制到剪贴板失败:", error);
        setErrorMessage("复制到剪贴板失败");
      } finally {
        setIsCopying(false);
      }
    },
    [parseResult]
  );

  // 处理消息接收
  const onmessage = useCallback(() => {
    window.onmessage = (event: MessageEvent) => {
      try {
        if (!event.data.pluginMessage) return;

        const { type, data, error, message } = event.data.pluginMessage;
        console.log(type, data, "ui界面消息");

        switch (type) {
          case "autoParserResult":
            setParseResult(data);
            setTimeout(() => {
              setParseStatus("success");
            }, 500);
            setErrorMessage("");
            break;

          case "autoParserError":
            setParseStatus("error");
            setErrorMessage(error || "解析过程中发生错误");
            break;

          case "autoParserEmpty":
            setParseStatus("empty");
            setErrorMessage(message || "请选择一个节点");
            break;
          case "autoParserParsing":
            setParseStatus("parsing");
            setErrorMessage("");
            break;

          default:
            // 处理其他消息类型
            break;
        }
      } catch (error) {
        console.error("处理消息时出错:", error);
        setParseStatus("error");
        setErrorMessage("处理消息时出错");
      }
    };
  }, []);

  // 初始化
  useEffect(() => {
    onmessage();
    // 发送初始化消息
    parent.postMessage({ pluginMessage: { type: "init" } }, "*");

    // 设置初始状态为等待选择
    setParseStatus("empty");
    setErrorMessage("请在 Figma 中选择一个节点");
  }, [onmessage]);

  // 渲染图片预览列表
  const renderImageList = () => {
    if (!parseResult || Object.keys(parseResult).length === 0) return null;

    return (
      <div className="flex flex-wrap gap-4 mt-6">
        {Object.entries(parseResult).map(([nodeId, nodeData]) => (
          <div
            style={{ flexBasis: "45%" }}
            key={nodeId}
            className={`pop-animation h-[250px] flex flex-col relative rounded-lg border group transition-all duration-200 ease-in-out
            ${selectedNodeId === nodeId ? "ring-2 ring-blue-500 border-blue-500 scale-102" : "border-gray-200"} hover:shadow-lg
            hover:scale-102`}
            onClick={() => setSelectedNodeId(nodeId)}
          >
            <div className="overflow-hidden rounded-t-lg flex-grow">
              <img
                src={nodeData.props.src}
                alt={nodeData.props.alt || "图片预览"}
                className="object-contain w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-3 bg-white rounded-b-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium truncate">{nodeData.props.alt || `图片 ${nodeId.slice(0, 8)}`}</h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                  {nodeData.imageData?.format || "PNG"}
                </span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {nodeData.imageData?.width || 0} × {nodeData.imageData?.height || 0}
                </span>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleCopy(nodeId);
                  }}
                  disabled={isCopying}
                  className={` text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                  copiedNodeId === nodeId || copiedNodeId === "all"
                      ? "bg-green-100 text-green-700 transform scale-105"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105"
                  } disabled:opacity-50 disabled:cursor-not-allowed `}
                >
                  <span className="flex items-center space-x-1">
                    {copiedNodeId === nodeId || copiedNodeId === "all" ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        <span>复制</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染等待状态
  const renderWaitingState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 mb-4 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">等待选择节点</h3>
      <p className="text-sm text-gray-500 max-w-xs">{errorMessage || "请在 Figma 中选择一个或多个节点以解析图片"}</p>
    </div>
  );

  // 渲染加载动画
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-12 h-12 mb-4">
        <svg
          className="animate-spin w-full h-full text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700">正在解析图片</h3>
      <p className="text-sm text-gray-500 mt-2">请稍候，正在处理选中的节点...</p>
    </div>
  );

  // 渲染错误状态
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 mb-4 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-700 mb-2">解析出错</h3>
      <p className="text-sm text-gray-500 max-w-xs">{errorMessage || "解析图片时发生错误，请重试或选择其他节点"}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => parent.postMessage({ pluginMessage: { type: "init" } }, "*")}
      >
        重试
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Goblite
          </h1>
          <p className="text-gray-600">选择 Figma 节点，预览效果后一键复制</p>
        </header>

        {/* 状态指示器使用动画效果 */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2">
            <div
              className={` h-3 w-3 rounded-full transition-all duration-300 ${parseStatus === "parsing" && "animate-pulse"}
                ${getStatusColor(parseStatus)} `}
            ></div>
            <span className="text-sm font-medium text-gray-700 transition-all duration-300">
              {getStatusText(parseStatus)}
            </span>
          </div>
        </div>

        {/* 主内容区域 */}
        <main>
          {/* 根据状态显示不同内容 */}
          {parseStatus === "parsing" && renderLoadingState()}
          {parseStatus === "error" && renderErrorState()}
          {parseStatus === "empty" && renderWaitingState()}

          {/* 解析成功，显示图片列表 */}
          {parseStatus === "success" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  已解析 {parseResult ? Object.keys(parseResult).length : 0} 个图片
                </h2>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleCopy()}
                    disabled={isCopying || !parseResult}
                    className={`px-4 py-2 rounded-md ${
                    isCopying
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } transition-colors`}
                  >
                    {isCopying ? "复制中..." : "复制全部"}
                  </Button>
                </div>
              </div>

              {/* 图片列表 */}
              {renderImageList()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// 辅助函数
const getStatusColor = (status: ParseStatus) =>
  ({
    idle: "bg-gray-400",
    parsing: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
    empty: "bg-yellow-500"
  })[status];

const getStatusText = (status: ParseStatus) =>
  ({
    idle: "准备就绪",
    parsing: "正在解析",
    success: "解析成功",
    error: "解析失败",
    empty: "等待选择"
  })[status];

export default AutoParser;
