"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Template } from "@/template/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSearch, FiX } from "react-icons/fi";

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

/**
 * 简单的模糊搜索函数
 * @param text 要搜索的文本
 * @param query 搜索查询
 * @returns 是否匹配
 */
const fuzzySearch = (text: string, query: string): boolean => {
  if (!query) return true;

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);
  if (searchTerms.length === 0) return true;

  const haystack = text.toLowerCase();

  return searchTerms.every((term) => {
    // 允许字符之间有其他字符
    let lastIndex = -1;
    for (const char of term) {
      const index = haystack.indexOf(char, lastIndex + 1);
      if (index === -1) return false;
      lastIndex = index;
    }
    return true;
  });
};

/**
 * 高亮文本中的搜索关键词
 * @param text 原始文本
 * @param searchTerm 搜索关键词
 * @returns 带有高亮标记的JSX
 */
const highlightText = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm || !text) return text;

  // 将搜索词分解为单词
  const terms = searchTerm
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);
  if (terms.length === 0) return text;

  // 简单的高亮方法，将匹配的字符包裹在span中
  let result = text;
  let resultJSX: React.ReactNode[] = [result];

  // 对每个单词进行高亮
  terms.forEach((term) => {
    const newResultJSX: React.ReactNode[] = [];

    resultJSX.forEach((part) => {
      if (typeof part !== "string") {
        newResultJSX.push(part);
        return;
      }

      const partLower = part.toLowerCase();
      const index = partLower.indexOf(term);

      if (index === -1) {
        newResultJSX.push(part);
        return;
      }

      // 分割文本并高亮匹配部分
      newResultJSX.push(
        part.substring(0, index),
        <span key={`highlight-${index}`} className="search-highlight">
          {part.substring(index, index + term.length)}
        </span>,
        part.substring(index + term.length)
      );
    });

    resultJSX = newResultJSX;
  });

  return <>{resultJSX}</>;
};

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ templates, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * 计算模板与搜索词的相关度分数
   * @param template 模板
   * @param term 搜索词
   * @returns 分数，越高越相关
   */
  const calculateRelevanceScore = (template: Template, term: string): number => {
    if (!term) return 0;

    const lowerTerm = term.toLowerCase();
    let score = 0;

    // 名称匹配分数最高
    if (template.name.toLowerCase().includes(lowerTerm)) {
      score += 100;
      // 如果是名称开头，分数更高
      if (template.name.toLowerCase().startsWith(lowerTerm)) {
        score += 50;
      }
    }

    // ID匹配
    if (template.id.toLowerCase().includes(lowerTerm)) {
      score += 80;
    }

    // 描述匹配
    if (template.description?.toLowerCase().includes(lowerTerm)) {
      score += 60;
    }

    // 字段匹配
    if (template.fields) {
      for (const field of template.fields) {
        if (field.name.toLowerCase().includes(lowerTerm)) {
          score += 40;
          break; // 只计算一次字段匹配
        }
      }
    }

    return score;
  };

  // 当搜索词或模板列表变化时，更新过滤后的模板
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTemplates(templates);
      return;
    }

    // 先过滤出匹配的模板
    const filtered = templates.filter((template) => {
      const searchableText = [template.name, template.description || "", template.id, ...(template.fields?.map((field) => field.name) || [])].join(
        " "
      );

      return fuzzySearch(searchableText, searchTerm);
    });

    // 按相关度排序
    const sortedFiltered = [...filtered].sort((a, b) => {
      const scoreA = calculateRelevanceScore(a, searchTerm);
      const scoreB = calculateRelevanceScore(b, searchTerm);
      return scoreB - scoreA; // 降序排列，分数高的在前
    });

    setFilteredTemplates(sortedFiltered);
  }, [searchTerm, templates]);

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F 或 Command+F 聚焦到搜索框
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape 清除搜索
      else if (e.key === "Escape" && searchTerm) {
        setSearchTerm("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchTerm]);
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
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">选择模板开始创建</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">选择一个模板作为起点，然后使用AI助手进行自定义和调整，快速创建您的应用。</p>
        </div>

        {/* 搜索框 */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="搜索模板... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 w-full backdrop-blur-sm"
              onKeyDown={(e) => {
                // 按ESC键清除搜索
                if (e.key === "Escape" && searchTerm) {
                  e.preventDefault();
                  setSearchTerm("");
                }
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label="清除搜索"
                title="清除搜索 (ESC)"
              >
                <FiX />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="text-xs text-slate-400 mt-2 text-center animate-fadeIn">
              找到 <span className="text-cyan-400 font-medium">{filteredTemplates.length}</span> 个匹配模板
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {filteredTemplates.length > 0 ? (
            <motion.div
              key="results"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 10 }}
            >
              {filteredTemplates.map((template) => (
                <motion.div key={template.id} variants={itemVariants} whileHover="hover" className="h-full">
                  <Card className="h-full bg-slate-800 border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col">
                    <div className="aspect-video bg-slate-700 relative overflow-hidden">
                      {/* 模板缩略图 - 这里使用一个占位图，实际项目中应该使用真实的缩略图 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <span className="text-6xl">{template.icon}</span>
                      </div>

                      {/* 类别标签 */}
                      <div className="absolute top-2 right-2 bg-slate-900/70 px-2 py-1 rounded text-xs text-cyan-400 font-medium">
                        {searchTerm ? highlightText(template.id, searchTerm) : template.id}
                      </div>
                    </div>

                    <CardHeader className="pb-2 pt-3 px-3">
                      <CardTitle className="text-white text-base">{searchTerm ? highlightText(template.name, searchTerm) : template.name}</CardTitle>
                      <CardDescription className="text-slate-300 text-xs">
                        {searchTerm && template.description ? highlightText(template.description, searchTerm) : template.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow py-2 px-3">
                      <div className="text-xs text-slate-400">
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.fields &&
                            template.fields.slice(0, 3).map((field) => (
                              <span key={field.id} className="px-1.5 py-0.5 bg-slate-700 rounded-full text-xs">
                                {searchTerm ? highlightText(field.name, searchTerm) : field.name}
                              </span>
                            ))}
                          {template.fields && template.fields.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-slate-700 rounded-full text-xs">+{template.fields.length - 3}</span>
                          )}
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
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                <FiSearch className="text-slate-400 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">未找到匹配模板</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">没有找到与 "{searchTerm}" 匹配的模板。请尝试使用不同的关键词或浏览所有可用模板。</p>
              <Button onClick={() => setSearchTerm("")} className="bg-slate-800 hover:bg-slate-700 text-white">
                查看所有模板
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TemplateGallery;
