import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { getAllPermission } from "../api/permission.js";

const AuthPermissionsContext = createContext();

export const useAuthPermissions = () => {
    const context = useContext(AuthPermissionsContext);
    if (!context) throw new Error("useAuthPermissions must be used within a AuthPermissionsProvider");
    return context;
};

export const AuthPermissionsProvider = ({ children }) => {
    const { user } = useAuth();
    const [permissions, setPermissions] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (!user) return;

        const loadPermissions = async (user) => {
            try {
                const userPermissions = await getAllPermission(user);
                setPermissions(userPermissions);
            } catch (error) {
                console.error(error.response.data);
                setErrors(error.response.data);
            }
        }

        loadPermissions();
    }, [user]);

    return (
        <AuthPermissionsContext.Provider value={{ permissions, errors }}>
            {children}
        </AuthPermissionsContext.Provider>
    );

};

export const usePermissions = () => {
    return useContext(AuthPermissionsContext);
};