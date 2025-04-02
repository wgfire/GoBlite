import { Template } from "./types";

export const TEMPLATES: Template[] = [
    {
      id: "ecommerce",
      name: "SEM Landing",
      description: "Perfect for online stores and product launches",
      icon: "🛍️",
      fields: [
        { id: "productName", name: "Product Name", type: "text", placeholder: "Enter product name" },
        { id: "productDescription", name: "Product Description", type: "textarea", placeholder: "Describe your product" },
        { id: "primaryColor", name: "Primary Color", type: "color" },
        { id: "cta", name: "Call to Action", type: "text", placeholder: "Buy Now" },
      ],
    },
    {
      id: "saas",
      name: "Investing Landing",
      description: "For software and service platforms",
      icon: "💻",
      fields: [
        { id: "platformName", name: "Platform Name", type: "text", placeholder: "Enter platform name" },
        { id: "tagline", name: "Tagline", type: "text", placeholder: "Your catchy tagline" },
        { id: "features", name: "Key Features", type: "textarea", placeholder: "List key features" },
        { id: "accentColor", name: "Accent Color", type: "color" },
      ],
    },
    {
      id: "agency",
      name: "FB Landing",
      description: "Showcase your agency's work and services",
      icon: "🏢",
      fields: [
        { id: "agencyName", name: "Agency Name", type: "text", placeholder: "Enter agency name" },
        { id: "services", name: "Services", type: "textarea", placeholder: "List your services" },
        { id: "brandColor", name: "Brand Color", type: "color" },
      ],
    },
    {
      id: "event",
      name: "Event Registration",
      description: "For conferences, webinars, and events",
      icon: "🎪",
      fields: [
        { id: "eventName", name: "Event Name", type: "text", placeholder: "Enter event name" },
        { id: "eventDate", name: "Event Date", type: "text", placeholder: "Enter event date" },
        { id: "eventLocation", name: "Event Location", type: "text", placeholder: "Enter location" },
        { id: "eventDescription", name: "Event Description", type: "textarea", placeholder: "Describe your event" },
      ],
    },
    {
      id: "blog",
      name: "Blog Homepage",
      description: "For content creators and publishers",
      icon: "📝",
      fields: [
        { id: "blogName", name: "Blog Name", type: "text", placeholder: "Enter blog name" },
        { id: "categories", name: "Categories", type: "textarea", placeholder: "List your categories" },
        { id: "themeColor", name: "Theme Color", type: "color" },
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
        { id: "causeColor", name: "Cause Color", type: "color" },
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
        { id: "themeColor", name: "Theme Color", type: "color" },
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
        { id: "accentColor", name: "Accent Color", type: "color" },
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
        { id: "brandColor", name: "Brand Color", type: "color" },
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
        { id: "accentColor", name: "Brand Color", type: "color" },
      ],
    },

  ]