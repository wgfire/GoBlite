"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoClose, IoCheckmark, IoEye } from "react-icons/io5";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Template } from "@/template/types";
import { FormField } from "./FormFieldRegistry";

interface TemplateFormProps {
  template: Template;
  onSubmit: (data: Record<string, string>) => void;
  onClose: () => void;
}

export const TemplateForm = ({ template, onSubmit, onClose }: TemplateFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // 初始化表单数据，设置默认值
  useEffect(() => {
    const initialData: Record<string, string> = {};
    template.fields.forEach((field) => {
      if (field.options && field.options.length > 0) {
        initialData[field.id] = field.options[0].value;
      } else {
        initialData[field.id] = "";
      }
    });
    setFormData(initialData);
  }, [template]);

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));

    // 清除该字段的错误（如果存在）
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = (fieldsToValidate = template.fields) => {
    const errors: Record<string, boolean> = { ...formErrors };
    let isValid = true;

    // 简单验证 - 检查必填字段是否有值
    // 默认所有字段都是必填的，除非 field.required 明确设置为 false
    fieldsToValidate.forEach((field) => {
      if (field.required !== false && (!formData[field.id] || formData[field.id].trim() === "")) {
        errors[field.id] = true;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // 切换到下一步
  const handleNextStep = () => {
    //暂时移除验证当前步骤的表单
    // if (!validateCurrentStep()) {
    //   return; // 如果验证失败，不允许进入下一步
    // }

    if (currentStep < Math.ceil(template.fields.length / 3) - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 在进入预览前验证所有表单
      if (validateForm()) {
        setShowPreview(true);
      }
    }
  };

  // 切换到上一步
  const handlePrevStep = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 获取当前步骤的字段
  const getCurrentFields = () => {
    const fieldsPerStep = 3;
    const start = currentStep * fieldsPerStep;
    const end = start + fieldsPerStep;
    return template.fields.slice(start, end);
  };

  return (
    <motion.div
      className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden relative"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: 101 }} // Ensure the form has the highest z-index
    >
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 p-5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{template.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{template.name}</h3>
            <p className="text-slate-300 text-sm">{template.description}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
          <IoClose size={18} />
        </Button>
      </div>

      {/* 步骤指示器 */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-300">{showPreview ? "预览" : `步骤 ${currentStep + 1}/${Math.ceil(template.fields.length / 3)}`}</h4>
          <div className="flex space-x-1">
            {Array.from({ length: Math.ceil(template.fields.length / 3) }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  index === currentStep && !showPreview ? "bg-cyan-500" : index < currentStep ? "bg-cyan-700" : "bg-slate-700"
                }`}
              />
            ))}
            <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${showPreview ? "bg-cyan-500" : "bg-slate-700"}`} />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showPreview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-medium text-white mb-3">表单预览</h3>
              <div className="space-y-3">
                {template.fields.map((field) => (
                  <div key={field.id} className="flex justify-between">
                    <span className="text-slate-300">{field.name}:</span>
                    <span className="text-white font-medium">
                      {field.type === "select" && field.options ? field.options.find((opt) => opt.value === formData[field.id])?.label || formData[field.id] : formData[field.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            {getCurrentFields().map((field) => (
              <motion.div key={field.id} className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <FormField field={field} value={formData[field.id] || ""} onChange={handleChange} error={formErrors[field.id]} />
              </motion.div>
            ))}
          </motion.form>
        )}
      </AnimatePresence>

      <div className="p-5 border-t border-slate-700 bg-slate-800/50 flex justify-between">
        {currentStep > 0 || showPreview ? (
          <Button type="button" onClick={handlePrevStep} variant="outline" className="px-4 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent">
            <FiArrowLeft size={16} className="mr-2" />
            {showPreview ? "返回编辑" : "上一步"}
          </Button>
        ) : (
          <Button type="button" onClick={onClose} variant="outline" className="px-4 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent">
            <IoClose size={16} className="mr-2" />
            取消
          </Button>
        )}

        {showPreview ? (
          <Button type="button" onClick={handleSubmit} className="px-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium">
            <IoCheckmark size={16} className="mr-2" />
            生成模板
          </Button>
        ) : (
          <Button type="button" onClick={handleNextStep} className="px-4 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-medium">
            {currentStep < Math.ceil(template.fields.length / 3) - 1 ? (
              <>
                下一步
                <FiArrowRight size={16} className="ml-2" />
              </>
            ) : (
              <>
                预览
                <IoEye size={16} className="ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
