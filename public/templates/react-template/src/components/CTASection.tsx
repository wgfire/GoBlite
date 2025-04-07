import React from 'react';

// AI-CUSTOMIZE-COMPONENT-START: CTASection
// This component can be customized by AI based on user requirements
export const CTASection: React.FC = () => {
  return (
    <section id="contact" className="section bg-primary-700">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-xl text-primary-100">
            Join thousands of satisfied customers who are already using our product to transform their business.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="btn bg-white text-primary-700 hover:bg-primary-50"
              >
                Get Started
              </a>
            </div>
            <div className="ml-3 inline-flex">
              <a
                href="#"
                className="btn bg-primary-600 text-white hover:bg-primary-800 border border-transparent"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// AI-CUSTOMIZE-COMPONENT-END
