import React, { useState } from "react";
import rectangle3 from "./rectangle-3.svg";
import rectangle9 from "./rectangle-9.svg";
import vector from "./vector.svg";

export const NavbarSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { label: "Browse Vehicles", href: "#browse-vehicles" },
    { label: "Auto Parts", href: "#auto-parts" },
    { label: "Sell Items", href: "#sell-items" },
    { label: "About", href: "#about" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Search query:", searchQuery);
  };

  const handleSignIn = () => {
    // Handle sign in functionality
    console.log("Sign in clicked");
  };

  const handleViewCart = () => {
    // Handle view cart functionality
    console.log("View cart clicked");
  };

  return (
    <header
      className="absolute top-0 left-0 w-[1440px] h-[100px] bg-[#9a9a9a80] rounded-sm overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]"
      role="banner"
    >
      <div className="absolute top-5 left-3 w-[350px] h-[60px] bg-white rounded-[10px] shadow-[3px_5px_4px_#00000040]" />

      <img
        className="absolute top-[25px] left-[17px] w-[50px] h-[50px]"
        alt="SalvageSearch Logo"
        src={rectangle3}
      />

      <button
        className="absolute top-[23px] left-[1213px] w-[212px] h-[53px] group"
        onClick={handleViewCart}
        aria-label="View shopping cart"
      >
        <div className="absolute top-0 left-0 w-[209px] h-[53px] rounded-[10px] shadow-[0px_4px_4px_#00000040] bg-[linear-gradient(101deg,rgba(7,36,111,1)_4%,rgba(14,70,213,1)_97%)] group-hover:shadow-[0px_6px_6px_#00000060] transition-shadow duration-200" />

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

      <button
        className="absolute top-[23px] left-[1036px] w-[165px] h-[53px] group"
        onClick={handleSignIn}
      >
        <div className="absolute top-0 left-0 w-[163px] h-[53px] bg-white rounded-[10px] border border-solid border-black shadow-[0px_4px_4px_#00000040] group-hover:shadow-[0px_6px_6px_#00000060] transition-shadow duration-200" />

        <span className="absolute top-3.5 left-[41px] w-[81px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[normal]">
          Sign In
        </span>
      </button>

      <h1 className="absolute top-[30px] left-[88px] w-[259px] [background:radial-gradient(50%_50%_at_71%_53%,rgba(155,199,255,1)_2%,rgba(14,70,213,1)_80%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-transparent text-[32px] tracking-[0] leading-[normal] whitespace-nowrap">
        SalvageSearch
      </h1>

      <form
        className="absolute top-[23px] left-[404px] w-[632px] h-[57px]"
        onSubmit={handleSearchSubmit}
        role="search"
      >
        <label htmlFor="search-input" className="sr-only">
          Search for auto parts and vehicles
        </label>
        <input
          id="search-input"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for auto parts and vehicles..."
          className="w-full h-full rounded-[10px] border border-gray-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{
            backgroundImage: `url(${rectangle9})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </form>

      <nav
        className="absolute top-[41px] left-[442px] flex space-x-8"
        role="navigation"
        aria-label="Main navigation"
      >
        {navigationItems.map((item, index) => {
          const positions = [
            { left: "0px", width: "127px" },
            { left: "174px", width: "107px" },
            { left: "346px", width: "96px" },
            { left: "499px", width: "62px" },
          ];

          return (
            <a
              key={item.label}
              href={item.href}
              className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
              style={{
                position: "absolute",
                left: positions[index].left,
                width: positions[index].width,
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
};
