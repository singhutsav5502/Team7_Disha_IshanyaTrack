import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { getUserType, getUserId } from "../store/slices/authSlice";
import { USER_ROLES } from "../types";
import { toast } from "react-toastify";
import ProfileHeader from "../components/profile/ProfileHeader.tsx";
import StudentProfileForm from "../components/profile/StudentProfileForm.tsx";
import EmployeeProfileForm from "../components/profile/EmployeeProfileForm.tsx";
import ErrorMessage from "../components/common/ErrorMessage";
import { FiEdit } from "react-icons/fi";

const ProfilePage = () => {
  const { id } = useParams<{
    id: string;
  }>();
  // TODO: FETCH USER TYPE
  const userType = 2;
  const navigate = useNavigate();

  const access_type = useSelector(getUserType);
  const access_id = useSelector(getUserId);

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Permission checks
  const canEdit = () => {
    if (access_type === null || !access_id) return false;

    if (access_type === USER_ROLES.SUPERUSER) return true;
    if (access_type === USER_ROLES.ADMIN && userType < USER_ROLES.ADMIN)
      return true;
    if (access_type === USER_ROLES.EDUCATOR) {
      if (formData?.Employee_ID == access_id) {
        return true;
      }
      return false;
    }
    return false;
  };

  const canView = () => {
    if (access_type === null || !access_id) return false;

    if (access_type === USER_ROLES.SUPERUSER) return true;
    if (access_type === USER_ROLES.ADMIN) return true;
    if (access_type === USER_ROLES.EDUCATOR) {
      if (
        (userType == 0 && profileData?.Primary_E_ID === access_id) ||
        profileData?.Secondary_E_ID === access_id
      ) {
        return true;
      }
      return false;
    }
    if (access_type === USER_ROLES.STUDENT) {
      return access_id === id;
    }
    return false;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        let response;
        if (id.startsWith("S")) {
          response = await axios.post("/get_student_by_id", { S_ID: id });
        } else if (id.startsWith("E")) {
          response = await axios.post("/get_employee_by_id", {
            Employee_ID: id,
          });
        } else {
          throw new Error("Invalid ID format");
        }

        setProfileData(response.data);
        setFormData(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile data");
        toast.error(`Failed to fetch profile data with error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      if (userType == USER_ROLES.STUDENT) {
        endpoint = "/update_student_data";
      } else if (userType >= USER_ROLES.EDUCATOR) {
        endpoint = "/update_employee_data";
      } else {
        throw new Error("Invalid ID format");
      }

      const response = await axios.post(endpoint, formData);
      if (response.data) {
        setProfileData(formData);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <ErrorMessage
        title="Error"
        message={error || "Profile not found"}
        onAction={() => navigate("/")}
        actionText="Go to Dashboard"
      />
    );
  }

  if (!canView()) {
    return (
      <ErrorMessage
        title="Unauthorized"
        message="You don't have permission to view this profile."
        onAction={() => navigate("/")}
        actionText="Go to Dashboard"
        variant="warning"
      />
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <ProfileHeader
        profileData={profileData}
        isStudent={userType==USER_ROLES.STUDENT}
        id = {id}
      />

      <div className="divider my-8"></div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          {canEdit() && (
            <button 
              className="btn btn-primary" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Editing" : (
                <>
                  <FiEdit className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          )}
        </div>

        <div className={`card bg-base-100 shadow-xl ${isEditing ? "bg-blue-50" : ""}`}>
          <div className="card-body">
            {id?.startsWith("S") ? (
              <StudentProfileForm
                formData={formData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
                canEdit={canEdit()}
                userType={access_type as number}
              />
            ) : (
              <EmployeeProfileForm
                formData={formData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
                canEdit={canEdit()}
              />
            )}
          </div>
        </div>
      </div>

      {isEditing && canEdit() && (
        <div className="flex justify-end mt-4">
          <button
            className={`btn btn-success btn-lg ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            Update Data
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
