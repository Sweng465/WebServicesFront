import React from "react";

export const DescriptionSection = () => {
  const descriptionData = {
    title: "Description",
    content:
      "This well-maintained 2018 Toyota Camry is in excellent condition with only 45,000 miles. Regular maintenance has been performed, including recent oil changes and brake service. The vehicle runs smoothly and has been garage-kept. Perfect for daily commuting with excellent fuel economy. Interior is clean with minimal wear. All electronics work properly including AC, radio, and power windows. Non-smoker vehicle with clean title.",
  };

  return (
    <section className="absolute w-[calc(100%_-_32px)] top-[709px] left-4 h-44 flex flex-col gap-[29px] bg-white rounded-xl border border-solid border-[#dee0e3] shadow-[0px_1px_2px_#0000000d]">
      <header className="ml-[25px] w-[125.7px] mt-[25px] text-[23.1px] tracking-[-0.60px] flex items-center justify-center h-6 [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] leading-6 whitespace-nowrap">
        {descriptionData.title}
      </header>

      <p className="flex items-center justify-center ml-[25px] w-[1299.36px] h-[68px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] text-[14.9px] tracking-[0] leading-[26px]">
        This well-maintained 2018 Toyota Camry is in excellent condition with
        only 45,000 miles. Regular maintenance has been performed, including
        recent oil changes and brake service. The
        <br />
        vehicle runs smoothly and has been garage-kept. Perfect for daily
        commuting with excellent fuel economy. Interior is clean with minimal
        wear. All electronics work properly including AC,
        <br />
        radio, and power windows. Non-smoker vehicle with clean title.
      </p>
    </section>
  );
};
