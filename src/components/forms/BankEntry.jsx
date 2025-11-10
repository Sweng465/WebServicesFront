const BankEntry = ({ form, handleChange }) => {
  /* 
    accountHolderName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "",
    bankName: "",
  */

  const borderStyle = `border border-gray-300 rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-700 transition`;

  const handleAccountTypeChange = (type) => {
    // Only one checkbox can be selected at a time
    handleChange("accountType", form.accountType === type ? "" : type);
  };

  const formatRoutingNumber = (value) => {
    return value.replace(/\D/g, "").substring(0, 9); // only digits, max 9
  };

  const formatAccountNumber = (value) => {
    return value.replace(/\D/g, ""); // only digits
  };

  return (
    <div className="space-y-4">
      {/* Account Holder Name */}
      <div>
        <label className="block mb-1 font-medium">Account Holder Name</label>
        <input
          type="text"
          maxLength="50"
          placeholder="Ex. John Doe"
          value={form.accountHolderName}
          onChange={(e) => handleChange("accountHolderName", e.target.value)}
          className={`w-full p-2 ${borderStyle}`}
          required
        />
      </div>

      {/* Routing Number */}
      <div>
        <label className="block mb-1 font-medium">Routing Number</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength="9"
          placeholder="#########"
          value={form.routingNumber}
          onChange={(e) => handleChange("routingNumber", formatRoutingNumber(e.target.value))}
          className={`w-full p-2 ${borderStyle}`}
          required
        />
      </div>

      {/* Account Number */}
      <div>
        <label className="block mb-1 font-medium">Account Number</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength="17"
          placeholder="Ex. 000123456789"
          value={form.accountNumber}
          onChange={(e) => handleChange("accountNumber", formatAccountNumber(e.target.value))}
          className={`w-full p-2 ${borderStyle}`}
          required
        />
      </div>

      {/* Account Type */}
      <div>
        <label className="block mb-1 font-medium">Account Type</label>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              id="checking-checkbox"
              type="checkbox"
              checked={form.accountType === "checking"}
              onChange={() => handleAccountTypeChange("checking")}
              className="w-4 h-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
            />
            <label htmlFor="checking-checkbox" className="ml-2">Checking</label>
          </div>

          <div className="flex items-center">
            <input
              id="savings-checkbox"
              type="checkbox"
              checked={form.accountType === "savings"}
              onChange={() => handleAccountTypeChange("savings")}
              className="w-4 h-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
            />
            <label htmlFor="savings-checkbox" className="ml-2">Savings</label>
          </div>
        </div>
      </div>

      {/* Bank Name */}
      <div>
        <label className="block mb-1 font-medium">Bank Name</label>
        <input
          type="text"
          placeholder="Ex. Farmer's National Bank"
          maxLength="50"
          value={form.bankName}
          onChange={(e) => handleChange("bankName", e.target.value)}
          className={`w-full p-2 ${borderStyle}`}
        />
      </div>
    </div>
  );
};

export default BankEntry;