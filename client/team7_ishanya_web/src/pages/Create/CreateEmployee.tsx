import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  workLocationCollection,
  departmentCollection,
  designationCollection,
  employmentTypeCollection,
  statusCollection,
  genderCollection,
} from "../../formCollections";
import { create_new_employee } from "../../api";
const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Gender: "",
    Photo: "",
    Designation: "",
    Department: "",
    Employment_Type: "",
    Email: "",
    Phone: "",
    Date_of_Birth: "",
    Date_of_Joining: "",
    Date_of_Leaving: "",
    Status: "Active",
    Tenure: "",
    Work_Location: "",
    Emergency_Contact_Name: "",
    Emergency_Contact_Number: "",
    Blood_Group: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await create_new_employee(formData);

      if (response.success) {
        toast.success("Employee created successfully!");
        navigate("/manage-employees");
      } else {
        toast.error(`Failed to create employee: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error creating employee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Employee</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
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
                    <span className="label-text">Designation</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Designation"
                    value={formData.Designation}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select designation
                    </option>
                    {designationCollection.items.map((item) => (
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
                    <span className="label-text">Department</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Department"
                    value={formData.Department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select department
                    </option>
                    {departmentCollection.items.map((item) => (
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
                    <span className="label-text">Employment Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Employment_Type"
                    value={formData.Employment_Type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select employment type
                    </option>
                    {employmentTypeCollection.items.map((item) => (
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
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="text"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    name="Date_of_Birth"
                    value={formData.Date_of_Birth}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Date of Joining</span>
                  </label>
                  <input
                    type="date"
                    name="Date_of_Joining"
                    value={formData.Date_of_Joining}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Date of Leaving</span>
                  </label>
                  <input
                    type="date"
                    name="Date_of_Leaving"
                    value={formData.Date_of_Leaving}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Optional for new employees
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    {statusCollection.items.map((item) => (
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
                    <span className="label-text">Work Location</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Work_Location"
                    value={formData.Work_Location}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select work location
                    </option>
                    {workLocationCollection.items.map((item) => (
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
                    <span className="label-text">Emergency Contact Name</span>
                  </label>
                  <input
                    type="text"
                    name="Emergency_Contact_Name"
                    value={formData.Emergency_Contact_Name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Emergency Contact Number</span>
                  </label>
                  <input
                    type="text"
                    name="Emergency_Contact_Number"
                    value={formData.Emergency_Contact_Number}
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
                    name="Blood_Group"
                    value={formData.Blood_Group}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
