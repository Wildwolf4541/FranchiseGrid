import React from "react";

import FirstSection from "../components/LandingPage/FirstSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import OurTeam from "../components/LandingPage/OurTeam";
import Navbar from "../components/LandingPage/Navbar";
import Footer from "../components/LandingPage/Footer";

function Landingpage() {
  return (
    <div className="App">
      {/* Navbar (Always Fixed, Solid Background) */}
      <header className="fixed top-0 z-50 w-full bg-gray-900 shadow-md">
        <div className="container mx-auto">
          <Navbar />
        </div>
      </header>

      {/* Page Content */}
      <main>
        <section id="home">
          <FirstSection />
        </section>

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="team">
          <OurTeam />
        </section>
      </main>

      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}

export default Landingpage;
