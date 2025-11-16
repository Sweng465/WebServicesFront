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
        helpText="Max 50 characters"
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
        <div className="flex flex-wrap items-center gap-x-10">
          {/* City */}
          <div className="flex items-center w-40">
            <FormField
              label="City"
              placeholder="Ex. Erie"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              type="text"
              required
              maxLength={50}
              error={formSubmitAttempted && !form.city ? "City is required." : ""}
            />
          </div>

          {/* State */}
          <div className="flex items-center w-20">
            <FormField
              label="State"
              placeholder="Ex. PA"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              type="text"
              required
              maxLength={2}
              error={formSubmitAttempted && !form.state ? "State is required." : ""}
            />
          </div>

          {/* Zip */}
          <div className="flex items-center w-24">
            <FormField
              label="Zipcode"
              placeholder="Ex. 16501"
              value={form.zipcode}
              onChange={(e) => handleChange("zipcode", e.target.value)}
              type="number"
              inputMode="numeric"
              required
              maxLength={5}
              error={formSubmitAttempted && !form.zipcode ? "Zipcode is required." : ""}
            />
          </div>
        </div>
      </div>
  </div>
  );
};

export default AddressEntry;