import UltraNavigation from "@/components/UltraNavigation";
import UltraHero from "@/components/UltraHero";
import UltraFeaturedBouquets from "@/components/UltraFeaturedBouquets";
import UltraCategories from "@/components/UltraCategories";
import Ultra3DBouquetBuilder from "@/components/Ultra3DBouquetBuilder";
import UltraOurStory from "@/components/UltraOurStory";
import Footer from "@/components/Footer";
import InteractiveBackground from "@/components/interactive/InteractiveBackground";
import FlowerOfTheMonth from "@/components/culture/FlowerOfTheMonth";
import FlowerPersonalityQuiz from "@/components/culture/FlowerPersonalityQuiz";
import CulturalTraditions from "@/components/culture/CulturalTraditions";
import VirtualBouquetBuilder from "@/components/interactive/VirtualBouquetBuilder";
import FlowerCareGuide from "@/components/culture/FlowerCareGuide";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Ultra Navigation */}
      <UltraNavigation />
      
      <InteractiveBackground />
      <div className="relative z-10">
        <UltraHero />
        <UltraFeaturedBouquets />
        <FlowerOfTheMonth />
        <UltraCategories />
        <CulturalTraditions />
        <VirtualBouquetBuilder />
        <FlowerPersonalityQuiz />
        <Ultra3DBouquetBuilder />
        <FlowerCareGuide />
        <UltraOurStory />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
