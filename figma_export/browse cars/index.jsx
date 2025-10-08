import React from "react";
import { CarListingSection } from "./CarListingSection";
import { NavigationSection } from "./NavigationSection";
import { PaginationControlsSection } from "./PaginationControlsSection";
import { SearchBarSection } from "./SearchBarSection";

export const BrowseCars = () => {
  return (
    <div className="w-full min-w-[1440px] min-h-[1081px] relative">
      <div className="absolute top-0 left-0 w-[1440px] h-[1413px] bg-white" />

      <div className="absolute top-[100px] left-0 w-[1440px] h-[1313px] flex rounded-sm overflow-hidden border border-solid border-[#ffffff1a] bg-[linear-gradient(284deg,rgba(208,111,30,1)_0%,rgba(41,122,210,1)_100%)]">
        <div className="mt-[31px] w-[1400px] h-[1253px] ml-5 flex flex-col bg-[#ffffff40] rounded-[15px] overflow-hidden backdrop-blur-[25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(25px)_brightness(100%)]">
          <div className="flex-1 max-h-[1203px] flex flex-col">
            <SearchBarSection />
            <div className="ml-4 w-[189px] h-11 mt-[22px] flex bg-[#07246e] rounded-[10px]">
              <p className="flex items-center justify-center mt-3.5 w-[140.68px] h-4 ml-6 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[15px] tracking-[0] leading-6 whitespace-nowrap">
                Showing 5 of 5 cars
              </p>
            </div>

            <CarListingSection />
          </div>

          <PaginationControlsSection />
        </div>
      </div>

      <NavigationSection />
    </div>
  );
};
