import FormField from "./FormField";

const AddressEntry = ({ form, handleChange, formSubmitAttempted }) => {
  /* 
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipcode: "",
  */

  return (
    <div className="space-y-1">
      {/* Name */}
      <FormField
        label="Name"
        type="text"
        required
        value={form.name}
        placeHolder="Ex. John's Junkyard"
        onChange={(e) => handleChange("name", e.target.value)}
        maxLength={50}
        error={formSubmitAttempted && !form.name ? "Name is required." : ""}
      />

      {/* Address Line 1 */}
      <FormField
        label="Address Line 1"
        placeholder="Ex. 123 Main Street"
        value={form.line1}
        onChange={(e) => handleChange("line1", e.target.value)}
        type="text"
        required
        maxLength={75}
        error={formSubmitAttempted && !form.line1 ? "Address line 1 is required." : ""}
      />

      {/* Address Line 2 */}
      <FormField
        label="Address Line 2 (Optional)"
        placeholder="Ex. Floor 1"
        value={form.line2}
        onChange={(e) => handleChange("line2", e.target.value)}
        type="text"
        maxLength={75}
      />

      <div> {/* City State Zipcode */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* City */}
          <div className="flex items-start space-x-2">
            <span className="font-medium whitespace-nowrap relative top-[10px]">City</span>
            <div className="flex items-center w-40">
              <FormField
                label=""
                placeholder="Ex. Erie"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                type="text"
                required
                maxLength={50}
                error={formSubmitAttempted && !form.city ? "City is required." : ""}
              />
            </div>
          </div>

          {/* State */}
          <div className="flex items-start space-x-2">
            <span className="font-medium whitespace-nowrap relative top-[10px]">State</span>
            <div className="flex items-center w-20">
              <FormField
                label=""
                placeholder="Ex. PA"
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                type="text"
                required
                maxLength={2}
                className={`text-center`}
                error={formSubmitAttempted && !form.state ? "State is required." : ""}
              />
            </div>
          </div>

          {/* Zip */}
          <div className="flex items-start space-x-2">
            <span className="font-medium whitespace-nowrap relative top-[10px]">Zipcode</span>
            <div className="flex items-center w-24">
              <FormField
                label=""
                placeholder="Ex. 16501"
                value={form.zipcode}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow only digits, max 5
                  if (/^\d{0,5}$/.test(val)) {
                    handleChange("zipcode", val);
                  }
                }}
                type="text"
                inputMode="numeric"
                required
                className={`text-center`}
                error={formSubmitAttempted && !form.zipcode ? "Zipcode is required." : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressEntry;