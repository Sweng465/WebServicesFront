import React from "react";
import vector11 from "./vector-11.svg";
import vector12 from "./vector-12.svg";
import vector13 from "./vector-13.svg";
import vector14 from "./vector-14.svg";
import vector15 from "./vector-15.svg";
import vector16 from "./vector-16.svg";
import vector17 from "./vector-17.svg";
import vector18 from "./vector-18.svg";

export const VehicleTitleSection = () => {
  const vehicleData = {
    title: "2018 Toyota Camry",
    year: "2018",
    mileage: "45,000 miles",
    distance: "2.3 miles away",
    price: "$18,500",
  };

  return (
    <section
      className="absolute top-[107px] left-[700px] w-[668px] h-[159px] bg-white rounded-[10px]"
      role="region"
      aria-label="Vehicle listing details"
    >
      <header className="absolute top-[22px] left-[11px] w-[272px] h-9 flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] text-[28.5px] tracking-[0] leading-9 whitespace-nowrap">
        <h1>{vehicleData.title}</h1>
      </header>

      <div className="absolute top-[70px] left-[229px] w-[105px] h-6 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] text-[15px] tracking-[0] leading-6 whitespace-nowrap">
        {vehicleData.distance}
      </div>

      <div
        className="absolute top-[calc(50.00%_-_6px)] left-[11px] w-4 h-4"
        aria-label="Calendar icon"
      >
        <img
          className="absolute w-0 h-[16.67%] top-[8.33%] left-[33.33%]"
          alt=""
          src={vector11}
          role="presentation"
        />
        <img
          className="absolute w-0 h-[16.67%] top-[8.33%] left-[66.67%]"
          alt=""
          src={vector12}
          role="presentation"
        />
        <img
          className="absolute w-[75.00%] h-[75.00%] top-[16.67%] left-[12.50%]"
          alt=""
          src={vector13}
          role="presentation"
        />
        <img
          className="absolute w-[75.00%] h-0 top-[41.67%] left-[12.50%]"
          alt=""
          src={vector14}
          role="presentation"
        />
      </div>

      <div className="absolute top-[70px] left-[31px] w-9 h-6 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] text-[15.4px] tracking-[0] leading-6 whitespace-nowrap">
        <span aria-label="Year">{vehicleData.year}</span>
      </div>

      <div
        className="absolute top-[calc(50.00%_-_6px)] left-[83px] w-4 h-4"
        aria-label="Odometer icon"
      >
        <img
          className="absolute w-[16.67%] h-[16.67%] top-[41.67%] left-[50.00%]"
          alt=""
          src={vector15}
          role="presentation"
        />
        <img
          className="absolute w-[83.33%] h-[62.50%] top-[16.66%] left-[8.33%]"
          alt=""
          src={vector16}
          role="presentation"
        />
      </div>

      <div className="absolute top-[74px] left-[103px] w-[91px] h-4 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] text-[14.9px] tracking-[0] leading-6 whitespace-nowrap">
        <span aria-label="Mileage">{vehicleData.mileage}</span>
      </div>

      <div
        className="absolute top-[calc(50.00%_-_6px)] left-[209px] w-4 h-4"
        aria-label="Location icon"
      >
        <img
          className="absolute w-[66.67%] h-[83.33%] top-[8.33%] left-[16.67%]"
          alt=""
          src={vector17}
          role="presentation"
        />
        <img
          className="absolute w-[25.00%] h-[25.00%] top-[29.17%] left-[37.50%]"
          alt=""
          src={vector18}
          role="presentation"
        />
      </div>

      <div className="top-28 left-[11px] w-[130px] h-9 text-[31.6px] leading-10 absolute flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-[#233c5c] tracking-[0] whitespace-nowrap">
        <span aria-label="Price">{vehicleData.price}</span>
      </div>
    </section>
  );
};
