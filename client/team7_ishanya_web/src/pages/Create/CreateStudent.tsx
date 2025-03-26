import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  genderCollection,
  primaryDiagnosisCollection,
  comorbidityCollection,
  enrollmentYearCollection,
  timingsCollection,
  daysOfWeekCollection,
  sessionTypeCollection,
} from "../../formCollections";
import { create_new_student } from "../../api";
const CreateStudentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    Photo: "",
    Gender: "",
    DOB: "",
    Primary_Diagnosis: "",
    Comorbidity: "",
    UDID: "",
    Enrollment_Year: "",
    Status: "Active",
    Email: "",
    Sessions: "",
    Timings: "",
    Days_of_Week: "",
    Primary_E_ID: "",
    Secondary_E_ID: "",
    Session_Type: "",
    Father: "",
    Mother: "",
    Blood_Grp: "",
    Allergies: "",
    Contact_No: "",
    Alt_Contact_No: "",
    Parent_Email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await create_new_student(formData);
  
      if (response.success) {
        toast.success("Student created successfully!");
        navigate("/manage-students");
      } else {
        // Handle unsuccessful response
        toast.error(response.message || "Failed to create student");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.message && errorData.message.includes("parent email already exists")) {
          toast.error("A student with this parent email already exists. Please use a different email address.");
        } else if (errorData.message && errorData.message.includes("Database integrity error")) {
          toast.error("Database error occurred. Please try again or contact support.");
        } else {
          toast.error(errorData.message || "An error occurred while creating the student");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Student</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="Fname"
                    value={formData.Fname}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="Lname"
                    value={formData.Lname}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Photo URL</span>
                  </label>
                  <input
                    type="text"
                    name="Photo"
                    value={formData.Photo}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    {genderCollection.items.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Primary Diagnosis</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Primary_Diagnosis"
                    value={formData.Primary_Diagnosis}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select primary diagnosis
                    </option>
                    {primaryDiagnosisCollection.items.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Comorbidity</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Comorbidity"
                    value={formData.Comorbidity}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select comorbidity
                    </option>
                    {comorbidityCollection.items.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">UDID</span>
                  </label>
                  <input
                    type="text"
                    name="UDID"
                    value={formData.UDID}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Enrollment Year</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Enrollment_Year"
                    value={formData.Enrollment_Year}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select enrollment year
                    </option>
                    {enrollmentYearCollection.items.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Sessions per Week</span>
                  </label>
                  <input
                    type="number"
                    name="Sessions"
                    value={formData.Sessions}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Timings</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Timings"
                    value={formData.Timings}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select timings
                    </option>
                    {timingsCollection.items.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Days of Week</span>
                  </label>
                  <div className="border rounded-lg p-2 grid grid-cols-3 gap-2">
                    {daysOfWeekCollection.items.map((item) => (
                      <div key={item.value} className="form-control">
                        <label className="cursor-pointer label justify-start">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary mr-2"
                            checked={formData.Days_of_Week?.split(
                              ", "
                            ).includes(item.value)}
                            onChange={(e) => {
                              const currentValues = formData.Days_of_Week
                                ? formData.Days_of_Week.split(", ")
                                : [];
                              let newValues;

                              if (e.target.checked) {
                                newValues = [...currentValues, item.value];
                              } else {
                                newValues = currentValues.filter(
                                  (val) => val !== item.value
                                );
                              }

                              const syntheticEvent = {
                                target: {
                                  name: "Days_of_Week",
                                  value: newValues.join(", "),
                                },
                              } as React.ChangeEvent<HTMLSelectElement>;

                              handleInputChange(syntheticEvent);
                            }}
                          />
                          <span className="label-text">{item.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Session Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Session_Type"
                    value={formData.Session_Type}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select session type
                    </option>
                    {sessionTypeCollection.items.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Primary Educator ID</span>
                  </label>
                  <input
                    type="text"
                    name="Primary_E_ID"
                    value={formData.Primary_E_ID}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Secondary Educator ID</span>
                  </label>
                  <input
                    type="text"
                    name="Secondary_E_ID"
                    value={formData.Secondary_E_ID}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Father's Name</span>
                  </label>
                  <input
                    type="text"
                    name="Father"
                    value={formData.Father}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Mother's Name</span>
                  </label>
                  <input
                    type="text"
                    name="Mother"
                    value={formData.Mother}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Blood Group</span>
                  </label>
                  <input
                    type="text"
                    name="Blood_Grp"
                    value={formData.Blood_Grp}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Allergies</span>
                  </label>
                  <input
                    type="text"
                    name="Allergies"
                    value={formData.Allergies}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Contact Number</span>
                  </label>
                  <input
                    type="text"
                    name="Contact_No"
                    value={formData.Contact_No}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">
                      Alternative Contact Number
                    </span>
                  </label>
                  <input
                    type="text"
                    name="Alt_Contact_No"
                    value={formData.Alt_Contact_No}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Parent Email</span>
                  </label>
                  <input
                    type="email"
                    name="Parent_Email"
                    value={formData.Parent_Email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className={`btn btn-primary text-white w-full ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Student"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudentPage;
