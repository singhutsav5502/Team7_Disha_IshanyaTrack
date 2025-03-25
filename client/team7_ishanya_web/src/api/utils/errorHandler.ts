export const handleApiError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    // Return standardized error object
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An unknown error occurred',
      status: error.response?.status || 500
    };
  };
  