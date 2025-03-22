import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { loginUser } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import banner_bg from "/banner_bg.png"
// import banner_heart from "/banner_heart.png"
import banner_man from "/banner_man.png"
import ishanya_logo from "/ishanya_logo.png"
const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/";
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="flex h-screen">
      {/* Left side - hidden on mobile */}
      <div className="hidden md:flex w-[60%] bg-green-600  relative">
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
        {/* <img src={banner_heart} alt="Heart" className="absolute top-10 left-10 w-24 h-24" /> */}
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
            <h2 className="text-2xl font-bold text-green-600">Ishanya Portal Login</h2>
            <p className="mt-2 text-gray-600">Enter your credentials to access the portal</p>
          </div>
          
          <form onSubmit={handleSubmit}>
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
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
