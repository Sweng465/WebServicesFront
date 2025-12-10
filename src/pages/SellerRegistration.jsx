import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";
import API_ENDPOINTS from "../config/api.js";
import Header from "../components/Header";
import AddressEntry from "../components/forms/AddressEntry";
import PhoneEntry from "../components/forms/PhoneEntry";
import CreditEntry from "../components/forms/CreditEntry";
import BankEntry from "../components/forms/BankEntry";
import Collapsible from "../components/forms/Collapsible";
import CollapsibleToggle from "../components/forms/CollapsibleToggle";
import FormField from "../components/forms/FormField";
import FormFieldCheckbox from "../components/forms/FormFieldCheckbox";

const SellerRegistration = () => {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

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

  const requiredFields = [
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

  const isFormValid = () => { // check if all required fields are filled
    return requiredFields.every((field) => {
      const value = form[field];
      if (field === "photoId") return value !== null; // special case for file input
      return value !== "" && value !== null && value !== undefined;
    });
  };

  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(false);
  const [step2Locked, setStep2Locked] = useState(true); // cannot toggle until ID uploaded
  const toggleStep1 = () => setStep1Open(!step1Open);
  const toggleStep2 = () => {
    if (!step2Locked) setStep2Open(!step2Open);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const MAX_FILE_MB = 1;
  const ACCEPT_TYPES = ["image/jpeg", "image/png", "image/jpg"];

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

    setStep1Open(false);      // close step 1
    setTimeout(() => { // delay so step 2 only opens once step 1 is fully collapsed
      setStep2Open(true);
      setStep2Locked(false); 
    }, 350);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitAttempted(true);

    if (!isFormValid()) {
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
        addressTypeId: 1, // stored procedure should be doing this
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

      // need service for adding business addresses

      // need services for payment information? 

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
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Step 1 */}
          <CollapsibleToggle
            title="Step 1: Identity Verification"
            isOpen={step1Open}
            onToggle={toggleStep1}
          >
            <div className="space-y-4">
              {/* Upload Photo ID */}
              {form.photoId && (
                <p className="text-sm mt-1 gap-y-2">
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
          </CollapsibleToggle>

          {/* Step 2 */}
          <CollapsibleToggle
            title="Step 2: Business Information"
            isOpen={step2Open}
            onToggle={toggleStep2} // disabled until ID uploaded
          >
            <div className="space-y-2">
              {/* Address */}
              <Collapsible title="Business Address">
                <AddressEntry form={form} handleChange={handleChange} formSubmitAttempted={formSubmitAttempted} />
              </Collapsible>

              {/* Billing Information */}
              <Collapsible title="Billing Information">
              <div className="gap-y-4">
                <label className="block mb-1">
                  <p>
                    By registering as a seller, you agree to a charge of <strong>$5 per listing</strong> you create.
                  </p>
                </label>
              </div>
                <CreditEntry form={form} handleChange={handleChange} formSubmitAttempted={formSubmitAttempted} />
              </Collapsible>

              {/* Payout Information */}
              <Collapsible title="Payout Information">
                <div className="gap-y-4">
                  <label className="block mb-1">
                    <p>
                      Payouts are sent on a <strong>weekly basis</strong>.
                    </p>
                  </label>
                </div>
                <BankEntry form={form} handleChange={handleChange} formSubmitAttempted={formSubmitAttempted} />
              </Collapsible>

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
            </div>
          </CollapsibleToggle>

          {/* Register */}
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
          
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;