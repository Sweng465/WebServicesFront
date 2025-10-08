import React from "react";
import { CarTitleSection } from "./CarTitleSection";
import { DescriptionSection } from "./DescriptionSection";
import { ImageGallerySection } from "./ImageGallerySection";
import { NavbarSection } from "./NavbarSection";
import { SellerDetailsSection } from "./SellerDetailsSection";
import imageSelection from "./image-selection.svg";
import image from "./image.svg";
import mainImage from "./main-image.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector19 from "./vector-19.svg";
import vector20 from "./vector-20.svg";

export const CarDescription = () => {
  return (
    <div className="w-full min-w-[1440px] min-h-[1081px] relative">
      <div className="absolute top-0 left-0 w-[1440px] h-[1413px] bg-white" />

      <div className="absolute top-[100px] left-0 w-[1440px] h-[1313px] rounded-sm overflow-hidden border border-solid border-[#ffffff1a] bg-[linear-gradient(284deg,rgba(208,111,30,1)_0%,rgba(41,122,210,1)_100%)]">
        <div className="absolute top-[31px] left-5 w-[1400px] h-[1253px] bg-[#ffffff40] rounded-[15px] backdrop-blur-[25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(25px)_brightness(100%)]" />

        <div className="absolute w-[calc(100%_-_40px)] top-[31px] left-5 h-[1251px]">
          <img
            className="absolute w-[calc(100%_-_732px)] top-[613px] left-4 h-16 object-cover"
            alt="Image selection"
            src={imageSelection}
          />

          <img
            className="absolute w-[calc(100%_-_732px)] top-[97px] left-0 h-[501px] object-cover"
            alt="Main image"
            src={mainImage}
          />

          <button className="all-[unset] box-border absolute w-[calc(100%_-_934px)] top-[279px] left-[700px] h-11 rounded-[10px] bg-[linear-gradient(173deg,rgba(35,60,92,1)_0%,rgba(52,106,178,1)_100%)]">
            <div className="absolute top-[calc(50.00%_-_8px)] left-[calc(50.00%_-_51px)] w-4 h-4">
              <img
                className="absolute w-[8.33%] h-[8.33%] top-[83.33%] left-[29.17%]"
                alt="Vector"
                src={image}
              />

              <img
                className="absolute w-[8.33%] h-[8.33%] top-[83.33%] left-[75.00%]"
                alt="Vector"
                src={vector2}
              />

              <img
                className="absolute w-[83.50%] h-[58.34%] top-[8.54%] left-[8.54%]"
                alt="Vector"
                src={vector3}
              />
            </div>

            <div className="absolute top-[calc(50.00%_-_7px)] left-[calc(50.00%_-_19px)] w-[71px] h-3.5 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-neutral-50 text-[12.8px] text-center tracking-[0] leading-5 whitespace-nowrap">
              Add to Cart
            </div>
          </button>

          <div className="absolute top-[279px] left-[1182px] w-[186px] h-11 bg-white rounded-[10px] border border-solid border-[#e9ebec]">
            <div className="absolute top-[calc(50.00%_-_8px)] left-[calc(50.00%_-_60px)] w-4 h-4">
              <img
                className="absolute w-[82.87%] h-[83.03%] top-[8.33%] left-[8.80%]"
                alt="Vector"
                src={vector4}
              />
            </div>

            <div className="absolute top-[calc(50.00%_-_7px)] left-[calc(50.00%_-_28px)] w-[88px] h-3.5 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#21262c] text-[13.1px] text-center tracking-[0] leading-5 whitespace-nowrap">
              Contact Seller
            </div>
          </div>

          <SellerDetailsSection />
          <DescriptionSection />
          <ImageGallerySection />
          <CarTitleSection />
          <div className="absolute top-[34px] left-3.5 w-[152px] h-[38px] flex bg-white rounded-[10px]">
            <div className="-mt-0.5 w-[143.92px] h-10 relative rounded-[10px]">
              <div className="absolute top-[calc(50.00%_-_8px)] left-[calc(50.00%_-_56px)] w-4 h-4">
                <img
                  className="absolute w-[29.17%] h-[58.33%] top-[20.83%] left-[20.83%]"
                  alt="Vector"
                  src={vector19}
                />

                <img
                  className="absolute w-[58.33%] h-0 top-[50.00%] left-[20.83%]"
                  alt="Vector"
                  src={vector20}
                />
              </div>

              <div className="absolute top-[calc(50.00%_-_7px)] left-[calc(50.00%_-_24px)] w-20 h-3.5 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#21262c] text-[13.2px] text-center tracking-[0] leading-5 whitespace-nowrap">
                Back to Cars
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavbarSection />
    </div>
  );
};
