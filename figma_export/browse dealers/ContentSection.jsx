import React from "react";
import line1 from "./line-1.svg";
import profilePicture from "./profile-picture.png";
import star1 from "./star-1.svg";
import star2 from "./star-2.svg";
import star3 from "./star-3.svg";
import star4 from "./star-4.svg";
import star5 from "./star-5.svg";

export const ContentSection = () => {
  const starImages = [star1, star2, star3, star4, star5];

  return (
    <article className="top-[663px] left-[52px] absolute w-[359px] h-[423px]">
      <div className="absolute top-0 left-0 w-[357px] h-[423px] bg-white rounded-[15px]" />

      <header className="absolute top-[229px] left-[34px] w-[292px] h-[34px] flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[32px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
        <h1>John&apos;s Junk Yard</h1>
      </header>

      <section
        className="absolute top-[272px] left-[79px] w-[204px] h-[106px] flex flex-col gap-2.5"
        aria-label="Rating information"
      >
        <h2 className="ml-[63px] w-[73px] h-6 [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
          Rating
        </h2>

        <div className="w-[200px] flex" role="img" aria-label="5 star rating">
          {starImages.map((starSrc, index) => (
            <img
              key={index}
              className="w-10 h-10"
              alt={`Star ${index + 1}`}
              src={starSrc}
            />
          ))}
        </div>

        <button className="ml-[27px] w-[153px] h-[22px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap bg-transparent border-none cursor-pointer">
          View Ratings
        </button>
      </section>

      <img
        className="absolute top-4 left-[91px] w-[175px] h-[175px]"
        alt="Profile picture for John's Junk Yard"
        src={profilePicture}
      />

      <hr
        className="absolute top-[212px] left-0 w-[357px] h-px border-0 bg-current"
        style={{ backgroundImage: `url(${line1})` }}
      />
    </article>
  );
};
