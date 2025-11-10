import { useState, useRef, useEffect } from "react";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const colors = {
    border: "border-blue-700 hover:border-blue-800",
    header: "bg-blue-700 hover:bg-blue-800",
  };

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  return (
    <div
      className={`border-2 rounded-md overflow-hidden transition-colors duration-200 ${colors.border}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-2 text-white font-medium transition ${colors.header}`}
      >
        <span>{title}</span>
        <span className="transform transition-transform duration-200">
          {isOpen ? "▾" : "▸"}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="p-4 bg-gray-50">{children}</div>
      </div>
    </div>
  );
};

export default Collapsible;