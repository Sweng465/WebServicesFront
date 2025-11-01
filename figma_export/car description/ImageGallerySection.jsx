import React from "react";

export const ImageGallerySection = () => {
  const vehicleParts = [
    {
      name: "Engine",
      price: "$2,500",
      condition: "Good",
      conditionColor: "#233c5c",
      status: "Available",
      statusColor: "#233c5c",
      opacity: 1,
    },
    {
      name: "Transmission",
      price: "$1,800",
      condition: "Excellent",
      conditionColor: "#16a249",
      status: "Available",
      statusColor: "#233c5c",
      opacity: 1,
    },
    {
      name: "Front Bumper",
      price: "$350",
      condition: "Fair",
      conditionColor: "#ee7c2b",
      status: "Available",
      statusColor: "#233c5c",
      opacity: 1,
    },
    {
      name: "Headlight Assembly",
      price: "$280",
      condition: "Good",
      conditionColor: "#233c5c",
      status: "Sold",
      statusColor: "#e9ebec",
      opacity: 0.6,
    },
    {
      name: "Alternator",
      price: "$180",
      condition: "Excellent",
      conditionColor: "#16a249",
      status: "Available",
      statusColor: "#233c5c",
      opacity: 1,
    },
  ];

  return (
    <div className="absolute w-[calc(100%_-_32px)] top-[917px] left-4 h-[302px] bg-white rounded-xl border border-solid border-[#dee0e3] shadow-[0px_1px_2px_#0000000d]">
      <p className="absolute top-[25px] left-[25px] w-[310px] text-[23.4px] tracking-[-0.60px] flex items-center justify-center h-6 [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] leading-6 whitespace-nowrap">
        Available Parts from this Vehicle
      </p>

      {vehicleParts.map((part, index) => {
        const positions = [
          { top: "73px", left: "25px" },
          { top: "73px", left: "470px" },
          { top: "73px", left: "914px" },
          { top: "183px", left: "25px" },
          { top: "183px", left: "470px" },
        ];

        const position = positions[index];

        return (
          <div
            key={index}
            className={`absolute w-[calc(100%_-_939px)] h-[94px] rounded-xl border border-solid border-[#dee0e3]`}
            style={{
              top: position.top,
              left: position.left,
              opacity: part.opacity,
            }}
          >
            <div className="absolute top-[17px] left-[17px] h-6 flex">
              <div className="flex items-center justify-center h-6 [font-family:'Inter-Bold',Helvetica] font-bold text-[#21262c] text-[15.6px] tracking-[0] leading-6 whitespace-nowrap">
                {part.name}
              </div>
            </div>

            <div
              className="absolute top-[17px] h-[22px] flex items-center rounded-full"
              style={{
                backgroundColor: part.conditionColor,
                left:
                  part.name === "Front Bumper"
                    ? "368px"
                    : part.name === "Headlight Assembly"
                      ? "358px"
                      : "337px",
                width:
                  part.condition === "Fair"
                    ? "44px"
                    : part.condition === "Good"
                      ? "53px"
                      : "74px",
              }}
            >
              <div className="flex items-center justify-center h-3 ml-[11px] [font-family:'Inter-Bold',Helvetica] font-bold text-neutral-50 text-xs tracking-[0] leading-4 whitespace-nowrap">
                {part.condition}
              </div>
            </div>

            <div className="absolute top-[54px] left-[17px] h-[18px] flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-[#233c5c] text-[15.6px] tracking-[0] leading-7 whitespace-nowrap">
              {part.price}
            </div>

            <div
              className={`absolute top-[calc(50.00%_+_5px)] h-[22px] flex items-center rounded-full ${part.status === "Sold" ? "bg-[#e9ebec]" : "bg-[#233c5c]"}`}
              style={{
                left: part.name === "Headlight Assembly" ? "364px" : "338px",
                width: part.status === "Sold" ? "48px" : "74px",
              }}
            >
              <div
                className={`flex items-center justify-center h-3 ml-[11px] [font-family:'Inter-Bold',Helvetica] font-bold text-xs tracking-[0] leading-4 whitespace-nowrap ${part.status === "Sold" ? "text-[#21262c]" : "text-neutral-50"}`}
              >
                {part.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
