import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProgramData,
  refetchProgramData,
} from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import {
  addProgram,
  removeProgram,
  addEducatorToProgram,
  addStudentToProgram,
  fetchStudents,
  fetchEducatorMapping
} from "../../api";

const ManageProgramsPage: React.FC = () => {
  const dispatch = useDispatch();
  const programs = useSelector(getProgramData);
  // const programMapping = useSelector(getProgramMapping);

  const [students, setStudents] = useState<any>(null);
  const [educators, setEducators] = useState<any>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [newProgramName, setNewProgramName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedEducator, setSelectedEducator] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch students and educators
    const loadData = async () => {
      const studentsData = await fetchStudents();
      const educatorsData = await fetchEducatorMapping();

      setStudents(studentsData);
      setEducators(educatorsData);
    };

    loadData();
  }, [dispatch]);

  const handleAddProgram = async () => {
    if (!newProgramName.trim()) {
      toast.error("Program name cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      await addProgram({ Program_Name: newProgramName });
      toast.success("Program added successfully");
      setNewProgramName("");
      dispatch(refetchProgramData());
    } catch (err) {
      toast.error(`Failed to add program ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProgram = async (programId: number) => {
    if (!confirm("Are you sure you want to remove this program?")) return;
    setIsLoading(true);
    try {
      await removeProgram(programId.toString());
      toast.success("Program removed successfully");
      dispatch(refetchProgramData());
      if (selectedProgram === programId) setSelectedProgram(null);
    } catch (err) {
      toast.error(`Failed to remove program ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedProgram || !selectedStudent) {
      toast.error("Please select both a program and a student");
      return;
    }
    setIsLoading(true);
    try {
      await addStudentToProgram(selectedProgram.toString(), selectedStudent);
      toast.success("Student added to program successfully");
      setSelectedStudent("");
      dispatch(refetchProgramData());
    } catch (err) {
      toast.error("Failed to add student to program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEducator = async () => {
    if (!selectedProgram || !selectedEducator) {
      toast.error("Please select both a program and an educator");
      return;
    }
    setIsLoading(true);
    try {
      await addEducatorToProgram(selectedProgram.toString(), selectedEducator);
      toast.success("Educator added to program successfully");
      setSelectedEducator("");
      dispatch(refetchProgramData());
    } catch (err) {
      toast.error("Failed to add educator to program");
    } finally {
      setIsLoading(false);
    }
  };
  const currentProgram = programs.find((p) => p.Program_ID === selectedProgram);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Programs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-6">
              <h2 className="card-title mb-4">Add New Program</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Program Name</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter program name"
                    className="input input-bordered w-full"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value)}
                  />
                  <button
                    className={`btn btn-primary ${isLoading ? "loading" : ""} mt-2`}
                    onClick={handleAddProgram}
                    disabled={isLoading}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-6">
              <h2 className="card-title mb-4">Programs</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="py-3">ID</th>
                      <th className="py-3">Name</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programs.map((program) => (
                      <tr
                        key={program.Program_ID}
                        className={
                          selectedProgram === program.Program_ID
                            ? "bg-base-200"
                            : ""
                        }
                      >
                        <td className="py-3">{program.Program_ID}</td>
                        <td className="py-3">{program.Program_Name}</td>
                        <td className="py-3">
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() =>
                                setSelectedProgram(program.Program_ID)
                              }
                            >
                              Select
                            </button>
                            <button
                              className="btn btn-sm btn-error ml-2"
                              onClick={() =>
                                handleRemoveProgram(program.Program_ID)
                              }
                              disabled={isLoading}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          {selectedProgram ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6">
                <h2 className="card-title mb-4">
                  Program: {currentProgram?.Program_Name}
                </h2>

                <div className="divider my-6">Assign Student</div>
                <div className="form-control mb-6">
                  <label className="label mb-2">
                    <span className="label-text">Select Student</span>
                  </label>
                  <div className="input-group">
                    <select
                      className="select select-bordered w-full"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student.S_ID} value={student.S_ID}>
                          {student.Fname} {student.Lname}
                        </option>
                      ))}
                    </select>
                    <button
                      className={`btn btn-primary ${isLoading ? "loading" : ""} mt-2`}
                      onClick={handleAddStudent}
                      disabled={isLoading || !selectedStudent}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="divider my-6">Assign Educator</div>
                <div className="form-control mb-6">
                  <label className="label mb-2">
                    <span className="label-text">Select Educator</span>
                  </label>
                  <div className="input-group">
                    <select
                      className="select select-bordered w-full"
                      value={selectedEducator}
                      onChange={(e) => setSelectedEducator(e.target.value)}
                    >
                      <option value="">Select an educator</option>
                      {educators.map((educator) => (
                        <option
                          key={educator.Employee_ID}
                          value={educator.Employee_ID}
                        >
                          {educator.Educator_Name}
                        </option>
                      ))}
                    </select>
                    <button
                      className={`btn btn-primary ${isLoading ? "loading" : ""} mt-2`}
                      onClick={handleAddEducator}
                      disabled={isLoading || !selectedEducator}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="divider my-6">Current Assignments</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-4">Students</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {currentProgram?.Student_IDs.map((studentId) => (
                        <li key={studentId}>
                          {students.find((s) => s.S_ID === studentId)?.Fname}{" "}
                          {students.find((s) => s.S_ID === studentId)?.Lname} (
                          {studentId})
                        </li>
                      ))}
                      {currentProgram?.Student_IDs.length === 0 && (
                        <li className="text-gray-500">No students assigned</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-4">Educators</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {currentProgram?.Employee_IDs.map((educatorId) => (
                        <li key={educatorId}>
                          {
                            educators.find((e) => e.Employee_ID === educatorId)
                              ?.Educator_Name
                          }{" "}
                          ({educatorId})
                        </li>
                      ))}
                      {currentProgram?.Employee_IDs.length === 0 && (
                        <li className="text-gray-500">No educators assigned</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6">
                <h2 className="card-title mb-4">Program Details</h2>
                <p>Select a program to view and manage its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProgramsPage;
