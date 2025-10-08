import React from "react";
import profilePicture5 from "./profile-picture-5.png";
import star15 from "./star-1-5.svg";
import star26 from "./star-2-6.svg";
import star36 from "./star-3-6.svg";
import star46 from "./star-4-6.svg";
import star56 from "./star-5-6.svg";

export const MainContentSection = () => {
  const starImages = [star15, star26, star36, star46, star56];

  return (
    <article className="top-[663px] left-[519px] absolute w-[359px] h-[423px]">
      <div className="absolute top-0 left-0 w-[357px] h-[423px] bg-white rounded-[15px]" />

      <header className="absolute top-[229px] left-[34px] w-[292px] h-[34px] flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[32px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
        John&apos;s Junk Yard
      </header>

      <section className="absolute top-[272px] left-[79px] w-[204px] h-[106px] flex flex-col gap-2.5">
        <h3 className="ml-[63px] w-[73px] h-6 [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
          Rating
        </h3>

        <div
          className="w-[200px] flex"
          role="img"
          aria-label="5 out of 5 stars rating"
        >
          {starImages.map((starSrc, index) => (
            <img
              key={index}
              className="w-10 h-10"
              alt={`Star ${index + 1}`}
              src={starSrc}
            />
          ))}
        </div>

        <button className="ml-[27px] w-[153px] h-[22px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap bg-transparent border-none cursor-pointer hover:underline focus:outline-none focus:underline">
          View Ratings
        </button>
      </section>

      <img
        className="absolute top-4 left-[91px] w-[175px] h-[175px] rounded-full object-cover"
        alt="Profile picture of John's Junk Yard"
        src={profilePicture5}
      />

      <hr
        className="absolute top-[212px] left-0 w-[357px] h-px border-0 bg-gray-300"
        aria-hidden="true"
      />
    </article>
  );
};
