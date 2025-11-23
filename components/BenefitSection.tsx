'use client';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: '🌱',
      title: 'Eco-Friendly',
      description: 'Sustainable materials & ethical production'
    },
    {
      icon: '✨',
      title: 'Premium Quality',
      description: 'Hand-picked fabrics & expert craftsmanship'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: '💯',
      title: 'Satisfaction',
      description: '30-day returns & lifetime support'
    }
  ];

  return (
    //  CUSTOM BACKGROUND COLOR
    <section className="w-full py-16" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{benefit.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 font-light">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

