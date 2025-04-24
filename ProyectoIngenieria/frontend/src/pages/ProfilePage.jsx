import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ProfileForm from "./pagesForms/ProfileForm";
import "./styles/profilePage.css"
import PageLayout from "../components/layout/PageLayout";
import { userConfig } from "../config/entities/userConfig";
import handleApiCall from "../utils/handleApiCall";

function ProfilePage() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        document.title = "Perfil";
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    
    console.log("Usuario autenticado:", user);

    const handleSubmit = async (formData) => {
        try {
            console.log("Actualizar perfil:", formData);
            
            const backendData = await userConfig.transformData.toBackend(formData);
            console.log("Respuesta del backend:", backendData);

            const userID = user.cedula;
            await handleApiCall(
                () => userConfig.api.update(userID, backendData), 
                "Perfil actualizado correctamente."
            );
            return { success: true }; 

        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            return { success: false, message: "Error al actualizar el perfil" };
        }
    };

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Perfil de Usuario</h1>
                    <p>Información acerca del usuario actual</p>
                </div>
            </div>

            <div>
                <ProfileForm 
                initialData={user} 
                handleSubmit={handleSubmit} 
                userConfig={userConfig}
                />
            </div>

        </PageLayout>
    );
}

export default ProfilePage;
