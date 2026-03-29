"use client";

import Image from "next/image";

const HeroLanding = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#0d1117]">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage: `
        linear-gradient(rgba(17,70,105,0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(17,70,105,0.15) 1px, transparent 1px)
      `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#114669]/10 dark:bg-[#114669]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#EAC04D]/5 dark:bg-[#EAC04D]/8 blur-[80px] pointer-events-none" />

      {/* Decorative lines */}
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#114669]/20 dark:via-[#114669]/40 to-transparent" />
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#EAC04D]/10 dark:via-[#EAC04D]/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EAC04D]/30 bg-[#EAC04D]/5">
              <span className="w-2 h-2 rounded-full bg-[#EAC04D] animate-pulse" />
              <span className=" text-xs text-[#EAC04D] tracking-widest uppercase">
                Trusted Since 2000
              </span>
            </div>

            {/* Headline */}
            <h1 className=" text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="text-gray-900 dark:text-white">
                Build Stronger
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">with </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #EAC04D 0%, #f0d068 50%, #114669 100%)",
                }}
              >
                Premium Steel
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-600 dark:text-[#8b9ab0] text-lg leading-relaxed max-w-lg font-light">
              Naga Steel Depot is your trusted supplier for{" "}
              <span className="text-gray-800 dark:text-[#c8d8e8]">
                construction
              </span>
              ,{" "}
              <span className="text-gray-800 dark:text-[#c8d8e8]">
                fabrication
              </span>
              , and{" "}
              <span className="text-gray-800 dark:text-[#c8d8e8]">
                industrial steel
              </span>
              . Competitive pricing. Reliable delivery. Uncompromising quality.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("#products")}
                className="group relative px-6 py-3 rounded  text-sm font-semibold text-[#060c12] overflow-hidden cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #EAC04D, #d4a83a)",
                }}
              >
                <span className="relative z-10">Browse Products →</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>

              <button
                onClick={() => scrollTo("#contact")}
                className="px-6 py-3 rounded  text-sm text-gray-600 dark:text-[#8b9ab0] border border-gray-300 dark:border-[#1e2d3d] hover:border-[#114669] hover:text-gray-900 dark:hover:text-white transition-all duration-200 cursor-pointer"
              >
                Request a Quote
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-[#1e2d3d]">
              {[
                { value: "500+", label: "Products" },
                { value: "20yr", label: "Experience" },
                { value: "1,000+", label: "Clients Served" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className=" text-2xl font-bold text-[#EAC04D]">
                    {stat.value}
                  </div>
                  <div className=" text-xs text-gray-500 dark:text-[#4a5a6e] uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-[#114669]/10 dark:bg-[#114669]/20 blur-3xl rounded-2xl" />

            {/* Card */}
            <div className="relative rounded-xl border border-gray-200 dark:border-[#1e2d3d] bg-white dark:bg-[#0d1620] overflow-hidden shadow-xl dark:shadow-2xl">
              <Image
                src="/steel-pipez.jpg"
                width={1000}
                height={500}
                alt="steel-pipe"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLanding;
