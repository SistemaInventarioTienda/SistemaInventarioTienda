import { toast } from "sonner";

const handleApiCall = async (apiCall, successMessage = "Operación realizada exitosamente.") => {
    try {
        await apiCall();
        if (successMessage) {
            toast.success(successMessage);
        }
        return { success: true };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al realizar la operación.";
        toast.error(errorMessage);
        throw error;
    }
};

export default handleApiCall;