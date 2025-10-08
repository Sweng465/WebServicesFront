import React from "react";
import { Link } from "react-router-dom";
import hotListingFrame1 from "./hot-listing-frame-1.png";
import hotListingFrame2 from "./hot-listing-frame-2.png";
import hotListingFrame3 from "./hot-listing-frame-3.png";
import rectangle3 from "./rectangle-3.svg";
import rectangle9 from "./rectangle-9.svg";
import vector from "./vector.svg";

export const Homepage = () => {
  const vehicleListings = [
    {
      id: 1,
      image: hotListingFrame1,
      title: "2002 Ford Ranger",
      backgroundImage: "/background.svg",
    },
    {
      id: 2,
      image: hotListingFrame2,
      title: "1999 Mazda Miata",
      backgroundImage: "/rectangle-8.svg",
    },
    {
      id: 3,
      image: hotListingFrame3,
      title: "2003 Dodge SRT-4",
      backgroundImage: "/vehicle-listing-3.svg",
    },
  ];

  const navigationItems = [
    { label: "Browse Cars", href: "/browse-cars" },
    { label: "Auto Parts", href: "/auto-parts" },
    { label: "Sell Items", href: "/sell-items" },
    { label: "About", href: "/about" },
  ];

  return (
    <div className="w-full min-w-[1440px] min-h-[1080px] relative">
      <div className="absolute top-0 left-0 w-[1440px] h-[1147px] bg-white" />

      <main className="absolute top-[100px] left-0 w-[1440px] h-[1047px] rounded-sm overflow-hidden border border-solid border-[#ffffff1a] bg-[linear-gradient(282deg,rgba(208,111,30,1)_19%,rgba(41,122,210,1)_100%)]">
        <div className="absolute top-[25px] left-[22px] w-[1398px] h-[428px] bg-[#ffffff26] rounded-[20px]" />

        <h1 className="absolute top-[76px] left-[385px] w-[669px] [text-shadow:5px_5px_5px_#297ad280] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-white text-[50px] text-center tracking-[0] leading-[normal]">
          Find Quality Used Cars
          <br />
          and Auto Parts
        </h1>

        <section
          className="absolute top-[471px] left-[22px] w-[1418px] h-[500px] flex overflow-x-scroll"
          aria-label="Featured vehicle listings"
        >
          <div className="flex w-[1418px] h-[500px] relative items-center gap-[61px]">
            {vehicleListings.map((vehicle, index) => (
              <article
                key={vehicle.id}
                className={`${index === 2 ? "absolute top-0 left-[1122px]" : "relative"} bg-[url(${vehicle.backgroundImage})] w-[500px] h-[500px] bg-[100%_100%]`}
              >
                <img
                  className={`${index === 0 ? "top-[27px] left-9" : index === 1 ? "top-5 left-9" : "top-4 left-[23px]"} w-[${index === 2 ? "451px" : "427px"}] absolute h-[427px] object-cover`}
                  alt={`${vehicle.title} listing image`}
                  src={vehicle.image}
                />

                <h3
                  className={`${index === 0 ? "top-[460px] left-[127px]" : index === 1 ? "top-[455px] left-[118px]" : "absolute top-[455px] left-[119px]"} ${index === 2 ? "absolute" : ""} [font-family:'Archivo-SemiBold',Helvetica] font-semibold text-black text-3xl tracking-[0] leading-[normal] whitespace-nowrap`}
                >
                  {vehicle.title}
                </h3>
              </article>
            ))}
          </div>
        </section>

        <p className="absolute top-[257px] left-[calc(50.00%_-_500px)] w-[1001px] [font-family:'Archivo-SemiBold',Helvetica] font-semibold text-white text-3xl text-center tracking-[0] leading-[normal]">
          Connect with verified sellers, discover great deals, and find exactly
          what you need for your automative projects.
        </p>

        <button
          className="absolute top-[357px] left-[541px] w-[352px] h-[65px] group"
          aria-label="Start searching for vehicles and auto parts"
        >
          <div className="absolute top-0 left-0 w-[350px] h-[65px] rounded-[10px] shadow-[5px_5px_4px_#ffffff40] [background:radial-gradient(50%_50%_at_51%_50%,rgba(14,70,213,1)_51%,rgba(255,166,61,1)_100%)] group-hover:shadow-[5px_5px_8px_#ffffff60] transition-shadow duration-200" />

          <span className="absolute top-[calc(50.00%_-_24px)] left-[calc(50.00%_-_154px)] w-[306px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[40px] tracking-[0] leading-[normal] whitespace-nowrap">
            Start Searching
          </span>
        </button>
      </main>

      <header className="absolute top-0 left-0 w-[1440px] h-[100px] bg-[#9a9a9a80] rounded-sm overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
        <Link
          className="absolute top-5 left-3 w-[350px] h-[60px] bg-white rounded-[10px] shadow-[3px_5px_4px_#00000040] block hover:shadow-[3px_5px_8px_#00000060] transition-shadow duration-200"
          to="/homepage"
          aria-label="SalvageSearch homepage"
        >
          <img
            className="absolute top-[25px] left-[17px] w-[50px] h-[50px]"
            alt="SalvageSearch logo"
            src={rectangle3}
          />

          <h2 className="absolute top-[30px] left-[88px] w-[259px] [background:radial-gradient(50%_50%_at_71%_53%,rgba(155,199,255,1)_2%,rgba(14,70,213,1)_80%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-transparent text-[32px] tracking-[0] leading-[normal] whitespace-nowrap">
            SalvageSearch
          </h2>
        </Link>

        <nav
          className="absolute top-[23px] left-[404px] w-[632px] h-[57px]"
          aria-label="Main navigation"
        >
          <img
            className="absolute top-0 left-0 w-[632px] h-[57px]"
            alt=""
            src={rectangle9}
          />

          {navigationItems.map((item, index) => (
            <Link
              key={item.label}
              className={`absolute top-[18px] ${index === 0 ? "left-[38px]" : index === 1 ? "left-[212px]" : index === 2 ? "left-[384px]" : "left-[537px]"} [font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] hover:text-blue-600 transition-colors duration-200`}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute top-[23px] right-[15px] flex gap-[12px]">
          <Link className="w-[165px] h-[53px] relative group" to="/signin">
            <div className="absolute top-0 left-0 w-[163px] h-[53px] bg-white rounded-[10px] border border-solid border-black shadow-[0px_4px_4px_#00000040] group-hover:shadow-[0px_4px_8px_#00000060] transition-shadow duration-200" />

            <span className="absolute top-3.5 left-[41px] w-[81px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[normal]">
              Sign In
            </span>
          </Link>

          <Link
            className="w-[212px] h-[53px] relative group"
            to="/cart"
            aria-label="View shopping cart"
          >
            <div className="absolute top-0 left-0 w-[209px] h-[53px] rounded-[10px] shadow-[0px_4px_4px_#00000040] bg-[linear-gradient(101deg,rgba(7,36,111,1)_4%,rgba(14,70,213,1)_97%)] group-hover:shadow-[0px_4px_8px_#00000060] transition-shadow duration-200" />

            <span className="absolute top-[11px] left-[39px] w-[171px] h-[29px] flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-white text-2xl text-center tracking-[0] leading-[normal]">
              View Cart
            </span>

            <div
              className="absolute top-1 left-4 w-[46px] h-[46px]"
              aria-hidden="true"
            >
              <img
                className="absolute w-[88.98%] h-[82.50%] top-[7.50%] left-0"
                alt=""
                src={vector}
              />
            </div>
          </Link>
        </div>
      </header>
    </div>
  );
};
