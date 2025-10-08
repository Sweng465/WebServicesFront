import React from "react";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector9 from "./vector-9.svg";
import vector10 from "./vector-10.svg";

export const SellerDetailsSection = () => {
  const sellerData = {
    name: "Mike's Auto",
    type: "Individual Seller",
    rating: 4.8,
    reviewCount: 23,
    phone: "(555) 123-4567",
    email: "mike@mikesauto.com",
  };

  return (
    <section className="absolute w-[calc(100%_-_732px)] top-[347px] left-[700px] h-[190px] bg-white rounded-xl border border-solid border-[#dee0e3] shadow-[0px_1px_2px_#0000000d]">
      <header className="absolute w-[calc(100%_-_50px)] top-[25px] left-[25px] h-6 flex items-center gap-2">
        <div className="h-5 w-5 relative" role="img" aria-label="Seller icon">
          <img
            className="absolute w-[58.33%] h-[25.00%] top-[62.50%] left-[20.83%]"
            alt=""
            src={vector5}
          />
          <img
            className="absolute w-[33.33%] h-[33.33%] top-[12.50%] left-[33.33%]"
            alt=""
            src={vector6}
          />
        </div>
        <h2 className="flex items-center justify-center h-6 w-[126.37px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] text-[23.1px] tracking-[-0.60px] leading-6 whitespace-nowrap">
          {sellerData.name}
        </h2>
      </header>

      <div className="absolute top-[calc(50.00%_-_21px)] left-[25px] w-[114px] h-[22px] flex items-center rounded-full border border-solid border-[#dee0e3]">
        <span className="flex items-center justify-center h-3 ml-[11px] w-[97px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] text-xs tracking-[0] leading-4 whitespace-nowrap">
          {sellerData.type}
        </span>
      </div>

      <div
        className="absolute top-[calc(50.00%_-_18px)] left-[510px] w-4 h-4"
        role="img"
        aria-label="Rating star"
      >
        <img
          className="absolute w-[83.34%] h-[79.47%] top-[8.33%] left-[8.33%]"
          alt=""
          src={vector7}
        />
      </div>

      <div className="absolute top-[73px] left-[530px] w-[22px] h-6 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#21262c] text-[15.1px] tracking-[0] leading-6 whitespace-nowrap">
        {sellerData.rating}
      </div>

      <div className="absolute top-[77px] left-[556px] w-[87px] h-4 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] text-[14.6px] tracking-[0] leading-6 whitespace-nowrap">
        ({sellerData.reviewCount} reviews)
      </div>

      <div
        className="absolute top-[calc(50.00%_+_18px)] left-[25px] w-4 h-4"
        role="img"
        aria-label="Phone icon"
      >
        <img
          className="absolute w-[82.87%] h-[83.03%] top-[8.33%] left-[8.80%]"
          alt=""
          src={vector8}
        />
      </div>

      <a
        href={`tel:${sellerData.phone}`}
        className="absolute top-[109px] left-[49px] w-[110px] h-6 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#21262c] text-[14.6px] tracking-[0] leading-6 whitespace-nowrap hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
      >
        {sellerData.phone}
      </a>

      <div
        className="absolute top-[calc(50.00%_+_50px)] left-[25px] w-4 h-4"
        role="img"
        aria-label="Email icon"
      >
        <img
          className="absolute w-[83.33%] h-[66.67%] top-[16.67%] left-[8.33%]"
          alt=""
          src={vector9}
        />
        <img
          className="absolute w-[83.33%] h-[24.98%] top-[29.17%] left-[8.33%]"
          alt=""
          src={vector10}
        />
      </div>

      <a
        href={`mailto:${sellerData.email}`}
        className="absolute top-[141px] left-[49px] w-[157px] h-6 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#21262c] text-[15.1px] tracking-[0] leading-6 whitespace-nowrap hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
      >
        {sellerData.email}
      </a>
    </section>
  );
};
