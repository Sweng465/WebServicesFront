import React from "react";
import image from "./image.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector9 from "./vector-9.svg";
import vector10 from "./vector-10.svg";
import vector11 from "./vector-11.svg";
import vector12 from "./vector-12.svg";
import vector13 from "./vector-13.svg";
import vector14 from "./vector-14.svg";
import vector15 from "./vector-15.svg";
import vector16 from "./vector-16.svg";
import vector17 from "./vector-17.svg";
import vector18 from "./vector-18.svg";
import vector19 from "./vector-19.svg";
import vector20 from "./vector-20.svg";
import vector21 from "./vector-21.svg";
import vector22 from "./vector-22.svg";
import vector23 from "./vector-23.svg";
import vector24 from "./vector-24.svg";
import vector25 from "./vector-25.svg";

export const CarListingSection = () => {
  const carListings = [
    {
      id: 1,
      title: "2018 Toyota Camry",
      price: "$18,500",
      mileage: "45,000 mi",
      distance: "2.3 miles away",
      description: "Well-maintained sedan with excellent fuel economy",
      seller: "Mike's Auto",
      sellerType: "Individual",
      position: { top: "1.5", left: "342px" },
      mileageIcon1: image,
      mileageIcon2: vector2,
      locationIcon1: vector3,
      locationIcon2: vector4,
      favoriteIcon: vector5,
      titleFontSize: "text-[15.2px]",
      priceFontSize: "text-[15.9px]",
      mileageFontSize: "text-[12.9px]",
      distanceFontSize: "text-[13.1px]",
      descriptionFontSize: "text-xs",
      descriptionHeight: "h-10",
      descriptionMarginTop: "mt-[0.5px]",
      descriptionWidth: "w-[308px]",
      descriptionLineHeight: "leading-5",
      sellerWidth: "w-[88px]",
      sellerMarginLeft: "ml-[11px]",
      sellerTextWidth: "w-[77px]",
      sellerTypeMarginLeft: "ml-[10.9px]",
      sellerTypeTextWidth: "w-[67px]",
      mileageTop: "top-[298px]",
      distanceTop: "top-[294px]",
      iconTop: "top-[calc(50.00%_+_90px)]",
      sellerTop: "top-[calc(50.00%_+_159px)]",
      sellerTypeTop: "top-[calc(50.00%_+_160px)]",
      height: "h-[398px]",
    },
    {
      id: 2,
      title: "2020 Ford F-150",
      price: "$32,000",
      mileage: "28,000 mi",
      distance: "1.8 miles away",
      description: "Powerful pickup truck with towing capacity",
      seller: "Sarah Johnson",
      sellerType: "Individual",
      position: { top: "1.5", left: "-left-px" },
      mileageIcon1: vector6,
      mileageIcon2: vector7,
      locationIcon1: vector8,
      locationIcon2: vector9,
      favoriteIcon: vector10,
      titleFontSize: "text-[14.9px]",
      priceFontSize: "text-[15.2px]",
      mileageFontSize: "text-[13px]",
      distanceFontSize: "text-[13.6px]",
      descriptionFontSize: "text-[12.8px]",
      descriptionHeight: "h-5",
      descriptionMarginTop: "mt-[3px]",
      descriptionWidth: "w-[261.17px]",
      descriptionLineHeight: "leading-5",
      sellerWidth: "w-[109px]",
      sellerMarginLeft: "ml-[11px]",
      sellerTextWidth: "w-[93px]",
      sellerTypeMarginLeft: "ml-[10.9px]",
      sellerTypeTextWidth: "w-[67px]",
      mileageTop: "top-[298px]",
      distanceTop: "top-[294px]",
      iconTop: "top-[calc(50.00%_+_100px)]",
      sellerTop: "top-[calc(50.00%_+_160px)]",
      sellerTypeTop: "top-[calc(50.00%_+_160px)]",
      height: "h-[398px]",
    },
    {
      id: 3,
      title: "2017 Chevrolet Malibu",
      price: "$14,200",
      mileage: "52,000 mi",
      distance: "3.7 miles away",
      description: "Reliable midsize sedan with modern features",
      seller: "City Auto Parts",
      sellerType: "Junkyard",
      position: { top: "1.5", left: "690px" },
      mileageIcon1: vector11,
      mileageIcon2: vector12,
      locationIcon1: vector13,
      locationIcon2: vector14,
      favoriteIcon: vector15,
      titleFontSize: "text-[15.4px]",
      priceFontSize: "text-[15.8px]",
      mileageFontSize: "text-[13px]",
      distanceFontSize: "text-[13.2px]",
      descriptionFontSize: "text-[13.1px]",
      descriptionHeight: "h-5",
      descriptionMarginTop: "mt-[3px]",
      descriptionWidth: "w-[277.23px]",
      descriptionLineHeight: "leading-5",
      sellerWidth: "w-[109px]",
      sellerMarginLeft: "ml-[11px]",
      sellerTextWidth: "w-[92px]",
      sellerTypeMarginLeft: "ml-[11.4px]",
      sellerTypeTextWidth: "w-16",
      mileageTop: "top-[298px]",
      distanceTop: "top-[294px]",
      iconTop: "top-[calc(50.00%_+_100px)]",
      sellerTop: "top-[calc(50.00%_+_160px)]",
      sellerTypeTop: "top-[calc(50.00%_+_160px)]",
      sellerBorder: "border-[#d9d9d9]",
      sellerTypeLeft: "left-[232px]",
      sellerTypeWidth: "w-[75px]",
      height: "h-[398px]",
    },
    {
      id: 4,
      title: "2019 BMW 3 Series",
      price: "$25,900",
      mileage: "35,000 mi",
      distance: "4.2 miles away",
      description: "Luxury sedan with premium interior",
      seller: "Premium Motors",
      sellerType: "Individual",
      position: { top: "1.5", left: "1043px" },
      mileageIcon1: vector16,
      mileageIcon2: vector17,
      locationIcon1: vector18,
      locationIcon2: vector19,
      favoriteIcon: vector20,
      titleFontSize: "text-[15.2px]",
      priceFontSize: "text-[15.3px]",
      mileageFontSize: "text-[13px]",
      distanceFontSize: "text-[13.1px]",
      descriptionFontSize: "text-[13px]",
      descriptionHeight: "h-5",
      descriptionMarginTop: "mt-[3px]",
      descriptionWidth: "w-[217.73px]",
      descriptionLineHeight: "leading-5",
      sellerWidth: "w-[117px]",
      sellerMarginLeft: "ml-[11px]",
      sellerTextWidth: "w-[101px]",
      sellerTypeMarginLeft: "ml-[10.9px]",
      sellerTypeTextWidth: "w-[62px]",
      mileageTop: "top-[298px]",
      distanceTop: "top-[294px]",
      iconTop: "top-[calc(50.00%_+_100px)]",
      sellerTop: "top-[calc(50.00%_+_160px)]",
      sellerTypeTop: "top-[calc(50.00%_+_160px)]",
      height: "h-[398px]",
    },
    {
      id: 5,
      title: "2019 Honda Civic",
      price: "$16,800",
      mileage: "32,000 mi",
      distance: "5.1 miles away",
      description: "Compact car in great condition, perfect for\ncommuting",
      seller: "Downtown Salvage",
      sellerType: "Junkyard",
      position: { top: "448px", left: "-left-px" },
      mileageIcon1: vector21,
      mileageIcon2: vector22,
      locationIcon1: vector23,
      locationIcon2: vector24,
      favoriteIcon: vector25,
      titleFontSize: "text-[15.4px]",
      priceFontSize: "text-[15.9px]",
      mileageFontSize: "text-[12.9px]",
      distanceFontSize: "text-[13.7px]",
      descriptionFontSize: "text-[12.9px]",
      descriptionHeight: "h-10",
      descriptionMarginTop: "mt-[3px]",
      descriptionWidth: "w-[260.75px]",
      descriptionLineHeight: "leading-5",
      sellerWidth: "w-[131px]",
      sellerMarginLeft: "ml-[11px]",
      sellerTextWidth: "w-[120px]",
      sellerTypeMarginLeft: "ml-[11.4px]",
      sellerTypeTextWidth: "w-16",
      mileageTop: "top-[298px]",
      distanceTop: "top-[294px]",
      iconTop: "top-[calc(50.00%_+_90px)]",
      sellerTop: "top-[calc(50.00%_+_170px)]",
      sellerTypeTop: "top-[calc(50.00%_+_170px)]",
      sellerBorder: "border-[#d9d9d9]",
      sellerTypeLeft: "left-[232px]",
      sellerTypeWidth: "w-[75px]",
      height: "h-[418px]",
    },
  ];

  const renderCarCard = (car) => {
    const cardWidth =
      car.id === 2 || car.id === 5
        ? "w-[calc(100%_-_1042px)]"
        : car.id === 1 || car.id === 3
          ? "w-[calc(100%_-_1037px)]"
          : "w-[calc(100%_-_1042px)]";
    const cardLeft =
      car.position.left === "-left-px" ? "-left-px" : car.position.left;
    const cardTop = car.position.top;

    return (
      <article
        key={car.id}
        className={`${cardWidth} top-${cardTop} left-[${cardLeft}] ${car.height} absolute bg-white rounded-xl overflow-hidden border border-solid border-[#dee0e3] shadow-[0px_1px_2px_#0000000d]`}
        role="article"
        aria-label={`Car listing for ${car.title}`}
      >
        <header className="absolute top-[258px] left-[17px] w-[145px] h-6 flex items-center justify-center">
          <h3 className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] ${car.titleFontSize} tracking-[0] leading-6 whitespace-nowrap">
            {car.title}
          </h3>
        </header>

        <div className="absolute top-[264px] left-[242px] w-[65px] h-[18px] flex items-center justify-center">
          <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#233c5c] ${car.priceFontSize} tracking-[0] leading-7 whitespace-nowrap">
            {car.price}
          </span>
        </div>

        <div
          className={`absolute ${car.iconTop} left-[17px] w-3 h-3`}
          aria-hidden="true"
        >
          <img
            className="absolute w-[16.67%] h-[16.67%] top-[41.67%] left-[50.00%]"
            alt=""
            src={car.mileageIcon1}
          />
          <img
            className="absolute w-[83.33%] h-[62.50%] top-[16.66%] left-[8.33%]"
            alt=""
            src={car.mileageIcon2}
          />
        </div>

        <div
          className={`absolute ${car.mileageTop} left-[33px] w-[62px] h-3.5 flex items-center justify-center`}
        >
          <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] ${car.mileageFontSize} tracking-[0] leading-5 whitespace-nowrap">
            {car.mileage}
          </span>
        </div>

        <div
          className={`absolute ${car.iconTop} left-[110px] w-3 h-3`}
          aria-hidden="true"
        >
          <img
            className="absolute w-[66.67%] h-[83.33%] top-[8.33%] left-[16.67%]"
            alt=""
            src={car.locationIcon1}
          />
          <img
            className="absolute w-[25.00%] h-[25.00%] top-[29.17%] left-[37.50%]"
            alt=""
            src={car.locationIcon2}
          />
        </div>

        <div
          className={`absolute ${car.distanceTop} left-[126px] w-[92px] h-5 flex items-center justify-center`}
        >
          <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] ${car.distanceFontSize} tracking-[0] leading-5 whitespace-nowrap">
            {car.distance}
          </span>
        </div>

        <div
          className={`absolute w-[calc(100%_-_34px)] top-[326px] left-[17px] ${car.descriptionHeight} flex`}
        >
          <p
            className={`flex items-center justify-center ${car.descriptionMarginTop} ${car.descriptionWidth} ${car.descriptionHeight === "h-10" ? "h-[34px]" : "h-3.5"} [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] ${car.descriptionFontSize} tracking-[0] ${car.descriptionLineHeight} ${car.descriptionHeight === "h-10" ? "" : "whitespace-nowrap"}`}
          >
            {car.description.includes("\n") ? (
              <>
                {car.description.split("\n")[0]}
                <br />
                {car.description.split("\n")[1]}
              </>
            ) : (
              car.description
            )}
          </p>
        </div>

        <div
          className={`${car.sellerTop} left-[17px] ${car.sellerWidth} absolute h-[22px] flex items-center ${car.sellerBorder ? `bg-white rounded-full border border-solid ${car.sellerBorder}` : "rounded-full border border-solid border-[#dee0e3]"}`}
        >
          <div
            className={`flex items-center justify-center ${car.sellerTop.includes("159") ? "mt-px" : car.sellerTop.includes("170") ? "" : "-mt-px"} h-3 ${car.sellerMarginLeft} ${car.sellerTextWidth} [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] text-xs tracking-[0] leading-4 whitespace-nowrap`}
          >
            {car.seller}
          </div>
        </div>

        <div
          className={`absolute ${car.sellerTypeTop} ${car.sellerTypeLeft || "left-[229px]"} ${car.sellerTypeWidth || "w-[78px]"} h-[22px] flex items-center rounded-full border border-solid border-[#dee0e3]`}
        >
          <div
            className={`flex items-center justify-center ${car.sellerTypeTop.includes("159") ? "mt-px" : car.sellerTypeTop.includes("170") ? "" : "-mt-px"} h-3 ${car.sellerTypeMarginLeft} ${car.sellerTypeTextWidth} [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] text-xs tracking-[0] leading-4 whitespace-nowrap`}
          >
            {car.sellerType}
          </div>
        </div>

        <div className="absolute w-[calc(100%_-_2px)] top-px left-px h-[242px] flex justify-end">
          <button
            className="mt-2 w-10 h-10 mr-2 flex items-center justify-center bg-[#ffffff33] rounded-[10px] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)] hover:bg-[#ffffff4d] transition-colors"
            aria-label={`Add ${car.title} to favorites`}
            type="button"
          >
            <div className="h-4 w-4 relative">
              <img
                className="absolute w-[83.33%] h-[75.00%] top-[12.50%] left-[8.33%]"
                alt=""
                src={car.favoriteIcon}
              />
            </div>
          </button>
        </div>
      </article>
    );
  };

  return (
    <section
      className="ml-[17px] w-[1366px] h-[865px] relative mt-2 overflow-hidden"
      role="region"
      aria-label="Car listings"
    >
      {carListings.map(renderCarCard)}
    </section>
  );
};
