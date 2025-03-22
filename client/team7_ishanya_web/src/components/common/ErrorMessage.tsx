interface ErrorMessageProps {
  title: string;
  message: string;
  onAction: () => void;
  actionText: string;
  variant?: "error" | "warning";
}

const ErrorMessage = ({ 
  title, 
  message, 
  onAction, 
  actionText, 
  variant = "error" 
}: ErrorMessageProps) => {
  const alertClass = variant === "error" ? "alert-error" : "alert-warning";
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className={`alert ${alertClass} shadow-lg`}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">{title}</h3>
            <div className="text-xs">{message}</div>
          </div>
        </div>
        <div className="flex-none">
          <button className="btn btn-sm" onClick={onAction}>
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
