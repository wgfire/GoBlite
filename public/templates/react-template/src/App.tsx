import React from "react";
import { Layout } from "./components/Layout";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { CTASection } from "./components/CTASection";
import "./index.css";

// AI-CUSTOMIZE-COMPONENT-START: App
// This component assembles all the sections of the landing page
export default function App() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
}
// AI-CUSTOMIZE-COMPONENT-END
