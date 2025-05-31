import { toast } from "sonner";


const handleApiCallSetting = async (apiCall, successMessage = "Operación realizada exitosamente.") => {
    try {
        const response = await apiCall();
        // if (successMessage) {
        //     toast.success(successMessage);
        // }
        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al realizar la operación.";
        toast.error(errorMessage);
        throw error;
    }
};

export default handleApiCallSetting;