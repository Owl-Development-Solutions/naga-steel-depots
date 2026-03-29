import FeatureLandingPage from "@/components/landing/features";
import FooterLandingPage from "@/components/landing/footer";
import HeroLanding from "@/components/landing/hero";
import NavBarLanding from "@/components/landing/navbar";
import ReviewsLandingPage from "@/components/landing/reviews";

const HomePage = () => {
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
