import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ProfileForm from "./pagesForms/ProfileForm";
import "./styles/profilePage.css"
import PageLayout from "../components/layout/PageLayout";

function ProfilePage() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        document.title = "Perfil";
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (formData, passwordData) => {
        console.log("Actualizar perfil:", formData);
        console.log("Cambiar contraseña:", passwordData);
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
                <ProfileForm initialData={user} onSubmit={handleSubmit} />
            </div>

        </PageLayout>
    );
}

export default ProfilePage;
