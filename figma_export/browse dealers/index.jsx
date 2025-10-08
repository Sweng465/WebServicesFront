import React from "react";
import { ContentSection } from "./ContentSection";
import { DealerCardSection } from "./DealerCardSection";
import { DealerCardWrapperSection } from "./DealerCardWrapperSection";
import { DealerListingSection } from "./DealerListingSection";
import { MainContentSection } from "./MainContentSection";
import { NavigationBarSection } from "./NavigationBarSection";

export const BrowseDealers = () => {
  return (
    <div className="w-full min-w-[1440px] min-h-[1081px] relative">
      <div className="absolute top-0 left-0 w-[1440px] h-[1413px] bg-white" />

      <div className="absolute top-[100px] left-0 w-[1440px] h-[1313px] rounded-sm overflow-hidden border border-solid border-[#ffffff1a] bg-[linear-gradient(284deg,rgba(208,111,30,1)_0%,rgba(41,122,210,1)_100%)]">
        <div className="absolute top-[25px] left-5 w-[1400px] h-[1259px] bg-[#ffffff40] rounded-[15px] overflow-hidden backdrop-blur-[25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(25px)_brightness(100%)]">
          <DealerCardSection />
          <DealerCardWrapperSection />
          <MainContentSection />
          <ContentSection />
          <DealerListingSection />
          <DealerCardSection />
        </div>

        <div className="absolute top-[52px] left-[351px] w-[739px] h-[76px] bg-white rounded-[20px]" />

        <div className="absolute top-[59px] left-[351px] w-[738px] h-[61px] flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-black text-5xl text-center tracking-[0] leading-[normal]">
          Browse Our Trusted Dealers
        </div>
      </div>

      <NavigationBarSection />
    </div>
  );
};
