import { useState } from "react";

export default function FormField({
  label,
  type = "text",
  as = "input",
  value,
  onChange,
  required = false,
  error = "",
  helpText = "",
  className = "",
  children,  // for <select> options
  ...props
}) {
  const [touched, setTouched] = useState(false);

  const showError = (required && touched && !value) || error;
  const borderColor = showError ? "border-red-500" : "border-gray-300";
  const focusColor = showError ? "focus:ring-red-600" : "focus:ring-blue-700";

  const baseStyle = `
    w-full p-2 border rounded-lg shadow-sm
    focus:outline-none focus:ring-2 transition
    ${borderColor} ${focusColor} ${className}
  `;

  const handleBlur = () => {
    setTouched(true);
  };

  const handleInput = (e) => {
    /*
    if (showError && !!e.target.value) {
      // remove visual error once user starts fixing
    }
    */
    if (touched && required && e.target.value.trim() !== "") {
      setTouched(false);
    }
    onChange(e);
  };

  const Component = as; // "input", "textarea", "select"

  return (
    <div className="w-full">
      {label && <label className="block mb-1 font-medium">{label}</label>}

      <Component
        type={type}
        value={value}
        onChange={handleInput}
        onBlur={handleBlur}
        className={baseStyle}
        {...props}
      >
        {children}
      </Component>

      {/* Error message */}
      {showError && (
        <p className="text-sm text-red-600 mt-1">
          {error || "This field is required."}
        </p>
      )}

      {/* Optional help text */}
      {helpText && !showError && (
        <p className="text-xs text-gray-600 mt-1">{helpText}</p>
      )}
    </div>
  );
}