"use client";

import FeatureLandingPage from "@/components/landing/features";
import FooterLandingPage from "@/components/landing/footer";
import HeroLanding from "@/components/landing/hero";
import NavBarLanding from "@/components/landing/navbar";
import ReviewsLandingPage from "@/components/landing/reviews";
import { useEffect, useState } from "react";

const useScrollSpy = (ids: any) => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const handler = () => {
      for (const id of ids) {
        const el = document.getElementById(id);

        if (!el) continue;

        const { top, bottom } = el.getBoundingClientRect();

        if (top <= 80 && bottom > 80) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // run once on mount
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);

  return active;
};

const HomePage = () => {
  const activeSection = useScrollSpy(["hero", "features", "reviews", "footer"]);

  return (
    <>
      <NavBarLanding />
      <main className="flex-1">
        <HeroLanding />
        <FeatureLandingPage />
        <ReviewsLandingPage />
      </main>
      <FooterLandingPage />
    </>
  );
};

export default HomePage;
