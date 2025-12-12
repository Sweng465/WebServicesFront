
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { RoutePaths } from "../general/RoutePaths.jsx";
import API_ENDPOINTS from "../config/api.js";
import Header from "../components/Header";
import AddressEntry from "../components/forms/AddressEntry";
import PhoneEntry from "../components/forms/PhoneEntry";
import CreditEntry from "../components/forms/CreditEntry";
import BankEntry from "../components/forms/BankEntry";
import FormField from "../components/forms/FormField";
import FormFieldCheckbox from "../components/forms/FormFieldCheckbox";
import { useNavigate } from "react-router-dom";

// Constants for id upload
const MAX_FILE_MB = 1;
const ACCEPT_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const requiredFields = [ // Required form fields (for isFormValid)
  "photoId",
  "name",
  "line1",
  "city",
  "state",
  "zipcode",
  "cardHolderName",
  "cardNumber",
  "expMonth",
  "expYear",
  "cvc",
  "accountHolderName",
  "routingNumber",
  "accountNumber",
  "accountType",
  "phone1",
  "phone2",
  "phone3",
  "description",
];

const steps = [ // Timeline steps
  "Verify Your Identity",
  "Business Information",
  "Billing Information",
  "Payout Information",
  "Review and Register"
];
const stepRequiredFields = { // req fields for each step
  1: ["photoId"], // Verify Identity
  2: ["name", "line1", "city", "state", "zipcode", "phone1", "phone2", "phone3", "description"], // Business Info
  3: ["cardHolderName", "cardNumber", "expMonth", "expYear", "cvc"], // Billing Info
  4: ["accountHolderName", "routingNumber", "accountNumber", "accountType"], // Payout Info
  5: [] // Review & Submit
};

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [form, setForm] = useState({
    // seller id verification
    idVerified: 0,
    photoId: null,
    // business info
    name: "",
    phone1: "",
    phone2: "",
    phone3: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipcode: "",
    isPullYourself: 0,
    description: "",
    // billing info
    cardHolderName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    // payout info
    accountHolderName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
  });



  const isFieldFilled = (field) => { // checks if field is filled (for isStepComplete and isFormValid)
    const value = form[field];
    return field === "photoId" ? value !== null : !!value;
  };

  const isStepComplete = (step) => // checks if all req fields in current step are filled
    stepRequiredFields[step].every(isFieldFilled);

  const isFormValid = () => // checks if all req fields are filled
    requiredFields.every(isFieldFilled);

  // For uploading photo id
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPT_TYPES.includes(file.type)) { // validate file type
      alert(`${file.name} is not an allowed file type.`);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) { // validate file size
      alert(`${file.name} is too large. Max size is ${MAX_FILE_MB}MB`);
      e.target.value = "";
      return;
    }

    // valid file
    setForm((prev) => ({
      ...prev,
      photoId: file,
      idVerified: 1, // automatically verify seller id
    }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitAttempted(true);

    if (!isFormValid()) { // if form isn't valid dont submit
      alert("Please fill out all required fields.");
      return;
    }

    try {
      // update user role to seller
      const roleRes = await authFetch(`${API_ENDPOINTS.USERS}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: 2 }),
      });

      const roleData = await roleRes.json();
      if (!roleRes.ok) throw new Error(roleData.message || "Error updating user role");
      console.log("User role updated:", roleData);

      // create business
      const businessPayload = {
        userId: user.id,
        isVerified: form.idVerified,
        name: form.name,
        phoneNumber: Number(`${form.phone1}${form.phone2}${form.phone3}`),
        isPullYourself: form.isPullYourself,
        description: form.description,
        disabled: 0,
      };

      const businessRes = await authFetch(API_ENDPOINTS.BUSINESSES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessPayload),
      });

      const businessData = await businessRes.json();
      if (!businessRes.ok) throw new Error(businessData.message || "Error creating business");
      console.log("Business created:", businessData);

      // create address
      const addressPayload = {
        userId: user.id,
        name: form.name,
        line1: form.line1,
        line2: form.line2 || null,
        city: form.city,
        stateId: Number(form.state), // use selected state ID from dropdown
        zipcode: Number(form.zipcode),
        countryId: 186, // stored procedure should be doing this
        addressTypeId: 3, // stored procedure should be doing this
        enabled: 1,
        disabled: 0,
      };

      const addressRes = await authFetch(API_ENDPOINTS.ADDRESS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload),
      });

      const addressData = await addressRes.json();
      if (!addressRes.ok) throw new Error(addressData.message || "Error creating address");
      console.log("Address created:", addressData);

      // need service for adding business addresses (business address table)

      // need services for payment information? 

      alert("Business successfully registered!");
      navigate(RoutePaths.SELLITEMS);
    } catch (err) {
      console.error("Registration failed:", err);
      alert(`Registration failed: ${err.message}`);
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 text-gray-800 rounded-lg mt-6">
        <h2 className="text-center text-2xl font-bold mb-4">Seller Registration</h2>

        {/* Timeline */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const completed = isStepComplete(stepNumber);
            const isNextStep = stepNumber === currentStep + 1;
            const canClick = completed || stepNumber < currentStep || (isNextStep && isStepComplete(currentStep));

            return (
              <div key={index} className="flex items-center flex-1">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full font-medium transition
            ${currentStep === stepNumber
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : completed
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            ${canClick ? "cursor-pointer" : "cursor-not-allowed"}
          `}
                  onClick={() => {
                    if (canClick) {
                      setCurrentStep(stepNumber);
                    }
                  }}
                >
                  {step}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${isStepComplete(stepNumber) ? "bg-green-600" : "bg-gray-300"}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>



        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Step 1: Verify Identity */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Text */}
              <div className="text-center items-center">
                <h3 className="text-l font-bold mb-4">Verify Your Identity</h3>
                <p className="w-3/4 mx-auto text-gray-700 mb-6">
                  In order to list items on SalvageSearch, you must provide us with a valid photo ID for
                  identity verification purposes.</p>
              </div>
              {/* Button */}
              {form.photoId && (
                <p className="text-sm text-center mt-1 gap-y-2">
                  ✅ Uploaded: {form.photoId.name}
                </p>
              )}
              <button
                type="button"
                onClick={() => document.getElementById("photo-upload").click()}
                className={`w-full p-2 font-medium rounded-md transition 
                  ${form.photoId ? "bg-gray-300 hover:bg-gray-200" : "text-white bg-blue-700 hover:bg-blue-800"}`}
              >
                {form.photoId ? "Re-upload Photo ID" : "Upload Photo ID"}
                <p
                  className={`text-xs font-normal gap-y-2
                    ${form.photoId ? "" : "text-gray-200"}`}>
                  .png, .jpg, .jpeg (Max 1 MB)
                </p>
                <input
                  id="photo-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </button>
            </div>
          )}


          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div>
              {/* Text */}
              <div className="text-center items-center">
                <h3 className="text-l font-bold mb-4">Provide Business Information</h3>
                <p className="w-3/4 mx-auto text-gray-700 mb-6">
                  Let customers get the who, where and what of your business!</p>
              </div>

              <AddressEntry form={form} handleChange={handleChange} formSubmitAttempted={formSubmitAttempted} />
              {/* Phone Number + Business Type Row */}
              <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                {/* Phone Number */}
                <div className="flex-shrink-0">
                  <PhoneEntry form={form} handleChange={handleChange} formSubmitAttempted={formSubmitAttempted} />
                </div>

                {/* Business Type */}
                <div className="flex items-start flex-1 min-w-[220px]">
                  <div>
                    <label className="block mb-1 font-medium">Type</label>
                    <FormFieldCheckbox
                      label="My Business is Pull-It-Yourself"
                      checked={form.isPullYourself === 1}
                      onChange={() =>
                        handleChange("isPullYourself", form.isPullYourself ? 0 : 1)
                      }
                      helpText="Customers must come to the yard and retrieve their purchased item(s) themselves."
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <FormField
                label="Description"
                type="text"
                as="textarea"
                required
                value={form.description}
                placeholder="Ex. Here at John’s Junk Yard, we value your junk. We treat it like gold. We offer fair prices for all of our items. Beware Billy."
                onChange={(e) => handleChange("description", e.target.value)}
                maxLength={500}
                rows={4}
                helpText="Max 500 characters."
                error={formSubmitAttempted && !form.description ? "Description is required." : ""}
              />
            </div>)}

          {/* Step 3: Billing Information */}
          {currentStep === 3 && (
            <div>
              {/* Text */}
              <div className="text-center items-center">
                <h3 className="text-l font-bold mb-4">Provide Billing Information</h3>
                <p className="w-3/4 mx-auto text-gray-700 mb-6">
                  SalvageSearch charges a fee of <strong>$35/month</strong> to businesses.</p>
              </div>

              <CreditEntry form={form} handleChange={handleChange} formSubmitAttempted={formSubmitAttempted} />
            </div>)}

          {/* Step 4: Payout Information */}
          {currentStep === 4 && (
            <div>
              {/* Text */}
              <div className="text-center items-center">
                <h3 className="text-l font-bold mb-4">Provide Billing Information</h3>
                <p className="w-3/4 mx-auto text-gray-700 mb-6">
                  Payouts for sales are sent out on a <strong>weekly</strong> basis.</p>
              </div>

              <BankEntry form={form} handleChange={handleChange} formSubmitAttempted={formSubmitAttempted} />
            </div>)}

          {/* Step 5: Review and Register */}
          {currentStep === 5 && (
            <div>
              {/* Text */}
              <div className="text-center items-center">
                <h3 className="text-l font-bold mb-4">Review and Register</h3>
                <p className="w-3/4 mx-auto text-gray-700 mb-6">
                  Ensure all information is correct before submitting.</p>
              </div>


              {/* Review Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-gray-100 p-4 rounded">
                {/* Map each field */}
                {[
                  ["Business Name", form.name],
                  ["Address Line 1", form.line1],
                  ["Address Line 2", form.line2 || "-"],
                  ["City", form.city],
                  ["State", form.state],
                  ["Zipcode", form.zipcode],
                  ["Phone Number", `(${form.phone1}) ${form.phone2}-${form.phone3}`],
                  ["Business Type", form.isPullYourself ? "Pull-It-Yourself" : "Standard"],
                  ["Description", form.description],
                  ["Card Holder Name", form.cardHolderName],
                  ["Card Number", form.cardNumber ? `**** **** **** ${form.cardNumber.slice(-4)}` : "-"],
                  ["Expiration", form.expMonth && form.expYear ? `${form.expMonth}/${form.expYear}` : "-"],
                  ["CVC", form.cvc || "-"],
                  ["Account Holder Name", form.accountHolderName],
                  ["Routing Number", form.routingNumber],
                  ["Account Number", form.accountNumber ? `****${form.accountNumber.slice(-4)}` : "-"],
                  ["Account Type", form.accountType],
                  ["Photo ID", form.photoId ? form.photoId.name : "-"],
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-300 py-1">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="text-gray-800 text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="relative group w-full">
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`w-full p-2 font-medium rounded-md transition
                ${isFormValid()
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                >
                  Register
                </button>
                {!isFormValid() && (
                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100
                transition-opacity whitespace-nowrap pointer-events-none">
                    All required fields must be filled out.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4 items-center">
            <div> { /* Back */}
              {currentStep > 1 && (
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md font-medium hover:bg-gray-200"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </button>
              )}
            </div>
            <div> { /* Next */}
              {currentStep < steps.length && (
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-white font-medium ${isStepComplete(currentStep) ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-400 cursor-not-allowed"}`}
                  onClick={() => isStepComplete(currentStep) && setCurrentStep(currentStep + 1)}
                  disabled={!isStepComplete(currentStep)}
                >
                  Next
                </button>
              )}
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;