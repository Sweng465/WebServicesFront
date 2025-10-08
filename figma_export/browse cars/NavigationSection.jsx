import React from "react";
import { Link } from "react-router-dom";
import rectangle3 from "./rectangle-3.svg";
import rectangle9 from "./rectangle-9.svg";
import vector from "./vector.svg";

export const NavigationSection = () => {
  const navigationItems = [
    { label: "Browse Cars", href: "/browse-cars", isLink: true },
    { label: "Auto Parts", href: "#", isLink: false },
    { label: "Sell Items", href: "#", isLink: false },
    { label: "About", href: "#", isLink: false },
  ];

  return (
    <nav
      className="absolute top-0 left-0 w-[1440px] h-[100px] bg-[#9a9a9a80] rounded-sm overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="absolute top-5 left-3 w-[350px] h-[60px] bg-white rounded-[10px] shadow-[3px_5px_4px_#00000040]" />

      <img
        className="absolute top-[25px] left-[17px] w-[50px] h-[50px]"
        alt="SalvageSearch logo"
        src={rectangle3}
      />

      <div className="absolute top-[23px] left-[1213px] w-[212px] h-[53px]">
        <button
          className="absolute top-0 left-0 w-[209px] h-[53px] rounded-[10px] shadow-[0px_4px_4px_#00000040] bg-[linear-gradient(101deg,rgba(7,36,111,1)_4%,rgba(14,70,213,1)_97%)] hover:opacity-90 transition-opacity"
          aria-label="View shopping cart"
        >
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
        </button>
      </div>

      <div className="absolute top-[23px] left-[1036px] w-[165px] h-[53px]">
        <button className="absolute top-0 left-0 w-[163px] h-[53px] bg-white rounded-[10px] border border-solid border-black shadow-[0px_4px_4px_#00000040] hover:bg-gray-50 transition-colors">
          <span className="absolute top-3.5 left-[41px] w-[81px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[normal]">
            Sign In
          </span>
        </button>
      </div>

      <h1 className="absolute top-[30px] left-[88px] w-[259px] [background:radial-gradient(50%_50%_at_71%_53%,rgba(155,199,255,1)_2%,rgba(14,70,213,1)_80%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-transparent text-[32px] tracking-[0] leading-[normal] whitespace-nowrap">
        SalvageSearch
      </h1>

      <div className="absolute top-[23px] left-[404px] w-[632px] h-[57px]">
        <img
          className="w-full h-full"
          alt="Search bar background"
          src={rectangle9}
        />
      </div>

      <ul className="flex absolute top-[41px] left-[442px]" role="menubar">
        {navigationItems.map((item, index) => {
          const positions = [
            { left: "left-0", width: "w-[127px]" },
            { left: "left-[174px]", width: "w-[107px]" },
            { left: "left-[346px]", width: "w-24" },
            { left: "left-[499px]", width: "w-[62px]" },
          ];

          return (
            <li
              key={item.label}
              className={`absolute ${positions[index].left} ${positions[index].width}`}
              role="none"
            >
              {item.isLink ? (
                <Link
                  className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] block hover:text-blue-600 transition-colors"
                  to={item.href}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] hover:text-blue-600 transition-colors"
                  role="menuitem"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
