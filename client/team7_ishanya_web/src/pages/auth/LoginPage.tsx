import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { loginUser } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import banner_bg from "/banner_bg.png"
import banner_man from "/banner_man.png"
import ishanya_logo from "/ishanya_logo.png"
import { submitContactQuery } from "../../api";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    Parent_Name: "",
    Parent_Email: "",
    Student_Name: "",
    Query: ""
  });
  const [submitting, setSubmitting] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !password) {
      toast.error("Please enter both ID and password");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ id, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactFormData.Parent_Name || !contactFormData.Parent_Email || !contactFormData.Query) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await submitContactQuery(contactFormData);
      if (response.success) {
        toast.success("Your query has been submitted successfully!");
        setContactFormData({
          Parent_Name: "",
          Parent_Email: "",
          Student_Name: "",
          Query: ""
        });
        setShowContactForm(false);
      } else {
        toast.error(response.message || "Failed to submit query");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your query");
      console.error("Contact form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - hidden on mobile */}
      <div className="hidden md:flex w-[60%] bg-green-600 relative">
        <div className="text-white z-10 p-8 self-center ">
          <h1 className="text-4xl font-bold mb-4">DISABILITY IS</h1>
          <h1 className="text-4xl font-bold mb-4">THE INABILITY TO</h1>
          <h1 className="text-4xl font-bold mb-4">SEE ABILITY</h1>
          <p className="mt-4 max-w-md">
            If you are the parent of a differently-abled individual & are looking to get the
            right intervention - Schedule an appointment with us, we can help you make the
            right decision!
          </p>
        </div>
        <img src={banner_man} alt="Man" className="absolute bottom-0 right-0 h-3/4" />
      </div>

      {/* Right side - full width on mobile */}
      <div className="w-full md:w-[40%] bg-white flex items-center justify-center"
           style={{backgroundImage: `url("${banner_bg}")`, backgroundRepeat: 'repeat'}}>
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <img 
              src={ishanya_logo} 
              alt="Ishanya India Logo" 
              className="h-20 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-green-600">
              {showContactForm ? "Contact Us" : "Ishanya Portal Login"}
            </h2>
            <p className="mt-2 text-gray-600">
              {showContactForm 
                ? "Submit your query and we'll get back to you" 
                : "Enter your credentials to access the portal"}
            </p>
          </div>
          
          {showContactForm ? (
            <form onSubmit={handleContactSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Parent_Name">
                  Parent Name *
                </label>
                <input
                  id="Parent_Name"
                  name="Parent_Name"
                  type="text"
                  value={contactFormData.Parent_Name}
                  onChange={handleContactInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Parent_Email">
                  Parent Email *
                </label>
                <input
                  id="Parent_Email"
                  name="Parent_Email"
                  type="email"
                  value={contactFormData.Parent_Email}
                  onChange={handleContactInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Student_Name">
                  Student Name
                </label>
                <input
                  id="Student_Name"
                  name="Student_Name"
                  type="text"
                  value={contactFormData.Student_Name}
                  onChange={handleContactInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter student name (if applicable)"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Query">
                  Your Query *
                </label>
                <textarea
                  id="Query"
                  name="Query"
                  value={contactFormData.Query}
                  onChange={handleContactInputChange}
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Please describe your query or concern"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-full ${submitting ? "loading" : ""}`}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Query"}
              </button>
              <div className="text-center mt-4">
                <button 
                  type="button"
                  className="text-green-600 hover:underline cursor-pointer"
                  onClick={() => setShowContactForm(false)}
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
                    User ID
                  </label>
                  <input
                    id="id"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Enter your ID"
                    autoComplete="true"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Enter your password"
                    autoComplete="true"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  Login
                </button>
              </form>
              <div className="text-center mt-4">
                <button 
                  type="button"
                  className="text-green-600 hover:underline cursor-pointer"
                  onClick={() => setShowContactForm(true)}
                >
                  Contact Us
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
