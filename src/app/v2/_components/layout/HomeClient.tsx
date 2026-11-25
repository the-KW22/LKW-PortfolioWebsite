"use client";

import { useState } from "react";
import IntroAnimation from "@/app/v2/_components/layout/IntroAnimation";
import FaqAccordion from "@/app/v2/_components/sections/home/FaqAccordion";
import FeaturedProjects from "@/app/v2/_components/sections/home/FeaturedProjects";
import HeroSection from "@/app/v2/_components/sections/home/HeroSection";
import HomeCTA from "@/app/v2/_components/sections/home/HomeCTA";
import SkillUsed from "@/app/v2/_components/sections/home/SkillUsed";

export default function HomeClient() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && (
        <IntroAnimation onComplete={() => setIntroComplete(true)} />
      )}
      <HeroSection ready={introComplete} />
      <FeaturedProjects />
      <SkillUsed />
      <FaqAccordion />
      <HomeCTA />
    </>
  );
}
