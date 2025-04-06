import { Template } from "./types";

export const TEMPLATES: Template[] = [
    {
      id: "react-template",
      name: "SEM Landing",
      description: "Perfect for online stores and product launches",
      icon: "🛍️",
      fields: [
        { id: "urlPath", name: "页面路径", type: "text", placeholder: "输入dl-开头的访问路径",required:false },
        { id: "domainName", name: "域名", type: "text", placeholder: "请输入域名" },
        { id: "license", name: "牌照选择", type: "select", options: [
          { value: "FSC", label: "FSC" },
          { value: "ASIC", label: "ASIC" },
          { value: "CIMA", label: "CIMA" }
        ]},
        { id: "watermark", name: "生图水印", type: "radio", options: [
          { value: "yes", label: "是" },
          { value: "no", label: "否" }
        ]},
        { id: "footerRisk", name: "底部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "headerRisk", name: "头部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "formPrompt", name: "表单提示词", type: "textarea", placeholder: "请输入表单内容说明" },
        { id: "additionalInfo", name: "附加信息", type: "textarea", placeholder: "请输入其他补充信息" },
      ],
    },
    {
      id: "vue-template",
      name: "Investing Landing",
      description: "For software and service platforms",
      icon: "💻",
      fields: [
        { id: "formPrompt", name: "表单提示词", type: "textarea", placeholder: "请输入表单内容说明" },
        { id: "license", name: "牌照选择", type: "select", options: [
          { value: "FSC", label: "FSC" },
          { value: "ASIC", label: "ASIC" },
          { value: "CIMA", label: "CIMA" }
        ]},
        { id: "watermark", name: "生图水印", type: "radio", options: [
          { value: "yes", label: "是" },
          { value: "no", label: "否" }
        ]},
        { id: "footerRisk", name: "底部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "headerRisk", name: "头部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "platformName", name: "Platform Name", type: "text", placeholder: "Enter platform name" },
        { id: "tagline", name: "Tagline", type: "text", placeholder: "Your catchy tagline" },
        { id: "features", name: "Key Features", type: "textarea", placeholder: "List key features" },
        { id: "disclaimer", name: "免责声明", type: "textarea", placeholder: "请输入免责声明内容" },
      ],
    },
    {
      id: "agency",
      name: "FB Landing",
      description: "Showcase your agency's work and services",
      icon: "🏢",
      fields: [
        { id: "formPrompt", name: "表单提示词", type: "textarea", placeholder: "请输入表单内容说明" },
        { id: "license", name: "牌照选择", type: "select", options: [
          { value: "FSC", label: "FSC" },
          { value: "ASIC", label: "ASIC" },
          { value: "CIMA", label: "CIMA" }
        ]},
        { id: "watermark", name: "生图水印", type: "radio", options: [
          { value: "yes", label: "是" },
          { value: "no", label: "否" }
        ]},
        { id: "footerRisk", name: "底部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "headerRisk", name: "头部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "agencyName", name: "Agency Name", type: "text", placeholder: "Enter agency name" },
        { id: "services", name: "Services", type: "textarea", placeholder: "List your services" },
        { id: "contactInfo", name: "联系方式", type: "text", placeholder: "请输入联系电话和邮箱" },
      ],
    },
    {
      id: "event",
      name: "Event Registration",
      description: "For conferences, webinars, and events",
      icon: "🎪",
      fields: [
        { id: "formPrompt", name: "表单提示词", type: "textarea", placeholder: "请输入表单内容说明" },
        { id: "license", name: "牌照选择", type: "select", options: [
          { value: "FSC", label: "FSC" },
          { value: "ASIC", label: "ASIC" },
          { value: "CIMA", label: "CIMA" }
        ]},
        { id: "watermark", name: "生图水印", type: "radio", options: [
          { value: "yes", label: "是" },
          { value: "no", label: "否" }
        ]},
        { id: "footerRisk", name: "底部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "headerRisk", name: "头部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
      ],
    },
    {
      id: "blog",
      name: "Blog Homepage",
      description: "For content creators and publishers",
      icon: "📝",
      fields: [
        { id: "formPrompt", name: "表单提示词", type: "textarea", placeholder: "请输入表单内容说明" },
        { id: "license", name: "牌照选择", type: "select", options: [
          { value: "FSC", label: "FSC" },
          { value: "ASIC", label: "ASIC" },
          { value: "CIMA", label: "CIMA" }
        ]},
        { id: "watermark", name: "生图水印", type: "radio", options: [
          { value: "yes", label: "是" },
          { value: "no", label: "否" }
        ]},
        { id: "footerRisk", name: "底部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "headerRisk", name: "头部风险提示", type: "radio", options: [
          { value: "yes", label: "显示" },
          { value: "no", label: "隐藏" }
        ]},
        { id: "blogName", name: "Blog Name", type: "text", placeholder: "Enter blog name" },
      ],
    },
    {
      id: "nonprofit",
      name: "Nonprofit",
      description: "For charities and cause-based organizations",
      icon: "🤲",
      fields: [
        { id: "organizationName", name: "Organization Name", type: "text", placeholder: "Enter organization name" },
        { id: "mission", name: "Mission Statement", type: "textarea", placeholder: "Your mission statement" },
      ],
    },
    {
      id: "restaurant",
      name: "Restaurant",
      description: "For eateries and food services",
      icon: "🍽️",
      fields: [
        { id: "restaurantName", name: "Restaurant Name", type: "text", placeholder: "Enter restaurant name" },
        { id: "cuisine", name: "Cuisine Type", type: "text", placeholder: "Type of cuisine" },
        { id: "specialDish", name: "Special Dish", type: "text", placeholder: "Your signature dish" },
      ],
    },
    {
      id: "portfolio",
      name: "Personal Portfolio",
      description: "For freelancers and professionals",
      icon: "👤",
      fields: [
        { id: "name", name: "Your Name", type: "text", placeholder: "Enter your name" },
        { id: "profession", name: "Profession", type: "text", placeholder: "Your profession" },
        { id: "bio", name: "Bio", type: "textarea", placeholder: "Write a short bio" },
      ],
    },
    {
      id: "realestate",
      name: "Real Estate",
      description: "For property listings and real estate agents",
      icon: "🏠",
      fields: [
        {
          id: "propertyType",
          name: "Property Type",
          type: "select",
          options: [
            { value: "residential", label: "Residential" },
            { value: "commercial", label: "Commercial" },
            { value: "industrial", label: "Industrial" },
          ],
        },
        { id: "location", name: "Location", type: "text", placeholder: "Property location" },
        { id: "features", name: "Key Features", type: "textarea", placeholder: "List property features" },
      ],
    },
    {
      id: "education",
      name: "Educational",
      description: "For courses, schools, and learning platforms",
      icon: "🎓",
      fields: [
        { id: "institutionName", name: "Institution Name", type: "text", placeholder: "Enter institution name" },
        { id: "courseType", name: "Course Type", type: "text", placeholder: "Type of course" },
        { id: "benefits", name: "Benefits", type: "textarea", placeholder: "List the benefits" },
      ],
    },
    {
      id: "health",
      name: "Healthcare",
      description: "For medical services and wellness",
      icon: "🏥",
      fields: [
        { id: "serviceName", name: "Service Name", type: "text", placeholder: "Enter service name" },
        { id: "benefits", name: "Health Benefits", type: "textarea", placeholder: "List health benefits" },
      ],
    },

  ]