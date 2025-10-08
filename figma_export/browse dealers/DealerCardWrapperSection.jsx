import React from "react";
import line15 from "./line-1-5.svg";
import profilePicture4 from "./profile-picture-4.png";
import star14 from "./star-1-4.svg";
import star25 from "./star-2-5.svg";
import star35 from "./star-3-5.svg";
import star45 from "./star-4-5.svg";
import star55 from "./star-5-5.svg";

export const DealerCardWrapperSection = () => {
  const dealerData = {
    name: "John's Junk Yard",
    profileImage: profilePicture4,
    rating: 5,
    stars: [star14, star25, star35, star45, star55],
  };

  return (
    <article
      className="top-[663px] left-[991px] absolute w-[359px] h-[423px]"
      role="article"
      aria-labelledby="dealer-name"
    >
      <div className="absolute top-0 left-0 w-[357px] h-[423px] bg-white rounded-[15px]" />

      <h2
        id="dealer-name"
        className="absolute top-[229px] left-[34px] w-[292px] h-[34px] flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[32px] text-center tracking-[0] leading-[normal] whitespace-nowrap"
      >
        {dealerData.name}
      </h2>

      <section
        className="absolute top-[272px] left-[79px] w-[204px] h-[106px] flex flex-col gap-2.5"
        aria-labelledby="rating-section"
      >
        <h3
          id="rating-section"
          className="ml-[63px] w-[73px] h-6 [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap"
        >
          Rating
        </h3>

        <div
          className="w-[200px] flex"
          role="img"
          aria-label={`${dealerData.rating} out of 5 stars`}
        >
          {dealerData.stars.map((star, index) => (
            <img
              key={index}
              className="w-10 h-10"
              alt={`Star ${index + 1}`}
              src={star}
            />
          ))}
        </div>

        <button
          className="ml-[27px] w-[153px] h-[22px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="View detailed ratings for this dealer"
        >
          View Ratings
        </button>
      </section>

      <img
        className="absolute top-4 left-[91px] w-[175px] h-[175px]"
        alt={`Profile picture of ${dealerData.name}`}
        src={dealerData.profileImage}
      />

      <img
        className="absolute top-[212px] left-0 w-[357px] h-px"
        alt=""
        src={line15}
        role="presentation"
      />
    </article>
  );
};
