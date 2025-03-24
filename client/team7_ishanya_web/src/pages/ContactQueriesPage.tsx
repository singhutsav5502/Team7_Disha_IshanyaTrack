import { useState, useEffect } from "react";
import { fetchContactQueries, resolveContactQuery } from "../api";
import { toast } from "react-toastify";
import { FiCheck, FiSearch } from "react-icons/fi";

const ContactQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch contact queries
  useEffect(() => {
    const getQueries = async () => {
      setLoading(true);
      try {
        const data = await fetchContactQueries();
        setQueries(data);
        setFilteredQueries(data);
      } catch (error) {
        console.error("Error fetching queries:", error);
        toast.error("Failed to load contact queries");
      } finally {
        setLoading(false);
      }
    };

    getQueries();
  }, []);

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
  const handleResolveQuery = async (queryId) => {
    try {
      const response = await resolveContactQuery(queryId);
      
      if (response.success) {
        toast.success("Query resolved successfully");
        // Remove the resolved query from the list
        setQueries(queries.filter(query => query.Query_ID !== queryId));
      } else {
        toast.error(response.message || "Failed to resolve query");
      }
    } catch (error) {
      console.error("Error resolving query:", error);
      toast.error("An error occurred while resolving the query");
    }
  };

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
                        <a href={`mailto:${query.Parent_Email}`} className="text-blue-600 hover:underline">
                          {query.Parent_Email}
                        </a>
                      </td>
                      <td>{query.Student_Name || "-"}</td>
                      <td>
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          {query.Query}
                        </div>
                      </td>
                      <td>
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
    </div>
  );
};

export default ContactQueriesPage;
