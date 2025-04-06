"use client";

import React from "react";
import { motion } from "framer-motion";
import { Template } from "@/template/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ templates, onSelect }) => {
  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // 项目动画变体
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <div className="w-full h-full overflow-auto p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">选择模板开始创建</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">选择一个模板作为起点，然后使用AI助手进行自定义和调整，快速创建您的应用。</p>
        </div>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" variants={containerVariants} initial="hidden" animate="show">
          {templates.map((template) => (
            <motion.div key={template.id} variants={itemVariants} whileHover="hover" className="h-full">
              <Card className="h-full bg-slate-800 border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col">
                <div className="aspect-video bg-slate-700 relative overflow-hidden">
                  {/* 模板缩略图 - 这里使用一个占位图，实际项目中应该使用真实的缩略图 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <span className="text-6xl">{template.icon}</span>
                  </div>

                  {/* 类别标签 */}
                  <div className="absolute top-2 right-2 bg-slate-900/70 px-2 py-1 rounded text-xs text-cyan-400 font-medium">{template.id}</div>
                </div>

                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-white text-base">{template.name}</CardTitle>
                  <CardDescription className="text-slate-300 text-xs">{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow py-2 px-3">
                  <div className="text-xs text-slate-400">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.fields &&
                        template.fields.slice(0, 3).map((field) => (
                          <span key={field.id} className="px-1.5 py-0.5 bg-slate-700 rounded-full text-xs">
                            {field.name}
                          </span>
                        ))}
                      {template.fields && template.fields.length > 3 && <span className="px-1.5 py-0.5 bg-slate-700 rounded-full text-xs">+{template.fields.length - 3}</span>}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 pb-3 px-3">
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-sm py-1 h-auto"
                    onClick={() => onSelect(template)}
                  >
                    选择此模板
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TemplateGallery;
