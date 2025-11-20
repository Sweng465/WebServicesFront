import { useState } from "react";

export default function FormFieldCheckbox({
  label,
  checked,
  onChange,
  required = false,
  error = "",
  helpText = " ",
}) {
  const [touched, setTouched] = useState(false);

  const showError = (required && touched && !checked) || error;

  return (
    <div className="flex items-start">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange(e);
          if (!touched) setTouched(true);
        }}
        onBlur={() => setTouched(true)}
        className="
          mt-1
          w-4 h-4 border border-gray-300 rounded 
          focus:outline-none focus:ring-2 focus:ring-blue-700
        "
      />

      {/* Label + help/error text */}
      <div className="ml-2 leading-tight">
        {label && (
          <label className="font-medium block">{label}</label>
        )}

        {/* Keep fixed-height for consistent layout like FormField */}
        <div className="min-h-[1.25rem] mt-0.5">
          {showError ? (
            <p className="text-red-600 text-xs">{error || "Required."}</p>
          ) : (
            helpText && (
              <p className="text-gray-600 text-xs">{helpText}</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}