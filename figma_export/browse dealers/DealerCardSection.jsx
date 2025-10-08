import React from "react";
import profilePicture2 from "./profile-picture-2.png";
import star12 from "./star-1-2.svg";
import star23 from "./star-2-3.svg";
import star33 from "./star-3-3.svg";
import star43 from "./star-4-3.svg";
import star53 from "./star-5-3.svg";

export const DealerCardSection = () => {
  const dealerData = {
    name: "John's Junk Yard",
    profileImage: profilePicture2,
    rating: 5,
    stars: [star12, star23, star33, star43, star53],
  };

  return (
    <article
      className="top-[130px] left-[521px] absolute w-[359px] h-[423px]"
      role="region"
      aria-labelledby="dealer-name"
    >
      <div className="absolute top-0 left-0 w-[357px] h-[423px] bg-white rounded-[15px] shadow-sm" />

      <header className="absolute top-[229px] left-[34px] w-[292px] h-[34px] flex items-center justify-center">
        <h2
          id="dealer-name"
          className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-[32px] text-center tracking-[0] leading-[normal] whitespace-nowrap"
        >
          {dealerData.name}
        </h2>
      </header>

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
              aria-hidden="true"
            />
          ))}
        </div>

        <button
          className="ml-[27px] w-[153px] h-[22px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer bg-transparent border-none"
          aria-label="View detailed ratings for John's Junk Yard"
        >
          View Ratings
        </button>
      </section>

      <img
        className="absolute top-4 left-[91px] w-[175px] h-[175px] rounded-full object-cover"
        alt={`Profile picture of ${dealerData.name}`}
        src={dealerData.profileImage}
      />

      <hr
        className="absolute top-[212px] left-0 w-[357px] h-px border-0 bg-gray-300"
        aria-hidden="true"
      />
    </article>
  );
};
