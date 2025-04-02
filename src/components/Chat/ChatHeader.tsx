"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegImages } from "react-icons/fa";
import { IoSparklesOutline } from "react-icons/io5";
import { LuLayoutTemplate } from "react-icons/lu";
import { AiFillPlusCircle } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Template } from "@/template/types";
import { TEMPLATES } from "@/template/templateInfo";
import { HeaderTab } from "./types";

// Sample assets for the Assets tab
const ASSETS = [
  { id: "hero1", name: "Hero Image 1", type: "image", thumbnail: "/placeholder.svg?height=60&width=80" },
  { id: "hero2", name: "Hero Image 2", type: "image", thumbnail: "/placeholder.svg?height=60&width=80" },
  { id: "icon1", name: "Icon Set 1", type: "icons", thumbnail: "/placeholder.svg?height=60&width=80" },
  { id: "bg1", name: "Background 1", type: "background", thumbnail: "/placeholder.svg?height=60&width=80" },
];

interface ChatHeaderProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplate: Template | null;
  isMobile: boolean;
  activeTab: HeaderTab;
  setActiveTab: (tab: HeaderTab) => void;
}

export const ChatHeader = ({ onTemplateSelect, selectedTemplate, isMobile, activeTab, setActiveTab }: ChatHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter templates based on search term
  const filteredTemplates = TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) || template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative z-10">
      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/0 via-cyan-500/50 to-purple-500/0"></div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <IoSparklesOutline className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">AI Design</h2>
          </div>

          {selectedTemplate && (
            <Button className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <Button variant="link" size="icon" spellCheck className="cursor-pointer text-cyan-500 hover:text-cyan-600">
                创建
              </Button>
              <span className="text-white text-sm font-medium">{selectedTemplate.name}</span>
            </Button>
          )}
        </div>

        {/* Primary action buttons */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "templates" ? "default" : "outline"}
            onClick={() => setActiveTab("templates")}
            className={cn(
              "flex items-center space-x-1 bg-slate-600 text-white",
              activeTab === "templates"
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500  hover:to-cyan-400 text-white border-none"
                : "text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
            )}
          >
            <LuLayoutTemplate size={16} />
            <span>页面模版</span>
          </Button>

          <Button
            variant={activeTab === "assets" ? "default" : "outline"}
            onClick={() => setActiveTab("assets")}
            className={cn(
              "flex items-center space-x-1 bg-slate-600 text-white",
              activeTab === "assets"
                ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white border-none"
                : "text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
            )}
          >
            <FaRegImages size={16} />
            <span>图片</span>
          </Button>
        </div>

        {/* Content area based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "templates" && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredTemplates.map((template) => (
                  <Button
                    key={template.id}
                    onClick={() => onTemplateSelect(template)}
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    <span className="text-lg">{template.icon}</span>
                    <span>{template.name}</span>
                  </Button>
                ))}

                {filteredTemplates.length === 0 && (
                  <div className="w-full text-center py-4 text-slate-400">No templates found matching "{searchTerm}"</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "assets" && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-4 gap-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {ASSETS.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-slate-800 rounded-md overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group"
                  >
                    <div className="relative">
                      <img src={asset.thumbnail || "/placeholder.svg"} alt={asset.name} className="w-full h-16 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
                        <span className="text-xs text-white font-medium">{asset.type}</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-slate-300 truncate">{asset.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
