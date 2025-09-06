import React, { useEffect, useState } from "react";
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
    const [activeTab, setActiveTab] = useState("personal");

    useEffect(() => {
        document.title = "Perfil";
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const formatDate = (isoDate) => {
        if (!isoDate) return ""; // Manejo de valores nulos o vacíos
        const date = new Date(isoDate);
        return date.toLocaleDateString("es-ES", { day: "numeric", month: "numeric", year: "numeric" });
      };

 

    const handleSubmit = async (formData) => {
        try {
 

            const backendData = await userConfig.transformData.toBackend(formData);
 

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

            <div className="profile-content">
                <div className="profile-layout">
                    {/* Sidebar con información del usuario */}
                    <div className="profile-sidebar">
                        <div className="form-card profile-info-card">
                            <div className="profile-card-header">
                                <h2>Mi perfil</h2>
                            </div>
                            <div className="profile-card-content">
                                <div className="profile-avatar">
                                    <span className="avatar-icon">
                                        {/* Icono de usuario */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </span>
                                </div>
                                <p className="profile-name">{user?.nombre || "Usuario"}</p>
                                <p className="profile-email">{user?.correo || "correo@ejemplo.com"}</p>
                            </div>
                        </div>

                        <div className="form-card profile-info-card">
                            <div className="profile-card-header">
                                <h2>Información adicional</h2>
                            </div>
                            <div className="profile-card-content">
                                <div className="info-item">
                                    <span className="info-label">Fecha de registro</span>
                                    <span className="info-value">{formatDate(user?.fechaCreacion)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Rol</span>
                                    <span className="info-value">{user?.rol.nombre}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Descripción     </span>
                                    <span className="info-value">{user?.rol.descripcion}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal con pestañas */}
                    <div className="profile-main">
                        <div className="profile-tabs">
                            <div className="profile-tab-list">
                                <button
                                    className={activeTab === "personal" ? "tab-active" : ""}
                                    onClick={() => setActiveTab("personal")}
                                >
                                    Datos Personales
                                </button>
                                <button
                                    className={activeTab === "seguridad" ? "tab-active" : ""}
                                    onClick={() => setActiveTab("seguridad")}
                                >
                                    Seguridad
                                </button>
                            </div>

                            <div className="profile-tab-content">
                                {activeTab === "personal" && (
                                    <div className="form-card">
                                        <div className="profile-card-header">
                                            <h2>Datos Personales</h2>
                                            <p>Actualiza tu información personal</p>
                                        </div>
                                        <div className="profile-card-content">
                                            <ProfileForm
                                                initialData={user}
                                                onSubmit={handleSubmit}
                                                userConfig={userConfig}
                                                showPasswordForm={false}
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "seguridad" && (
                                    <div className="form-card">
                                        <div className="profile-card-header">
                                            <h2>Cambiar Contraseña</h2>
                                            <p>Actualiza tu contraseña para mantener segura tu cuenta</p>
                                        </div>
                                        <div className="profile-card-content">
                                            <ProfileForm
                                                initialData={user}
                                                onSubmit={handleSubmit}
                                                userConfig={userConfig}
                                                showProfileForm={false}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default ProfilePage
