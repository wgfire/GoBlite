import React from 'react';

// AI-CUSTOMIZE-COMPONENT-START: TestimonialsSection
// This component can be customized by AI based on user requirements
export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      content: 'This product has completely transformed how we operate. The efficiency gains have been remarkable, and our team loves using it every day.',
      author: 'Jane Smith',
      role: 'CEO at TechCorp',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    },
    {
      id: 2,
      content: 'I was skeptical at first, but after using this for just a week, I was convinced. The interface is intuitive and the support team is incredibly responsive.',
      author: 'Michael Johnson',
      role: 'Marketing Director',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      content: `Weve seen a 40% increase in productivity since implementing this solution. It's been a game-changer for our business.`,
      author: 'Sarah Williams',
      role: 'Operations Manager',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  ];

  return (
    <section id="testimonials" className="section bg-secondary-50">
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Don't just take our word for it. Here's what our satisfied customers have to say about our product.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-primary-400" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="ml-4 text-base text-secondary-500">{testimonial.content}</p>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={testimonial.avatar} alt={testimonial.author} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">{testimonial.author}</p>
                  <p className="text-sm text-secondary-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// AI-CUSTOMIZE-COMPONENT-END
