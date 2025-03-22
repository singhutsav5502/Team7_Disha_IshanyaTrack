import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="flex flex-col items-center justify-center text-center gap-6 max-w-md mx-auto">
        <div className="bg-error/10 p-4 rounded-full mb-2">
          <img 
            src="/assets/images/lock-icon.svg" 
            alt="Unauthorized access" 
            className="w-24 h-24"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-700">
          Access Restricted
        </h1>
        
        <p className="text-lg text-gray-600 max-w-[500px]">
          You don't have permission to view this page. Please return to the Dashboard or contact your administrator if you believe this is a mistake.
        </p>
        
        <button 
          className="btn btn-primary btn-lg mt-4"
          onClick={() => navigate("/")}
        >
          Return to Dashboard
        </button>
        
        <p className="text-sm text-gray-500 mt-8">
          Error code: 401 Unauthorized
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
