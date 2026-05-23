import React from "react";

const Hero = () => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Move work forward with Atlassian
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          Empower your team with tools that help plan, track, and release world-class software.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
            Get started
          </button>
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
