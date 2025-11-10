import { useRef } from "react";

const CreditEntry = ({ form, handleChange }) => {
  /* 
    cardHolderName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  */
  const borderStyle = `border border-gray-300 rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-700 transition`

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
    <div className="space-y-4">
      <div> {/* Card Holder Name */}
        <label className="block mb-1 font-medium">Card Holder Name</label>
        <input
          type="text"
          maxLength="50"
          placeholder="Ex. John Smith"
          value={form.cardHolderName}
          onChange={(e) => handleChange("cardHolderName", e.target.value)}
          className={`w-full p-2 ${borderStyle}`}
          required
        />
      </div>

      {/* Card Number */}
      <div>
        <label className="block mb-1 font-medium">Card Number</label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="#### #### #### ####"
          value={form.cardNumber}
          onChange={handleCardNumberChange}
          className={`w-full p-2 tracking-widest ${borderStyle}`}
          required
        />
      </div>

      <div> {/* Expiry Date and CVC */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* Expiry Date */}
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">Expiry Date</span>
            <input
              ref={monthRef}
              onKeyDown={(e) => handleDateKeyDown("expMonth", e)}
              type="text"
              maxLength="2"
              placeholder="MM"
              value={form.expMonth}
              onChange={(e) => handleDateChange("expMonth", e.target.value)}
              className={`w-15 p-2 text-center ${borderStyle}`}
              required
            />
            <span className=" text-xl font-medium">/</span>
            <input
              ref={yearRef}
              onKeyDown={(e) => handleDateKeyDown("expYear", e)}
              type="text"
              maxLength="2"
              placeholder="YY"
              value={form.expYear}
              onChange={(e) => handleDateChange("expYear", e.target.value)}
              className={`w-15 p-2 text-center ${borderStyle}`}
              required
            />
          </div> 

          {/* CVC */}
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">CVC</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength="3"
              placeholder="###"
              value={form.cvc}
              onChange={(e) => handleChange("cvc", e.target.value)}
              className={`w-15 p-2 text-center ${borderStyle}`}
              required
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreditEntry;