import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";

const HomePage = () => {
  return (
    <div className="min-h-[200vh] bg-[#f8fafc]">
      <Navbar />
      
      <Hero/>
      
    </div>
  );
};

export default HomePage;