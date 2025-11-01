import React, { useState } from "react";
import { Link } from "react-router-dom";
import polygon1 from "./polygon-1.svg";
import rectangle3 from "./rectangle-3.svg";
import rectangle9 from "./rectangle-9.svg";
import vector from "./vector.svg";

export const ListPageFrame = () => {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    make: "",
    model: "",
    description: "",
    price: "",
    condition: "",
    itemType: "vehicle", // 'vehicle' or 'part'
    photos: [],
  });

  const conditionOptions = ["Excellent", "Good", "Fair", "Poor", "Salvage"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  return (
    <div className="bg-white w-full min-w-[1440px] min-h-[1024px] relative">
      <div className="absolute top-0 left-0 w-[1440px] h-[924px] rounded-sm border border-solid border-[#ffffff1a] bg-[linear-gradient(284deg,rgba(208,111,30,1)_0%,rgba(41,122,210,1)_100%)]" />

      <main className="absolute top-[55px] left-[167px] w-[1150px] h-[836px] bg-[#ffffff80] rounded-[15px] overflow-hidden backdrop-blur-[25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(25px)_brightness(100%)]">
        <form onSubmit={handleSubmit}>
          <div className="absolute top-[94px] left-[138px] w-[341px] h-[65px] flex flex-col">
            <label className="flex items-center justify-center w-[125px] h-[35px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
              Name *
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="w-[339px] h-[30px] bg-white rounded-[15px] px-3 text-black"
            />
          </div>

          <div className="absolute top-[191px] left-[138px] w-[341px] h-[65px] flex flex-col">
            <label className="flex items-center justify-center w-[146px] h-[35px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
              Year *
            </label>

            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              required
              min="1900"
              max="2024"
              className="w-[339px] h-[30px] bg-white rounded-[15px] px-3 text-black"
            />
          </div>

          <div className="absolute top-72 left-[138px] w-[341px] h-[65px] flex flex-col">
            <label className="flex items-center justify-center w-[146px] h-[35px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-transparent text-xl tracking-[0] leading-[normal]">
              <span className="text-black">Make</span>
              <span className="text-white"> *</span>
            </label>

            <input
              type="text"
              value={formData.make}
              onChange={(e) => handleInputChange("make", e.target.value)}
              required
              className="w-[339px] h-[30px] bg-white rounded-[15px] px-3 text-black"
            />
          </div>

          <div className="absolute top-[385px] left-[138px] w-[341px] h-[65px] flex flex-col">
            <label className="flex items-center justify-center w-[146px] h-[35px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
              Model *
            </label>

            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              required
              className="w-[339px] h-[30px] bg-white rounded-[15px] px-3 text-black"
            />
          </div>

          <div className="absolute top-[482px] left-[138px] w-[341px] h-[221px] flex flex-col">
            <label className="flex items-center justify-center w-[146px] h-[35px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
              Description
            </label>

            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-[339px] h-[186px] bg-white rounded-[15px] p-3 text-black resize-none"
              placeholder="Enter item description..."
            />
          </div>

          <div className="absolute top-[363px] left-[668px] w-[343px] h-[340px]">
            <div className="absolute top-[35px] left-0 w-[339px] h-[305px] bg-[#fffbfb] rounded-[15px]" />

            <label className="absolute top-0 left-0 w-[146px] h-[35px] flex items-center justify-center [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
              Photos
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="absolute top-[35px] left-0 w-[339px] h-[305px] opacity-0 cursor-pointer z-10"
            />

            <div className="absolute top-[35px] left-0 w-[339px] h-[305px] flex items-center justify-center [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl text-center tracking-[0] leading-[normal] pointer-events-none">
              Click to insert photo
            </div>
          </div>

          <div className="absolute top-[266px] left-[672px] w-[341px] h-[65px] flex flex-col">
            <label className="flex items-center justify-center w-[146px] h-[35px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
              Price*
            </label>

            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-[339px] h-[30px] bg-white rounded-[15px] px-3 text-black"
              placeholder="0.00"
            />
          </div>

          <div className="absolute top-[167px] left-[672px] w-[197px] h-[67px] flex flex-col gap-0.5">
            <label className="flex items-center justify-center w-[146px] h-[35px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
              Condition *
            </label>

            <div className="relative w-[195px] h-[30px] bg-white rounded-[15px]">
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                required
                className="w-full h-full bg-transparent px-3 text-black appearance-none cursor-pointer"
              >
                <option value="">Select condition</option>
                {conditionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <img
                className="absolute top-[7px] right-[8px] w-[19.05px] h-[21px] pointer-events-none"
                alt="Polygon"
                src={polygon1}
              />
            </div>
          </div>

          <fieldset className="absolute top-[95px] left-[672px] w-[206px] h-8 flex">
            <legend className="sr-only">Item Type</legend>

            <label className="flex items-center">
              <span className="flex items-center justify-center mt-0.5 w-[45px] h-[25px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
                Vehicle:
              </span>
              <input
                type="radio"
                name="itemType"
                value="vehicle"
                checked={formData.itemType === "vehicle"}
                onChange={(e) => handleInputChange("itemType", e.target.value)}
                className="w-8 h-8 bg-white rounded-2xl ml-1 appearance-none border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500"
              />
            </label>

            <label className="flex items-center ml-[38px]">
              <span className="flex items-center justify-center mt-0.5 w-[55px] h-[29px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal]">
                Part:
              </span>
              <input
                type="radio"
                name="itemType"
                value="part"
                checked={formData.itemType === "part"}
                onChange={(e) => handleInputChange("itemType", e.target.value)}
                className="w-8 h-8 bg-white rounded-2xl ml-1 appearance-none border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500"
              />
            </label>
          </fieldset>

          <button
            type="submit"
            className="absolute top-[735px] left-[477px] w-[193px] h-[70px] bg-[#0e46d5] rounded-[10px] flex items-center justify-center [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-[normal] hover:bg-[#0d3fb8] transition-colors"
          >
            Create Listing
          </button>
        </form>

        <h1 className="absolute top-2 left-[167px] w-[811px] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-black text-[50px] text-center tracking-[0] leading-[normal]">
          List New Item
        </h1>
      </main>

      <header className="absolute top-[924px] left-0 w-[1440px] h-[100px] bg-[#9a9a9a80] rounded-sm overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
        <div className="absolute top-5 left-3 w-[350px] h-[60px] bg-white rounded-[10px] shadow-[3px_5px_4px_#00000040]" />

        <img
          className="absolute top-[25px] left-[17px] w-[50px] h-[50px]"
          alt="Rectangle"
          src={rectangle3}
        />

        <div className="absolute top-[23px] left-[1213px] w-[212px] h-[53px]">
          <button className="absolute top-0 left-0 w-[209px] h-[53px] rounded-[10px] shadow-[0px_4px_4px_#00000040] bg-[linear-gradient(101deg,rgba(7,36,111,1)_4%,rgba(14,70,213,1)_97%)] hover:opacity-90 transition-opacity">
            <span className="absolute top-[11px] left-[39px] w-[171px] h-[29px] flex items-center justify-center [font-family:'Inter-Bold',Helvetica] font-bold text-white text-2xl text-center tracking-[0] leading-[normal]">
              View Cart
            </span>

            <div className="absolute top-1 left-4 w-[46px] h-[46px]">
              <img
                className="absolute w-[88.98%] h-[82.50%] top-[7.50%] left-0"
                alt="Vector"
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

        <div className="absolute top-[30px] left-[88px] w-[259px] [background:radial-gradient(50%_50%_at_71%_53%,rgba(155,199,255,1)_2%,rgba(14,70,213,1)_80%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Encode_Sans_Expanded-Bold',Helvetica] font-bold text-transparent text-[32px] tracking-[0] leading-[normal] whitespace-nowrap">
          SalvageSearch
        </div>

        <img
          className="absolute top-[-1537px] left-[404px] w-[632px] h-[57px]"
          alt="Rectangle"
          src={rectangle9}
        />

        <nav className="absolute top-[41px] left-[442px] flex gap-8">
          <a
            href="#"
            className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] hover:text-blue-600 transition-colors"
          >
            Browse Vehicles
          </a>

          <a
            href="#"
            className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] hover:text-blue-600 transition-colors"
          >
            Auto Parts
          </a>

          <Link
            className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] hover:text-blue-600 transition-colors"
            to="/list-page-frame"
          >
            Sell Items
          </Link>

          <a
            href="#"
            className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] hover:text-blue-600 transition-colors"
          >
            About
          </a>
        </nav>
      </header>
    </div>
  );
};
