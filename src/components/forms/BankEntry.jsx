import FormField from "./FormField";
import FormFieldCheckbox from "./FormFieldCheckbox";

const BankEntry = ({ form, handleChange, formSubmitAttempted }) => {
  /* 
    accountHolderName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "",
    bankName: "",
  */

  const handleAccountTypeChange = (type) => {
    // If user clicks the currently selected one, do nothing.
    if (form.accountType === type) return;

    // Otherwise switch to the new one
    handleChange("accountType", type);
  };

  const formatRoutingNumber = (value) => {
    return value.replace(/\D/g, "").substring(0, 9); // only digits, max 9
  };

  const formatAccountNumber = (value) => {
    return value.replace(/\D/g, ""); // only digits
  };

  return (
    <div className="space-y-1">
      {/* Account Holder Name */}
      <FormField
        label="Account Holder Name"
        type="text"
        required
        value={form.accountHolderName}
        placeHolder="Ex. Jane Doe"
        onChange={(e) => handleChange("accountHolderName", e.target.value)}
        maxLength={50}
        error={formSubmitAttempted && !form.accountHolderName ? "Account holder name is required." : ""}
      />

      {/* Routing Number */}
      <FormField
        label="Routing Number"
        type="text"
        inputMode="numeric"
        required
        value={form.routingNumber}
        placeHolder="#########"
        onChange={(e) => handleChange("routingNumber", formatRoutingNumber(e.target.value))}
        maxLength={9}
        error={formSubmitAttempted && !form.routingNumber ? "Routing number is required." : ""}
      />

      {/* Account Number */}
      <FormField
        label="Account Number"
        type="text"
        inputMode="numeric"
        required
        value={form.accountNumber}
        placeHolder="Ex. 000123456789"
        onChange={(e) => handleChange("accountNumber", formatAccountNumber(e.target.value))}
        maxLength={17}
        error={formSubmitAttempted && !form.accountNumber ? "Account number is required." : ""}
      />

      {/* Account Type */}
      <div>
        <label className="block mb-1 font-medium">Account Type</label>
        <div className="flex gap-6">
          {/* Checking */}
          <FormFieldCheckbox
            label="Checking"
            checked={form.accountType === "checking"}
            onChange={() => handleAccountTypeChange("checking")}
          />

          {/* Savings */}
          <FormFieldCheckbox
            label="Savings"
            checked={form.accountType === "savings"}
            onChange={() => handleAccountTypeChange("savings")}
          />
        </div>
      </div>
    </div>
  );
};

export default BankEntry;