const handleApiCall = async (apiCall, successMessage, showAlert) => {
    try {
        await apiCall();
        showAlert(successMessage, "success");
    } catch (error) {
        showAlert(
            error.response?.data?.message || "Error al realizar la operación.",
            "error"
        );
    }
};

export default handleApiCall;