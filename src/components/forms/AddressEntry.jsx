const AddressEntry = ({ form, handleChange }) => {
  /* 
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipcode: "",
  */

  const borderStyle = `border border-gray-300 rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-700 transition`

  return (
    <div className="space-y-4">
      <div> {/* Name */}
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          maxLength="50"
          placeholder="Ex. John's Junkyard (Max 50 characters)"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full p-2 ${borderStyle}`}
          required
        />
      </div>

      <div> {/* Address Line 1 */}
        <label className="block mb-1 font-medium">Address Line 1</label>
        <input
          type="text"
          maxLength="75"
          placeholder="Ex. 123 Main Street"
          value={form.line1}
          onChange={(e) => handleChange("line1", e.target.value)}
          className={`w-full p-2 ${borderStyle}`}
          required
        />
      </div>

      <div> {/* Address Line 2 */}
        <label className="block mb-1 font-medium">Address Line 2 (Optional)</label>
        <input
          type="text"
          maxLength="75"
          placeholder="Ex. Floor 1"
          value={form.line2}
          onChange={(e) => handleChange("line2", e.target.value)}
          className={`w-full p-2 ${borderStyle}`}
        />
      </div>

      <div> {/* City State Zipcode */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* City */}
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">City</span>
            <input
              type="text"
              maxLength="50"
              placeholder="Ex. Erie"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className={`w-40 p-2 ${borderStyle}`}
              required
            />
          </div>

          {/* State */}
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">State</span>
            <input
              type="text"
              maxLength="2"
              placeholder="Ex. PA"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className={`w-20 p-2 text-center ${borderStyle}`}
              required
            />
          </div>

          {/* Zip */}
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">Zipcode</span>
            <input
              type="text"
              maxLength="5"
              inputMode="numeric"
              placeholder="Ex. 16501"
              value={form.zipcode}
              onChange={(e) => handleChange("zipcode", e.target.value)}
              className={`w-24 p-2 text-center ${borderStyle}`}
              required
            />
          </div>
        </div>
      </div>
  </div>
  );
};

export default AddressEntry;