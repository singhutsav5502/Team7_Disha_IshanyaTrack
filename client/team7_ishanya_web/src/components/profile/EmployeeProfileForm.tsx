import {
  workLocationCollection,
  departmentCollection,
  designationCollection,
  employmentTypeCollection,
  programCollection,
  statusCollection,
  genderCollection,
} from "../../formCollections";

interface EmployeeProfileFormProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditing: boolean;
  canEdit: boolean;
  onUpdate: () => void;
}

const EmployeeProfileForm = ({
  formData,
  handleInputChange,
  isEditing,
  canEdit,
  onUpdate,
}: EmployeeProfileFormProps) => {
  // Custom handler for Select component
  const handleSelectChange = (name: string) => (value: string) => {
    // Create a synthetic event object that mimics the structure expected by handleInputChange
    const syntheticEvent = {
      target: {
        name,
        value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    handleInputChange(syntheticEvent);
  };

  const handleUpdateClick = () => {
    if (onUpdate && formData.Employee_ID) {
      onUpdate();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Employee ID</span>
          </label>
          <input
            type="text"
            name="Employee_ID"
            value={formData.Employee_ID || ""}
            className="input input-bordered w-full"
            readOnly
          />
        </div>
      </div>

      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="Name"
            value={formData.Name || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Gender || ""}
            onChange={(e) => handleSelectChange("Gender")(e.target.value)}
            disabled={!isEditing || !canEdit}
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
            <span className="label-text">Photo</span>
          </label>
          <input
            type="text"
            name="Photo"
            value={formData.Photo || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Designation || ""}
            onChange={(e) => handleSelectChange("Designation")(e.target.value)}
            disabled={!isEditing || !canEdit}
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
            value={formData.Department || ""}
            onChange={(e) => handleSelectChange("Department")(e.target.value)}
            disabled={!isEditing || !canEdit}
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
            value={formData.Employment_Type || ""}
            onChange={(e) =>
              handleSelectChange("Employment_Type")(e.target.value)
            }
            disabled={!isEditing || !canEdit}
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
            <span className="label-text">Program</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.Program || ""}
            onChange={(e) => handleSelectChange("Program")(e.target.value)}
            disabled={!isEditing || !canEdit}
          >
            <option value="" disabled>
              Select program
            </option>
            {programCollection.items.map((item) => (
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
            value={formData.Email || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Phone || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Date_of_Birth || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Date_of_Joining || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Date_of_Leaving || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
          />
        </div>
      </div>

      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.Status || ""}
            onChange={(e) => handleSelectChange("Status")(e.target.value)}
            disabled={!isEditing || !canEdit}
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
            <span className="label-text">Tenure</span>
          </label>
          <input
            type="text"
            name="Tenure"
            value={formData.Tenure || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
          />
        </div>
      </div>

      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Work Location</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.Work_Location || ""}
            onChange={(e) =>
              handleSelectChange("Work_Location")(e.target.value)
            }
            disabled={!isEditing || !canEdit}
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
            value={formData.Emergency_Contact_Name || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Emergency_Contact_Number || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
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
            value={formData.Blood_Group || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isEditing || !canEdit}
          />
        </div>
      </div>

      {/* Update Button */}
      <div className="col-span-1 md:col-span-2">
        <button
          className={`btn btn-primary w-full mt-4 ${!isEditing || !canEdit ? "btn-disabled" : ""}`}
          onClick={handleUpdateClick}
          disabled={!isEditing || !canEdit}
        >
          Update Employee Data
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfileForm;
