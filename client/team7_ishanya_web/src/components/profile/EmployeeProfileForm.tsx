import { USER_ROLES } from "../../types";
import {
  workLocationCollection,
  departmentCollection,
  designationCollection,
  employmentTypeCollection,
  programCollection,
  statusCollection,
  genderCollection,
} from "../../formCollections";

import { employeeSelfEditableFields } from "../../formCollections/employeeSelfEditableFields";

interface EmployeeProfileFormProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditing: boolean;
  canEdit: boolean;
  onUpdate: () => void;
  accessType: number; // Add accessType prop
}

const EmployeeProfileForm = ({
  formData,
  handleInputChange,
  isEditing,
  canEdit,
  onUpdate,
  accessType, // Receive accessType
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

  // Check if current user is the employee viewing their own profile
  const isSelfEditing = accessType === USER_ROLES.EDUCATOR && 
                        canEdit && 
                        accessType < USER_ROLES.ADMIN;

  // Function to determine if a field is editable by the current user
  const isFieldEditable = (fieldName: string) => {
    if (!isEditing) return false;
    
    // Admin and superuser can edit all fields
    if (accessType >= USER_ROLES.ADMIN) return true;
    
    // Regular employees can only edit specific fields in their own profile
    if (isSelfEditing && employeeSelfEditableFields.includes(fieldName)) return true;
    
    return false;
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
            readOnly={!isFieldEditable("Name")}
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
            disabled={!isFieldEditable("Gender")}
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
            readOnly={!isFieldEditable("Photo")}
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
            disabled={!isFieldEditable("Designation")}
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
            disabled={!isFieldEditable("Department")}
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
            disabled={!isFieldEditable("Employment_Type")}
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
            disabled={!isFieldEditable("Program")}
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
            readOnly={!isFieldEditable("Email")}
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
            readOnly={!isFieldEditable("Phone")}
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
            readOnly={!isFieldEditable("Date_of_Birth")}
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
            readOnly={!isFieldEditable("Date_of_Joining")}
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
            readOnly={!isFieldEditable("Date_of_Leaving")}
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
            disabled={!isFieldEditable("Status")}
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
            readOnly={!isFieldEditable("Tenure")}
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
            disabled={!isFieldEditable("Work_Location")}
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
            readOnly={!isFieldEditable("Emergency_Contact_Name")}
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
            readOnly={!isFieldEditable("Emergency_Contact_Number")}
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
            readOnly={!isFieldEditable("Blood_Group")}
          />
        </div>
      </div>

      {/* Update Button */}
      <div className="col-span-1 md:col-span-2">
        <button
          className={`btn btn-primary w-full mt-4 ${!isEditing ? "btn-disabled" : ""}`}
          onClick={handleUpdateClick}
          disabled={!isEditing}
        >
          Update Employee Data
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfileForm;
