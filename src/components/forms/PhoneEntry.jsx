import { useRef } from "react";

const PhoneEntry = ({ form, handleChange }) => {
  const borderStyle = `text-center border border-gray-300 rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-700 transition`

  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);
  const PHONE_LIMITS = { phone1: 3, phone2: 3, phone3: 4 };

  const handlePhoneKeyDown= (field, e) => { // auto-advance back when deleting from fields
    if (e.key === "Backspace" && form[field] === "") {
      if (field === "phone3") phone2Ref.current?.focus();
      if (field === "phone2") phone1Ref.current?.focus();
    }
  };

  const handlePhoneChange = (field, value) => {
    if (["phone1", "phone2", "phone3"].includes(field)) { // for 3-field phone number
      if (!/^\d*$/.test(value)) return; // just digits
      if (value.length > PHONE_LIMITS[field]) return; // limit fields

      handleChange(field, value); // update parent state
      
      if (value.length === PHONE_LIMITS[field]) { // auto-advance when field is full
        if (field === "phone1") phone2Ref.current?.focus();
        if (field === "phone2") phone3Ref.current?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col">
      <label className="block mb-1 font-medium">Phone Number</label>
      <div className="flex items-center space-x-2">
        <input
          ref={phone1Ref}
          type="text"
          inputMode="numeric"
          maxLength="3"
          placeholder="###"
          value={form.phone1}
          onChange={(e) => handlePhoneChange("phone1", e.target.value)}
          className={`w-16 p-2 ${borderStyle}`}
          required
        />
        <span className=" text-xl font-medium">-</span>
        <input
          ref={phone2Ref}
          onKeyDown={(e) => handlePhoneKeyDown("phone2", e)}
          type="text"
          inputMode="numeric"
          maxLength="3"
          placeholder="###"
          value={form.phone2}
          onChange={(e) => handlePhoneChange("phone2", e.target.value)}
          className={`w-16 p-2 ${borderStyle}`}
          required
        />
        <span className=" text-xl font-medium">-</span>
        <input
          ref={phone3Ref}
          onKeyDown={(e) => handlePhoneKeyDown("phone3", e)}
          type="text"
          inputMode="numeric"
          maxLength="4"
          placeholder="####"
          value={form.phone3}
          onChange={(e) => handlePhoneChange("phone3", e.target.value)}
          className={`w-20 p-2 ${borderStyle}`}
          required
        />
      </div>
    </div>
  );
};

export default PhoneEntry;