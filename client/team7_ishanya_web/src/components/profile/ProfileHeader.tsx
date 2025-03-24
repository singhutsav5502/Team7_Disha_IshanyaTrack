import { useEffect, useState } from "react";
// import { fetchStudentImage, fetchEmployeeImage } from "../../api";
interface ProfileHeaderProps {
  profileData: any;
  isStudent: boolean | undefined;
  id: string | undefined;
}

const ProfileHeader = ({ profileData, isStudent, id }: ProfileHeaderProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // useEffect(() => {
  //   const fetchProfileImage = async () => {
  //     if (!id) return;

  //     setLoading(true);
  //     try {
  //       const imageUrl = isStudent
  //         ? await fetchStudentImage(id)
  //         : await fetchEmployeeImage(id);

  //       setImageUrl(imageUrl);
  //     } catch (error) {
  //       console.error("Failed to fetch profile image:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfileImage();
  // }, [id, isStudent]);
  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold mb-2 overflow-y-hidden">
            {isStudent
              ? `${profileData.Fname} ${profileData.Lname}'s Profile`
              : `${profileData.Name}'s Profile`}
          </h1>
          <p className="text-gray-600 text-lg">
            {isStudent
              ? `Student ID: ${profileData.S_ID}`
              : `Employee ID: ${profileData.Employee_ID}`}
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {loading ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt="Profile" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content">
                  <span className="text-2xl font-bold">
                    {isStudent ? (
                      <img
                        src={`https://avatar.iran.liara.run/public/${profileData.Gender === "Male" ? "boy" : profileData.Gender === "Female" ? "girl" : "girl"}?username=[${profileData.Fname?.[0]}${profileData.Lname?.[0]}]`}
                        alt="avatar-image"
                      />
                    ) : (
                      <img
                        src={`https://avatar.iran.liara.run/public/${profileData.Gender === "Male" ? "boy" : profileData.Gender === "Female" ? "girl" : "girl"}?username=[${profileData.Name}]`}
                        alt="avatar-image"
                      />
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
