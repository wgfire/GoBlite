import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// AI-PRESERVE-COMPONENT-START: Layout
// This component provides the basic layout structure and should not be modified by AI
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
// AI-PRESERVE-COMPONENT-END
