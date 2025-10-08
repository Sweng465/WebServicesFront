import React from "react";
import image1 from "./image.png";
import image from "./image.svg";
import line12 from "./line-1-2.svg";
import star22 from "./star-2-2.svg";
import star32 from "./star-3-2.svg";
import star42 from "./star-4-2.svg";
import star52 from "./star-5-2.svg";

export const DealerListingSection = () => {
  const dealerData = {
    name: "John's Junk Yard",
    profileImage: image1,
    rating: {
      stars: [
        { id: 1, src: image, alt: "Star 1" },
        { id: 2, src: star22, alt: "Star 2" },
        { id: 3, src: star32, alt: "Star 3" },
        { id: 4, src: star42, alt: "Star 4" },
        { id: 5, src: star52, alt: "Star 5" },
      ],
    },
  };

  return (
    <article
      className="top-[130px] left-[991px] absolute w-[359px] h-[423px]"
      role="region"
      aria-labelledby="dealer-name"
    >
      <div className="absolute top-0 left-0 w-[357px] h-[423px] bg-white rounded-[15px]" />

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

        <div className="w-[200px] flex" role="img" aria-label="5 star rating">
          {dealerData.rating.stars.map((star) => (
            <img
              key={star.id}
              className="w-10 h-10"
              alt={star.alt}
              src={star.src}
            />
          ))}
        </div>

        <button
          className="ml-[27px] w-[153px] h-[22px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
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

      <img
        className="absolute top-[212px] left-0 w-[357px] h-px"
        alt=""
        src={line12}
        role="presentation"
      />
    </article>
  );
};
