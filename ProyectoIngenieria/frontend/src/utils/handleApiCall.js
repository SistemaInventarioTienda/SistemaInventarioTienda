const handleApiCall = async (apiCall, successMessage, showAlert) => {
    try {
        await apiCall();
        showAlert(successMessage, "success");
        return { success: true };
    } catch (error) {
        showAlert(
            error.response?.data?.message || "Error al realizar la operación.",
            "error"
        );
        throw error;
    }
};

export default handleApiCall;
