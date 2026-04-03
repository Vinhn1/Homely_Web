import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import PopularLocations from "@/components/home/PopularLocations";
import SpaceCategories from "@/components/home/SpaceCategories";
import FeaturedListings from "@/components/home/FeaturedListings";
import WhyChooseUs from "@/components/home/LandlordCTA";

const HomePage = () => {
  return (
    <div className="min-h-[200vh] bg-[#f8fafc]">
      <Navbar />
      
      <Hero/>

      <PopularLocations/>

      <SpaceCategories/>

      <FeaturedListings/>

      <WhyChooseUs/>
      
    </div>
  );
};

export default HomePage;