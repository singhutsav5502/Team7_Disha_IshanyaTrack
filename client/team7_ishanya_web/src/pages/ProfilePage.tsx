import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserType, getUserId } from "../store/slices/authSlice";
import { USER_ROLES } from "../types";
import { toast } from "react-toastify";
import ProfileHeader from "../components/profile/ProfileHeader.tsx";
import StudentProfileForm from "../components/profile/StudentProfileForm.tsx";
import EmployeeProfileForm from "../components/profile/EmployeeProfileForm.tsx";
import { FiEdit } from "react-icons/fi";
import {
  fetchProfileData,
  fetchUserType,
  updateProfileData,
} from "../api/index.ts";

const ProfilePage = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const [userType, setUserType] = useState<number>(null);

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
    if (access_type === USER_ROLES.STUDENT && access_id === id) return true;
    return false;
  };

  const [userTypeLoading, setUserTypeLoading] = useState(true);

  useEffect(() => {
    const getUserTypeData = async () => {
      if (!id) {
        setUserTypeLoading(false);
        return;
      }

      try {
        const data = await fetchUserType(id);
        setUserType(data.type);
      } catch (err) {
        console.error("Error getting user type:", err);
        // Fallback to default user type
        setUserType(0); // STUDENT as default
      } finally {
        setUserTypeLoading(false);
      }
    };

    getUserTypeData();
  }, [id]);

  useEffect(() => {
    // Only run this effect if userType is loaded (not in loading state)
    if (userTypeLoading) {
      return;
    }

    const loadProfileData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await fetchProfileData(id, userType);
        setProfileData(data);
        setFormData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch profile data");
        toast.error(`Failed to fetch profile data with error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [id, userType, userTypeLoading]);

  const canView = () => {
    // If still loading data, don't make a decision yet
    if (userTypeLoading || loading) {
      return true; // Return true to prevent premature navigation
    }

    if (access_type === null || !access_id) return false;

    if (access_type === USER_ROLES.SUPERUSER) return true;
    if (access_type === USER_ROLES.ADMIN) return true;
    if (access_type === USER_ROLES.EDUCATOR) {
      if (
        (userType === 0 && profileData?.Primary_E_ID === access_id) ||
        profileData?.Secondary_E_ID === access_id
      ) {
        return true;
      }
      if(userType === access_type) return true;
      return false;
    }
    if (access_type === USER_ROLES.STUDENT) {
      return access_id === id;
    }
    return false;
  };

  // Use a separate effect for navigation to avoid race conditions
  useEffect(() => {
    // Only check authorization after all data is loaded
    if (!userTypeLoading && !loading && !canView()) {
      navigate("/Unauthorized");
    }
  }, [userTypeLoading, loading, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await updateProfileData(id, userType, formData);
      setProfileData(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
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
    toast.error(error || "Profile not found");
    navigate("/");
    return <></>;
  }

  return (
    <div className="container mx-auto py-10 px-10">

        <ProfileHeader
          profileData={profileData}
          isStudent={userType == USER_ROLES.STUDENT}
          id={id}
        />
 

      <div className="divider my-8"></div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          {canEdit() && (
            <button
              className="btn btn-primary text-white"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                "Cancel Editing"
              ) : (
                <>
                  <FiEdit className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          )}
        </div>

        <div
          className={`card bg-base-100 shadow-xl ${isEditing ? "bg-blue-50" : ""}`}
        >
          <div className="card-body">
            {userType === USER_ROLES.STUDENT ? (
              <StudentProfileForm
                formData={formData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
                canEdit={canEdit()}
                onUpdate={handleSubmit}
                accessType={access_type as number}
              />
            ) : userType > USER_ROLES.STUDENT ? (
              <EmployeeProfileForm
                formData={formData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
                onUpdate={handleSubmit}
                canEdit={canEdit()}
                accessType={access_type as number}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {/* {isEditing && canEdit() && (
        <div className="flex justify-end mt-4">
          <button
            className={`btn btn-success btn-lg ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            Update Data
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ProfilePage;
