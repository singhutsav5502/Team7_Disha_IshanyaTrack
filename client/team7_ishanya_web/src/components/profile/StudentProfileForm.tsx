import { USER_ROLES } from "../../types";
import {
  genderCollection,
  primaryDiagnosisCollection,
  comorbidityCollection,
  enrollmentYearCollection,
  statusCollection,
  programCollection,
  timingsCollection,
  daysOfWeekCollection,
  sessionTypeCollection,
} from "../../formCollections";
import { studentEditableFields } from "../../formCollections/studentEditableFields";
interface StudentProfileFormProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditing: boolean;
  canEdit: boolean;
  accessType: number;
  onUpdate: () => void;
}

const StudentProfileForm = ({
  formData,
  handleInputChange,
  isEditing,
  canEdit,
  accessType,
  onUpdate,
}: StudentProfileFormProps) => {
  // Custom handler for Select component
  const handleSelectChange = (name: string) => (details: any) => {
    const syntheticEvent = {
      target: {
        name,
        value: details.value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    handleInputChange(syntheticEvent);
  };

  const handleUpdateClick = () => {
    if (onUpdate && formData.S_ID) {
      onUpdate();
    }
  };

  const isStudent = accessType  === USER_ROLES.STUDENT;

  // Function to determine if a field is editable by the current user
  const isFieldEditable = (fieldName: string) => {
    if (!isEditing) return false;
    if (!isStudent && canEdit && accessType>USER_ROLES.EDUCATOR) return true;
    if (isStudent && studentEditableFields.includes(fieldName)) return true;
    return false;
  };
  canEdit = canEdit &&  (!isStudent && accessType>USER_ROLES.EDUCATOR);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Student ID</span>
          </label>
          <input
            type="text"
            name="S_ID"
            value={formData.S_ID || ""}
            className="input input-bordered w-full"
            readOnly
          />
        </div>
      </div>

      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            name="Fname"
            value={formData.Fname || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isFieldEditable("Fname")}
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
            value={formData.Lname || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isFieldEditable("Lname")}
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
            <span className="label-text">Date of Birth</span>
          </label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isFieldEditable("DOB")}
          />
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
            <span className="label-text">Blood Group</span>
          </label>
          <input
            type="text"
            name="Blood_Grp"
            value={formData.Blood_Grp || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!isFieldEditable("Blood_Grp")}
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
            value={formData.Primary_Diagnosis || ""}
            onChange={(e) =>
              handleSelectChange("Primary_Diagnosis")(e.target.value)
            }
            disabled={!canEdit}
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
            value={formData.Comorbidity || ""}
            onChange={(e) => handleSelectChange("Comorbidity")(e.target.value)}
            disabled={!canEdit}
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
            value={formData.UDID || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!canEdit}
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
            value={formData.Enrollment_Year || ""}
            onChange={(e) =>
              handleSelectChange("Enrollment_Year")(e.target.value)
            }
            disabled={!canEdit}
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
            {/* TODO: QUERY TABLE FOR STUDENT -> PROGRAM map */}
      {/* <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Program</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.Program_ID || ""}
            onChange={(e) => handleSelectChange("Program_ID")(e.target.value)}
            disabled={!canEdit}
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
            <span className="label-text">Program 2</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.Program2_ID || ""}
            onChange={(e) => handleSelectChange("Program2_ID")(e.target.value)}
            disabled={!canEdit}
          >
            <option value="" disabled>
              Select secondary program
            </option>
            {programCollection.items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Timings</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.Timings || ""}
            onChange={(e) => handleSelectChange("Timings")(e.target.value)}
            disabled={!canEdit}
          >
            <option value="" disabled>
              Select timing
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
          <select
            className="select select-bordered w-full"
            value={formData.Days_of_Week || ""}
            onChange={(e) => handleSelectChange("Days_of_Week")(e.target.value)}
            disabled={!canEdit}
          >
            <option value="" disabled>
              Select days
            </option>
            {daysOfWeekCollection.items.map((item) => (
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
            <span className="label-text">Session Type</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.Session_Type || ""}
            onChange={(e) => handleSelectChange("Session_Type")(e.target.value)}
            disabled={!canEdit}
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
            value={formData.Primary_E_ID || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!canEdit}
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
            value={formData.Secondary_E_ID || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            readOnly={!canEdit}
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
            value={formData.Father || ""}
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
            value={formData.Mother || ""}
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
            value={formData.Allergies || ""}
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
            value={formData.Contact_No || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Alternate Contact Number</span>
          </label>
          <input
            type="text"
            name="Alt_Contact_No"
            value={formData.Alt_Contact_No || ""}
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
            value={formData.Parent_Email || ""}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Update Button - Only show if user can edit something */}
      {(canEdit || isStudent) && (
        <div className="col-span-1 md:col-span-2">
          <button
            className={`btn btn-primary w-full mt-4 ${isEditing ? "" : "btn-disabled"}`}
            onClick={handleUpdateClick}
            disabled={!isEditing}
          >
            Update Student Data
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentProfileForm;
