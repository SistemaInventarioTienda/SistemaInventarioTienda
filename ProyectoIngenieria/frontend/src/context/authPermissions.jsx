import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { getMyPermission } from "../api/permission.js";

const AuthPermissionsContext = createContext();

export const useAuthPermissions = () => {
    const context = useContext(AuthPermissionsContext);
    if (!context) throw new Error("useAuthPermissions must be used within a AuthPermissionsProvider");
    return context;
};

export const AuthPermissionsProvider = ({ children }) => {
    const { user } = useAuth();
    const [permissions, setPermissions] = useState({});
    const [errors, setErrors] = useState([]);

    const loadPermissions = async () => {
        if (!user) return;
        try {
            const userPermissions = await getMyPermission(user);
            setPermissions(userPermissions);
        } catch (error) {
            console.error(error.response?.data);
            setErrors(error.response?.data);
        }
    };

    useEffect(() => {
        loadPermissions();
    }, [user]);

    return (
        <AuthPermissionsContext.Provider value={{ permissions, errors, loadPermissions }}>
            {children}
        </AuthPermissionsContext.Provider>
    );
};

export const usePermissions = () => {
    return useContext(AuthPermissionsContext);
};