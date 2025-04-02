"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { IoClose,IoCheckmark } from "react-icons/io5";
import { motion } from "framer-motion"
import { Template } from "@/template/types"

interface TemplateFormProps {
  template: Template
  onSubmit: (data: Record<string, string>) => void
  onClose: () => void
}

export const TemplateForm = ({ template, onSubmit, onClose }: TemplateFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Clear error for this field if it exists
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, boolean> = {}
    let isValid = true

    // Simple validation - check if required fields have values
    template.fields.forEach((field) => {
      if (!formData[field.id] || formData[field.id].trim() === "") {
        errors[field.id] = true
        isValid = false
      }
    })

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

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
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
        >
          <IoClose size={18} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {template.fields.map((field) => (
          <motion.div
            key={field.id}
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: template.fields.indexOf(field) * 0.05 }}
          >
            <label htmlFor={field.id} className="text-sm font-medium text-slate-300 flex items-center">
              {field.name}
              {formErrors[field.id] && <span className="ml-2 text-xs text-red-400">Required</span>}
            </label>

            {field.type === "text" && (
              <input
                id={field.id}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={`bg-slate-900/50 border-slate-700 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 ${
                  formErrors[field.id] ? "border-red-400" : ""
                }`}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                id={field.id}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={`bg-slate-900/50 border-slate-700 text-white min-h-[80px] focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 ${
                  formErrors[field.id] ? "border-red-400" : ""
                }`}
              />
            )}

            {field.type === "select" && field.options && (
              <Select onValueChange={(value) => handleChange(field.id, value)} value={formData[field.id] || ""}>
                <SelectTrigger
                  className={`bg-slate-900/50 border-slate-700 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 ${
                    formErrors[field.id] ? "border-red-400" : ""
                  }`}
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="focus:bg-slate-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

        
          </motion.div>
        ))}
      </form>

      <div className="p-5 border-t border-slate-700 bg-slate-800/50">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium"
        >
          <IoCheckmark size={16} className="mr-2" />
          Generate Template
        </Button>
      </div>
    </motion.div>
  )
}

