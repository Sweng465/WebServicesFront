import { useRef } from "react";
import FormField from "./FormField";

const CreditEntry = ({ form, handleChange, formSubmitAttempted }) => {
  /* 
    cardHolderName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  */

  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const DATE_LIMITS = { expMonth: 2, expYear: 2};

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "") // remove non-digits
      .substring(0, 16) // limit to 16 digits
      .replace(/(\d{4})(?=\d)/g, "$1 "); // add space after every 4 digits
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    handleChange("cardNumber", formatted);
  };

  const handleDateKeyDown = (field, e) => { // auto-advance back when deleting from fields
    if (e.key === "Backspace" && form[field] === "") {
      if (field === "expYear") monthRef.current?.focus();
    }
  };

  const handleDateChange = (field, value) => {
    if (["expMonth", "expYear"].includes(field)) { // for 2-field date
      if (!/^\d*$/.test(value)) return; // just digits
      if (value.length > DATE_LIMITS[field]) return; // limit fields

      handleChange(field, value); // update parent state

      if (value.length === DATE_LIMITS[field]) { // auto-advance when field is full
        if (field === "expMonth") yearRef.current?.focus();
      }
    }
  };

  return (
    <div className="space-y-1">
      {/* Card Holder Name */}
      <FormField
        label="Card Holder Name"
        type="text"
        required
        value={form.cardHolderName}
        placeHolder="Ex. John Smith"
        onChange={(e) => handleChange("cardHolderName", e.target.value)}
        maxLength={50}
        error={formSubmitAttempted && !form.cardHolderName ? "Card holder name is required." : ""}
      />

      {/* Card Number */}
      <FormField
        label="Card Number"
        type="text"
        inputMode="numeric"
        autoComplete="cc-number"
        required
        value={form.cardNumber}
        placeHolder="#### #### #### ####"
        onChange={handleCardNumberChange}
        error={formSubmitAttempted && !form.cardNumber ? "Card number is required." : ""}
      />

      <div> {/* Expiry Date and CVC */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* Expiry Date */}
          <div className="flex items-start space-x-2">
            <span className="font-medium whitespace-nowrap relative top-[10px]">Expiry Date</span>
              {/* Month */}
              <div className={`w-15`}>
                <FormField
                  ref={monthRef}
                  onKeyDown={(e) => handleDateKeyDown("expMonth", e)}
                  label=""
                  type="text"
                  required
                  value={form.expMonth}
                  placeHolder="MM"
                  onChange={(e) => handleDateChange("expMonth", e.target.value)}
                  maxLength={2}
                  className={`text-center`}
                  error={formSubmitAttempted && !form.expMonth ? "Expiry month is required." : ""}
                />
              </div>
              <span className=" text-xl font-medium relative top-[5px]">/</span>
              {/* Year */}
              <div className={`w-15`}>
                <FormField
                  ref={yearRef}
                  onKeyDown={(e) => handleDateKeyDown("expYear", e)}
                  label=""
                  type="text"
                  required
                  value={form.expYear}
                  placeHolder="YY"
                  onChange={(e) => handleDateChange("expYear", e.target.value)}
                  maxLength={2}
                  className={`text-center`}
                  error={formSubmitAttempted && !form.expYear ? "Expiry year is required." : ""}
                  
                />
              </div>
          </div> 

          {/* CVC */}
          <div className="flex items-start space-x-2">
            <span className="font-medium whitespace-nowrap relative top-[10px]">CVC</span>
            <div className={`w-15`}>
              <FormField
                label=""
                type="text"
                inputMode="numeric"
                required
                value={form.cvc}
                placeHolder="###"
                className={`text-center`}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow only digits, max 3
                  if (/^\d{0,3}$/.test(val)) {
                    handleChange("cvc", val);
                  }
                }}
                error={formSubmitAttempted && !form.cvc ? "CVC is required." : ""}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreditEntry;