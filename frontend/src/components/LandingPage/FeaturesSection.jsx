import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      icon: "🚀",
      title: "Rapid Deployment",
      description:
        "Launch your business quickly with our streamlined setup process and proven methodologies.",
      color: "from-cyan-400 to-blue-600",
    },
    {
      icon: "💼",
      title: "Battle-Tested Systems",
      description:
        "Leverage our industry-proven frameworks to build a resilient and scalable business.",
      color: "from-purple-500 to-indigo-700",
    },
    {
      icon: "📊",
      title: "Smart Data Insights",
      description:
        "Harness real-time analytics to make informed, data-driven decisions with confidence.",
      color: "from-pink-500 to-purple-600",
    },
    {
      icon: "🛠️",
      title: "Expert Training & Support",
      description:
        "Gain access to in-depth training, site selection guidance, and continuous operational support.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: "🔍",
      title: "Prime Location Analysis",
      description:
        "Optimize your business placement with strategic site analysis for maximum profitability.",
      color: "from-yellow-400 to-orange-600",
    },
    {
      icon: "📱",
      title: "Growth Tracking & Reports",
      description:
        "Monitor your progress with comprehensive reports and insights tailored to your success.",
      color: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <section className="bg-linear-to-br from-gray-900 to-gray-950 py-20 text-white">
      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold tracking-wide sm:text-5xl">
          Elevate Your <span className="text-teal-400">Success</span> with Us
        </h2>

        <div className="mx-auto my-4 h-1 w-24 rounded-full bg-linear-to-r from-blue-500 to-teal-400" />

        {/* Subtext */}
        <p className="mx-auto max-w-3xl px-4 text-lg text-gray-400 sm:px-0">
          Unlock new possibilities with our expert-driven strategies, cutting-edge
          insights, and unwavering support. From launching your venture to scaling
          it successfully, we empower your journey every step of the way.
        </p>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r ${feature.color} text-3xl text-white shadow-md`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400 sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
