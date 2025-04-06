import React from "react";
import { motion } from "framer-motion";
import { FiPlay, FiSettings, FiDownload, FiRefreshCw, FiCode, FiMonitor, FiEdit } from "react-icons/fi";
import { LuLayoutTemplate } from "react-icons/lu";
import ToolbarButton from "./ToolbarButton";
import { ThemeSwitcher } from "@components/Editor";
import "./Toolbar.css";

interface ToolbarProps {
  onRun?: () => void;
  onRebuild?: () => void;
  onToggleView?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  onOpenTemplates?: () => void;
  disabled?: boolean;
  isBuilt?: boolean;
  currentView?: "editor" | "webcontainer" | "templateGallery";
}

const Toolbar: React.FC<ToolbarProps> = ({ onRun, onRebuild, onToggleView, onExport, onSettings, onOpenTemplates, disabled = false, isBuilt = false, currentView = "editor" }) => {
  // 确定当前是否在编辑器视图
  const isEditorView = currentView === "editor";

  return (
    <motion.div className="editor-toolbar" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <div className="toolbar-logo">
        <span className="code-icon">&lt;/&gt;</span>
        <span className="logo-text">GoBlite</span>
      </div>

      <div className="toolbar-actions">
        <div className="toolbar-divider"></div>

        <div className="toolbar-section">
          {/* 模板按钮 - 始终显示 */}
          <ToolbarButton
            icon={<LuLayoutTemplate />}
            tooltip="选择模板"
            onClick={onOpenTemplates}
            disabled={disabled}
            variant={currentView === "templateGallery" ? "primary" : "default"}
            active={currentView === "templateGallery"}
          />

          {/* 切换视图按钮 - 只在编辑器和预览视图之间切换时显示 */}
          {isBuilt && currentView !== "templateGallery" && (
            <ToolbarButton
              icon={isEditorView ? <FiMonitor /> : <FiEdit />}
              tooltip={isEditorView ? "查看预览" : "返回编辑器"}
              onClick={onToggleView}
              disabled={disabled}
              variant={isEditorView ? "default" : "primary"}
            />
          )}

          {/* 运行/构建按钮 - 只在编辑器视图且未构建时显示 */}
          {!isBuilt && currentView === "editor" && <ToolbarButton icon={<FiPlay />} tooltip="构建并运行" onClick={onRun} disabled={disabled} variant="success" />}

          {/* 重新构建按钮 - 只在预览视图且已构建时显示 */}
          {isBuilt && currentView === "webcontainer" && <ToolbarButton icon={<FiRefreshCw />} tooltip="停止并重新构建" onClick={onRebuild} disabled={disabled} variant="warning" />}

          {/* 格式化代码按钮 - 只在编辑器视图时显示 */}
          {currentView === "editor" && <ToolbarButton icon={<FiCode />} tooltip="格式化代码" onClick={() => console.log("Format Code")} disabled={disabled} />}
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-section">
          {/* 导出按钮 - 只在编辑器和预览视图时显示 */}
          {currentView !== "templateGallery" && <ToolbarButton icon={<FiDownload />} tooltip="导出" onClick={onExport} disabled={disabled} />}
          {/* 设置按钮 - 始终显示 */}
          <ToolbarButton icon={<FiSettings />} tooltip="设置" onClick={onSettings} disabled={disabled} />
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-section flex items-center">
          <ThemeSwitcher />
        </div>
      </div>
    </motion.div>
  );
};

export default Toolbar;
