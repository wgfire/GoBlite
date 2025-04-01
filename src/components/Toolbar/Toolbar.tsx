import React from "react";
import { motion } from "framer-motion";
import { FiPlay, FiSettings, FiDownload, FiRefreshCw, FiCode, FiMonitor, FiEdit } from "react-icons/fi";
import ToolbarButton from "./ToolbarButton";
import "./Toolbar.css";

interface ToolbarProps {
  onRun?: () => void;
  onRebuild?: () => void;
  onToggleView?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  disabled?: boolean;
  isBuilt?: boolean;
  currentView?: "editor" | "webcontainer";
}

const Toolbar: React.FC<ToolbarProps> = ({
  onRun,
  onRebuild,
  onToggleView,
  onExport,
  onSettings,
  disabled = false,
  isBuilt = false,
  currentView = "editor",
}) => {
  // 确定当前是否在编辑器视图
  const isEditorView = currentView === "editor";

  return (
    <motion.div
      className="editor-toolbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="toolbar-logo">
        <span className="code-icon">&lt;/&gt;</span>
        <span className="logo-text">GoBlite</span>
      </div>

      <div className="toolbar-actions">
        <div className="toolbar-divider"></div>

        <div className="toolbar-section">
          {/* 切换视图按钮 - 根据当前视图显示不同图标 */}
          {isBuilt && (
            <ToolbarButton
              icon={isEditorView ? <FiMonitor /> : <FiEdit />}
              tooltip={isEditorView ? "查看预览" : "返回编辑器"}
              onClick={onToggleView}
              disabled={disabled}
              variant={isEditorView ? "default" : "primary"}
            />
          )}

          {/* 运行/构建按钮 - 未构建时显示 */}
          {!isBuilt && <ToolbarButton icon={<FiPlay />} tooltip="构建并运行" onClick={onRun} disabled={disabled} variant="success" />}

          {/* 重新构建按钮 - 已构建时显示 */}
          {isBuilt && <ToolbarButton icon={<FiRefreshCw />} tooltip="停止并重新构建" onClick={onRebuild} disabled={disabled} variant="warning" />}

          {/* 格式化代码按钮 - 在编辑器视图时显示 */}
          {isEditorView && <ToolbarButton icon={<FiCode />} tooltip="格式化代码" onClick={() => console.log("Format Code")} disabled={disabled} />}
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-section">
          <ToolbarButton icon={<FiDownload />} tooltip="导出" onClick={onExport} disabled={disabled} />
          <ToolbarButton icon={<FiSettings />} tooltip="设置" onClick={onSettings} disabled={disabled} />
        </div>
      </div>
    </motion.div>
  );
};

export default Toolbar;
