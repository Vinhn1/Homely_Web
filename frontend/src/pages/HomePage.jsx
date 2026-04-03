import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import PopularLocations from "@/components/home/PopularLocations";

const HomePage = () => {
  return (
    <div className="min-h-[200vh] bg-[#f8fafc]">
      <Navbar />
      
      <Hero/>

      <PopularLocations/>
      
    </div>
  );
};

export default HomePage;