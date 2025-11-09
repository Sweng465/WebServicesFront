import { useRef, useState, useEffect } from "react";

const CollapsibleToggle = ({ title, children, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");
  const [overflow, setOverflow] = useState("hidden");

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) { // expand
        setOverflow("hidden");
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
        const timeout = setTimeout(() => { // uses timeouts for smooth open/close transitions
          setMaxHeight("none"); // allow natural height
          setOverflow("visible"); // enable scrolling again
        }, 300);
        return () => clearTimeout(timeout);
      } else { // collapse
        setOverflow("hidden");
        if (maxHeight === "none") setMaxHeight(`${contentRef.current.scrollHeight}px`);
        const timeout = setTimeout(() => {
          requestAnimationFrame(() => setMaxHeight("0px"));
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [isOpen, children, maxHeight]);

  const colors = {
    border: "border-gray-300 hover:border-gray-200",
    header: "bg-gray-300 hover:bg-gray-200",
  };

  return (
    <div className={`border-2 rounded-md transition-colors duration-200 ${colors.border}`}>
      <button
        type="button"
        onClick={onToggle}
        disabled={!onToggle}
        className={`w-full flex justify-between items-center p-2 font-medium transition ${colors.header}`}
      >
        <span>{title}</span>
        <span className="transform transition-transform duration-200">
          {isOpen ? "▾" : "▸"}
        </span>
      </button>

      <div
        className="transition-all duration-300 ease-in-out"
        style={{ maxHeight, overflow }}
      >
        <div ref={contentRef} className="p-4 bg-gray-50">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleToggle;