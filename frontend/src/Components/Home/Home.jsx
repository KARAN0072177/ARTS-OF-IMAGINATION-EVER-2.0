import React from "react";
import { Helmet } from "react-helmet-async"; // ✅ Correct import
import { Hero } from "../Hero";
import Slider from "../Slider";
import { Features } from "../Features";
import { Newletter } from "../Newletter";

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Discover stunning images and premium art at ARTS OF IMAGINATION EVER." />
        <meta property="og:title" content="Home | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Discover stunning images and premium art at ARTS OF IMAGINATION EVER." />
        <meta property="og:type" content="website" />
      </Helmet>

      <section>
        <Hero />
        <Slider />
        <Features />
        <Newletter />
      </section>
    </>
  );
};