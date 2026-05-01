const reviews = [
  {
    name: "Michael Chen",
    role: "Construction Manager",
    company: "BuildTech Industries",
    content:
      "Naga Steel Depot has been our go-to supplier for over 3 years. Their steel beams and rebar are consistently top quality, and delivery is always on time. Highly recommend for any large-scale construction project.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "Fabrication Director",
    company: "Precision Metalworks",
    content:
      "The team at Naga Steel understands our specific requirements. They've helped us source specialty alloys that other suppliers couldn't provide. Their technical knowledge is impressive.",
    rating: 5,
  },
  {
    name: "David Rodriguez",
    role: "Project Engineer",
    company: "Industrial Solutions Inc.",
    content:
      "Competitive pricing without compromising on quality. We've reduced our material costs by 15% since switching to Naga Steel, and our project timelines have improved thanks to their reliable delivery.",
    rating: 5,
  },
];

export const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-[#EAC04D]" : "text-[#30363d]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewsLandingPage = () => {
  return (
    <section
      id="reviews"
      className="py-24 bg-gray-50 dark:bg-[#0d1117] border-t border-gray-200 dark:border-[#30363d]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-[#8b949e] max-w-2xl mx-auto">
            Trusted by industry leaders across construction, fabrication, and
            manufacturing sectors.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#161b22] rounded-xl p-8 border border-gray-200 dark:border-[#30363d] hover:border-[#114669]/50 transition-all duration-300"
            >
              {/* Rating */}
              <StarRating rating={review.rating} />

              {/* Content */}
              <p className="text-gray-700 dark:text-[#e6edf3] mt-4 mb-6 leading-relaxed">
                "{review.content}"
              </p>

              {/* Divider */}
              <div className="w-12 h-px bg-gradient-to-r from-[#EAC04D] to-[#114669] mb-4" />

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EAC04D]/20 to-[#114669]/20 flex items-center justify-center">
                  <span className="text-[#EAC04D] font-semibold">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {review.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-[#8b949e]">
                    {review.role}
                  </div>
                  <div className="text-xs text-[#114669]">{review.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-[#161b22] dark:via-[#1c2128] dark:to-[#161b22] rounded-xl border border-gray-200 dark:border-[#30363d] p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-[#8b949e] mb-4">
              Industry Certifications & Partners
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                "ISO 9001",
                "ASTM Certified",
                "AISC Member",
                "SSAB Partner",
              ].map((cert) => (
                <div
                  key={cert}
                  className="px-6 py-3 bg-white dark:bg-[#0d1117] rounded-lg border border-gray-200 dark:border-[#30363d] text-gray-700 dark:text-[#8b949e] font-medium"
                >
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsLandingPage;
