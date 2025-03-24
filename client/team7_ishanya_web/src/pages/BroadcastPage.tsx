import { useState, useEffect } from "react";
import {
  fetchStudents,
  sendAppNotifications,
  sendEmailBroadcast,
} from "../api";
import { toast } from "react-toastify";

const BroadcastPage = () => {
  const [appNotification, setAppNotification] = useState({
    title: "",
    body: "",
    selectedStudents: [],
  });

  const [emailBroadcast, setEmailBroadcast] = useState({
    subject: "",
    body: "",
    sendToStudentParents: false,
    sendToEmployees: false,
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("app");

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentsData = await fetchStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error("Error loading students:", error);
        toast.error("Failed to load students data");
      }
    };

    loadData();
  }, []);

  const handleAppNotificationChange = (e) => {
    const { name, value } = e.target;
    setAppNotification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailBroadcastChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailBroadcast((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStudentSelection = (studentId) => {
    setAppNotification((prev) => {
      const isSelected = prev.selectedStudents.includes(studentId);
      if (isSelected) {
        return {
          ...prev,
          selectedStudents: prev.selectedStudents.filter(
            (id) => id !== studentId
          ),
        };
      } else {
        return {
          ...prev,
          selectedStudents: [...prev.selectedStudents, studentId],
        };
      }
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setAppNotification((prev) => ({
        ...prev,
        selectedStudents: students.map((student) => student.S_ID),
      }));
    } else {
      setAppNotification((prev) => ({
        ...prev,
        selectedStudents: [],
      }));
    }
  };

  const sendNotifications = async () => {
    if (!appNotification.title || !appNotification.body) {
      toast.error("Please provide both title and body for the notification");
      return;
    }

    if (appNotification.selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setLoading(true);
    try {
      const response = await sendAppNotifications(
        appNotification.selectedStudents,
        appNotification.title,
        appNotification.body
      );

      if (response.successful_notifications.length > 0) {
        toast.success(`Successfully sent ${response.successful_notifications.length} notifications`);
      }
      
      if (response.failed_notifications.length > 0) {
        toast.warning(`Failed to send ${response.failed_notifications.length} notifications`);
        // console.warn("Failed notifications:", response.failed_notifications);
      }

      setAppNotification({
        title: "",
        body: "",
        selectedStudents: [],
      });
      setSelectAll(false);
    } catch (error) {
      console.error("Error sending app notifications:", error);
      toast.error("Failed to send app notifications");
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async () => {
    if (!emailBroadcast.subject || !emailBroadcast.body) {
      toast.error("Please provide both subject and body for the email");
      return;
    }

    if (
      !emailBroadcast.sendToStudentParents &&
      !emailBroadcast.sendToEmployees
    ) {
      toast.error("Please select at least one recipient group");
      return;
    }

    setLoading(true);
    try {
      await sendEmailBroadcast(
        emailBroadcast.subject,
        emailBroadcast.body,
        emailBroadcast.sendToStudentParents,
        emailBroadcast.sendToEmployees
      );

      toast.success("Email broadcast sent successfully!");
      setEmailBroadcast({
        subject: "",
        body: "",
        sendToStudentParents: false,
        sendToEmployees: false,
      });
    } catch (error) {
      console.error("Error sending email broadcast:", error);
      toast.error("Failed to send email broadcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Broadcast Center</h1>

      <div className="tabs tabs-boxed bg-base-200 mb-6">
        <a
          className={`tab tab-lg ${activeTab === "app" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("app")}
        >
          App Notifications
        </a>
        <a
          className={`tab tab-lg ${activeTab === "email" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("email")}
        >
          Email Broadcasts
        </a>
      </div>

      <div className="space-y-8">
        {activeTab === "app" ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                Send App Notifications
              </h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Notification Title
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={appNotification.title}
                  onChange={handleAppNotificationChange}
                  placeholder="Enter notification title"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control mt-4 flex flex-col">
                <label className="label">
                  <span className="label-text font-medium">
                    Notification Body
                  </span>
                </label>
                <textarea
                  name="body"
                  value={appNotification.body}
                  onChange={handleAppNotificationChange}
                  placeholder="Enter notification content"
                  className="textarea textarea-bordered"
                  rows={4}
                ></textarea>
              </div>

              <div className="form-control mt-6">
                <label className="label">
                  <span className="label-text font-medium">
                    Select Recipients
                  </span>
                </label>

                <div className="bg-base-200 p-4 rounded-lg">
                  <label className="cursor-pointer label justify-start">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-2"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="label-text">Select All Students</span>
                  </label>

                  <div className="mt-4 max-h-60 overflow-y-auto">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <label
                          key={student.S_ID}
                          className="cursor-pointer label justify-start p-5 min-w-[250px]"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm checkbox-primary mr-2"
                            checked={appNotification.selectedStudents.includes(
                              student.S_ID
                            )}
                            onChange={() =>
                              handleStudentSelection(student.S_ID)
                            }
                          />
                          <span className="label-text">
                            {student.Fname} {student.Lname} ({student.S_ID})
                          </span>
                        </label>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        Loading students...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                className={`btn btn-primary btn-lg w-full mt-6 ${loading ? "loading" : ""}`}
                onClick={sendNotifications}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Notifications"}
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Send Email Broadcast</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email Subject</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={emailBroadcast.subject}
                  onChange={handleEmailBroadcastChange}
                  placeholder="Enter email subject"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control mt-4 flex flex-col">
                <label className="label">
                  <span className="label-text font-medium">Email Body</span>
                </label>
                <textarea
                  name="body"
                  value={emailBroadcast.body}
                  onChange={handleEmailBroadcastChange}
                  placeholder="Enter email content"
                  className="textarea textarea-bordered"
                  rows={6}
                ></textarea>
              </div>

              <div className="form-control mt-6">
                <label className="label">
                  <span className="label-text font-medium">
                    Select Recipients
                  </span>
                </label>

                <div className="bg-base-200 p-4 rounded-lg space-y-2 flex flex-col sm:flex-row justify-center items-center gap-5">
                  <label className="cursor-pointer label justify-start w-full sm:w-auto">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-2"
                      name="sendToStudentParents"
                      checked={emailBroadcast.sendToStudentParents}
                      onChange={handleEmailBroadcastChange}
                    />
                    <span className="label-text">All Student Parents</span>
                  </label>

                  <label className="cursor-pointer label justify-start w-full sm:w-auto">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-2"
                      name="sendToEmployees"
                      checked={emailBroadcast.sendToEmployees}
                      onChange={handleEmailBroadcastChange}
                    />
                    <span className="label-text">All Employees</span>
                  </label>
                </div>
              </div>

              <button
                className={`btn btn-primary btn-lg w-full mt-6 ${loading ? "loading" : ""}`}
                onClick={sendEmails}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Email Broadcast"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastPage;
