import React, { useState } from "react";
import gridViewButton from "./grid-view-button.svg";
import listViewButton from "./list-view-button.svg";
import vector26 from "./vector-26.svg";
import vector27 from "./vector-27.svg";
import vector28 from "./vector-28.svg";
import vector29 from "./vector-29.svg";
import vector30 from "./vector-30.svg";
import vector31 from "./vector-31.svg";

export const SearchBarSection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedMake, setSelectedMake] = useState("All Makes");
  const [selectedModel, setSelectedModel] = useState("All Models");
  const [sortBy, setSortBy] = useState("Sort by Distance");
  const [viewMode, setViewMode] = useState("grid");

  const filterOptions = [
    {
      id: "years",
      label: selectedYear,
      value: selectedYear,
      onChange: setSelectedYear,
      icon: vector26,
      width: "w-32",
      gap: "gap-[31.2px]",
      textWidth: "w-[54.78px]",
      textSize: "text-[13.5px]",
    },
    {
      id: "makes",
      label: selectedMake,
      value: selectedMake,
      onChange: setSelectedMake,
      icon: vector27,
      width: "w-32",
      gap: "gap-[25.7px]",
      textWidth: "w-[60.33px]",
      textSize: "text-[13.3px]",
    },
    {
      id: "models",
      label: selectedModel,
      value: selectedModel,
      onChange: setSelectedModel,
      icon: vector28,
      width: "w-32",
      gap: "gap-[21.5px]",
      textWidth: "w-[64.52px]",
      textSize: "text-[13.2px]",
    },
    {
      id: "sort",
      label: sortBy,
      value: sortBy,
      onChange: setSortBy,
      icon: vector29,
      width: "w-40",
      gap: "gap-[15.2px]",
      textWidth: "w-[102.84px]",
      textSize: "text-[13px]",
    },
  ];

  const filterPositions = [
    "-left-px",
    "left-[140px]",
    "left-[284px]",
    "left-[428px]",
  ];

  return (
    <section
      className="ml-[17px] w-[1367px] h-[213px] relative mt-[19px] overflow-hidden"
      role="search"
      aria-label="Vehicle search and filters"
    >
      <header className="absolute top-px left-[487px] w-[329px] h-[88px] bg-white rounded-[5px]">
        <h1 className="absolute top-3 left-[54px] w-[219px] h-10 flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-[#233c5c] text-[35.4px] tracking-[0] leading-10 whitespace-nowrap">
          Browse Vehicles
        </h1>

        <p className="absolute top-[54px] left-[28px] w-[271px] h-6 flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] text-[14.8px] tracking-[0] leading-6 whitespace-nowrap">
          Find the perfect vehicle for your needs
        </p>
      </header>

      {filterOptions.map((filter, index) => (
        <div
          key={filter.id}
          className={`absolute top-[calc(50.00%_+_66px)] ${filterPositions[index]} ${filter.width} h-10 flex items-center ${filter.gap} bg-white rounded-[10px] border border-solid border-[#e9ebec]`}
        >
          <button
            className={`h-5 ${filter.textWidth} ml-[13px] flex justify-center overflow-hidden`}
            onClick={() => {}}
            aria-label={`Select ${filter.id}`}
            aria-expanded="false"
            aria-haspopup="listbox"
          >
            <span
              className={`flex items-center justify-center mt-[3px] h-3.5 ml-[0.2px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#21262c] text-center tracking-[0] leading-5 whitespace-nowrap ${filter.textSize}`}
            >
              {filter.label}
            </span>
          </button>

          <div className="h-4 w-4 relative opacity-50" aria-hidden="true">
            <img
              className="absolute w-[50.00%] h-[25.00%] top-[37.50%] left-[25.00%]"
              alt=""
              src={filter.icon}
            />
          </div>
        </div>
      ))}

      <div
        className="absolute top-[173px] right-[51px] flex gap-2"
        role="group"
        aria-label="View options"
      >
        <button
          className={`w-10 h-10 ${viewMode === "grid" ? "opacity-100" : "opacity-70"}`}
          onClick={() => setViewMode("grid")}
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
        >
          <img className="w-full h-full" alt="Grid view" src={gridViewButton} />
        </button>

        <button
          className={`w-10 h-10 ${viewMode === "list" ? "opacity-100" : "opacity-70"}`}
          onClick={() => setViewMode("list")}
          aria-label="List view"
          aria-pressed={viewMode === "list"}
        >
          <img className="w-full h-full" alt="List view" src={listViewButton} />
        </button>
      </div>

      <div
        className="absolute top-[calc(50.00%_+_22px)] left-2 w-4 h-4"
        aria-hidden="true"
      >
        <img
          className="absolute w-[66.67%] h-[66.67%] top-[12.50%] left-[12.50%]"
          alt=""
          src={vector30}
        />

        <img
          className="absolute w-[17.92%] h-[17.92%] top-[69.58%] left-[69.58%]"
          alt=""
          src={vector31}
        />
      </div>

      <div className="absolute w-[calc(100%_+_1px)] top-[117px] -left-px h-10 flex bg-white rounded-[10px] overflow-hidden border border-solid border-[#e9ebec]">
        <div className="mt-[11.5px] ml-[41px] w-[1314px] mb-[11.5px] flex">
          <label htmlFor="vehicle-search" className="sr-only">
            Search for vehicles
          </label>
          <input
            id="vehicle-search"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search vehicles..."
            className="flex items-center justify-start mt-px w-full h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#67737e] text-[13.5px] tracking-[0] leading-[normal] bg-transparent border-none outline-none placeholder:text-[#67737e]"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Enter keywords to search for vehicles by make, model, or other features
          </div>
        </div>
      </div>
    </section>
  );
};
