const features = [
  {
    title: "Premium Quality Steel",
    description:
      "Our steel products meet the highest industry standards. Every batch is rigorously tested for durability, strength, and performance in demanding applications.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
  {
    title: "Competitive Pricing",
    description:
      "Get the best value for your investment. Our direct relationships with manufacturers allow us to offer competitive rates without compromising quality.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Expert Support",
    description:
      "Our team of steel specialists is here to guide you. From product selection to delivery, we ensure your project succeeds with personalized assistance.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

const FeatureLandingPage = () => {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose <span className="gradient-text">Naga Steel</span>?
          </h2>
          <p className="text-lg text-gray-600 dark:text-[#8b949e] max-w-2xl mx-auto">
            We combine quality products with unmatched service to deliver the
            best steel sourcing experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-[#161b22] rounded-xl p-8 border border-gray-200 dark:border-[#30363d] hover:border-[#EAC04D]/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon container */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#EAC04D]/20 to-[#114669]/20 flex items-center justify-center mb-6 group-hover:from-[#EAC04D]/30 group-hover:to-[#114669]/30 transition-all duration-300">
                <div className="text-[#EAC04D]">{feature.icon}</div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info Bar */}
        <div className="mt-16 bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-[#30363d] p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#EAC04D]">10,000+</div>
              <div className="text-sm text-gray-600 dark:text-[#8b949e] mt-1">
                Products Available
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#EAC04D]">24/7</div>
              <div className="text-sm text-gray-600 dark:text-[#8b949e] mt-1">
                Customer Support
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#EAC04D]">50+</div>
              <div className="text-sm text-gray-600 dark:text-[#8b949e] mt-1">
                Years Experience
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#EAC04D]">100%</div>
              <div className="text-sm text-gray-600 dark:text-[#8b949e] mt-1">
                Quality Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureLandingPage;
