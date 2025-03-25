import React, { useState, useEffect } from "react";
import {
  fetchContactQueries,
  resolveContactQuery,
  scheduleAppointment,
  fetchEducators,
} from "../../api";
import { toast } from "react-toastify";
import { FiCheck, FiSearch, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { getUserType } from "../../store/slices/authSlice";
import { USER_ROLES } from "../../types";

interface Query {
  Query_ID: number;
  Parent_Name: string;
  Parent_Email: string;
  Student_Name: string;
  Query: string;
}

interface Educator {
  Employee_ID: string;
  Educator_Name: string;
  Email: string;
  Phone: string;
}

const ContactQueriesPage: React.FC = () => {
  const userType = useSelector(getUserType);
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [educators, setEducators] = useState<Educator[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [selectedEducator, setSelectedEducator] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>("");

  // Check if user has admin privileges
  const isAdminOrHigher =
    userType === USER_ROLES.ADMIN || userType === USER_ROLES.SUPERUSER;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [queriesData, educatorsData] = await Promise.all([
          fetchContactQueries(),
          fetchEducators(),
        ]);

        setQueries(queriesData);
        setFilteredQueries(queriesData);
        setEducators(educatorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (isAdminOrHigher) {
      fetchData();
    }
  }, [isAdminOrHigher]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredQueries(queries);
    } else {
      const filtered = queries.filter(
        (query) =>
          query.Parent_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.Parent_Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.Student_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.Query.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQueries(filtered);
    }
  }, [searchTerm, queries]);

  // Handle resolving a query
  const handleResolveQuery = async (queryId: number) => {
    try {
      const response = await resolveContactQuery(queryId);

      if (response.success) {
        toast.success("Query resolved successfully");
        // Remove the resolved query from the list
        setQueries(queries.filter((query) => query.Query_ID !== queryId));
      } else {
        toast.error(response.message || "Failed to resolve query");
      }
    } catch (error) {
      console.error("Error resolving query:", error);
      toast.error("An error occurred while resolving the query");
    }
  };

  // Open schedule modal
  const openScheduleModal = (query: Query) => {
    setSelectedQuery(query);
    setShowScheduleModal(true);
  };

  // Close schedule modal
  const closeScheduleModal = () => {
    setSelectedQuery(null);
    setSelectedEducator("");
    setScheduledDate(new Date());
    setNotes("");
    setShowScheduleModal(false);
  };

  // Handle scheduling appointment
  const handleScheduleAppointment = async () => {
    if (!selectedQuery || !selectedEducator || !scheduledDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formattedDate = scheduledDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const response = await scheduleAppointment(
        selectedQuery.Query_ID,
        selectedEducator,
        formattedDate,
        notes
      );

      if (response.success) {
        toast.success("Appointment scheduled successfully");
        closeScheduleModal();
      } else {
        toast.error(response.message || "Failed to schedule appointment");
      }
    }  catch (error) {
      if (error.message && error.message.includes("Network is unreachable")) {
        toast.error("Network connection issue. Please check your internet connection and try again.");
      } else {
        toast.error("Failed to schedule appointment: " + (error.message || "Unknown error"));
      }
      console.error("Detailed error:", error);
    }
  };

  if (!isAdminOrHigher) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
        <div className="alert alert-error">
          <div>
            <span>You don't have permission to view this page.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Queries</h1>

      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="form-control w-full md:w-1/3 mb-4 md:mb-0">
              <div className="input-group flex gap-5">
                <input
                  type="text"
                  placeholder="Search queries..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Queries</div>
                <div className="stat-value">{queries.length}</div>
                <div className="stat-desc">Pending resolution</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="alert alert-info shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  {searchTerm
                    ? "No queries match your search criteria."
                    : "No contact queries are currently pending."}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Parent Name</th>
                    <th>Parent Email</th>
                    <th>Student Name</th>
                    <th>Query</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.map((query) => (
                    <tr key={query.Query_ID} className="hover">
                      <td>{query.Query_ID}</td>
                      <td>{query.Parent_Name}</td>
                      <td>
                        <a
                          href={`mailto:${query.Parent_Email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {query.Parent_Email}
                        </a>
                      </td>
                      <td>{query.Student_Name || "-"}</td>
                      <td>
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          {query.Query}
                        </div>
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => openScheduleModal(query)}
                        >
                          <FiCalendar className="mr-1" />
                          Schedule
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleResolveQuery(query.Query_ID)}
                        >
                          <FiCheck className="mr-1" />
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Schedule Appointment</h2>

            <div className="mb-4">
              <p>
                <strong>Parent:</strong> {selectedQuery?.Parent_Name}
              </p>
              <p>
                <strong>Student:</strong> {selectedQuery?.Student_Name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedQuery?.Parent_Email}
              </p>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Select Educator</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedEducator}
                onChange={(e) => setSelectedEducator(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select an educator
                </option>
                {educators.map((educator) => (
                  <option
                    key={educator.Employee_ID}
                    value={educator.Employee_ID}
                  >
                    {educator.Educator_Name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mb-4 flex flex-col">
              <label className="label">
                <span className="label-text">Appointment Date & Time</span>
              </label>
              <DatePicker
                selected={scheduledDate}
                onChange={(date: Date) => setScheduledDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="input input-bordered w-full"
                minDate={new Date()}
                required
              />
            </div>

            <div className="form-control mb-6 flex flex-col">
              <label className="label">
                <span className="label-text">Notes</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Additional notes for the educator"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={closeScheduleModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleScheduleAppointment}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactQueriesPage;
