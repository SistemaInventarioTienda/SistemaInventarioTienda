// // ProfileForm.jsx
// import React, { useState } from 'react';
// import { Input } from '../../components/common';
// import GenericForm from '../../components/common/GenericForm';
// import handleApiCall from '../../utils/handleApiCall';


// const ProfileForm = ({ initialData, handleSubmit, userConfig }) => {

//     const [passwordData, setPasswordData] = useState({
//         id: initialData.cedula,
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     })

//     console.log("Datos iniciales del formulario[ID]:", passwordData.cedula);

//     const handlePasswordSubmit = async (passwordData) => {
//         try {
//             console.log("Datos recibidos desde el form: ",passwordData);
//             if (!passwordData || typeof passwordData !== "object") {
//                 throw new Error("Los datos recibidos son inválidos.");
//             }

//             const backendData = await userConfig.transformData.toBackenPassword(passwordData);
//             console.log("Datos transformados para el backend:", backendData);
            
//             // Enviar la solicitud al backend
//             //const idUser = passwordData.id;
//             await handleApiCall(
//                 () => userConfig.api.updataPassword(backendData),
//                 "Contraseña actualizada correctamente."
//             );

//             setPasswordData({
//                 id: passwordData.id, // Mantén el ID del usuario
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//             });
            
//             return { success: true };

//         } catch (error) {
//             console.error("Error al actualizar la contraseña:", error);
//             return { success: false, message: "Error al actualizar la contraseña" };
//         }
//     };

//     const handlePasswordChange = (e) => {
//         setPasswordData({ ...passwordData, [e.target.name]: e.target.value })

//     }

    
//     return (
//         <div className="profile-form-container">
//             {/* Left Section - Current Information */}
//             <div className="form-card">
//                 <GenericForm
//                     profile={true}
//                     entityName={"Usuario"}
//                     mode="edit"
//                     initialData={initialData}
//                     fields={[
//                         { name: "cedula", label: "Cédula", type: "text", required: true },
//                         { name: "nombre", label: "Nombre", type: "text", required: true },
//                         { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
//                         { name: "segundoApellido", label: "Segundo Apellido", type: "text", required: true },
//                         { name: "telefono", label: "Teléfono", type: "text", required: true },
//                         { name: "correo", label: "Correo", type: "email", required: true },
//                         { name: "nombreUsuario", label: "Nombre de Usuario", type: "text", required: true },
//                     ]}
//                     onSubmit={handleSubmit}
//                     submitButtonText="Modificar"
//                     submitButtonClassName="submit-button"
//                 />
//             </div>

//             {/* Right Section - Password Change */}
//             <div className="form-card">
//                 <div className="password-form">
//                     <div className="profile-form-group">
//                         <label>Contraseña Actual</label>
//                         <Input
//                             className="common-styles"
//                             type="password"
//                             name="currentPassword"
//                             value={passwordData.currentPassword}
//                             onChange={handlePasswordChange}
//                             placeholder="Ingrese la contraseña actual"
//                         />
//                     </div>
//                     <div className="profile-form-group">
//                         <label>Contraseña Nueva</label>
//                         <Input
//                             className="common-styles"
//                             type="password"
//                             name="newPassword"
//                             value={passwordData.newPassword}
//                             onChange={handlePasswordChange}
//                             placeholder="Ingrese la nueva contraseña"
//                         />
//                     </div>
//                     <div className="profile-form-group">
//                         <label>Confirmar Contraseña</label>
//                         <Input
//                             className="common-styles"
//                             type="password"
//                             name="confirmPassword"
//                             value={passwordData.confirmPassword}
//                             onChange={handlePasswordChange}
//                             placeholder="Vuelva a ingresar la nueva contraseña"
//                         />
//                     </div>
//                                                                 {/* handleSubmit */}
//                     <button className="submit-button" onClick={(e) => {
//                         e.preventDefault();
//                         handlePasswordSubmit(passwordData)
//                         }}
//                         > 
//                         Actualizar Contraseña
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ProfileForm


"use client"

// ProfileForm.jsx
import { useState } from "react"
import { Input } from "../../components/common"
import GenericForm from "../../components/common/GenericForm"
import handleApiCall from "../../utils/handleApiCall"

const ProfileForm = ({ initialData, onSubmit, userConfig, showProfileForm = true, showPasswordForm = true }) => {
    const [passwordData, setPasswordData] = useState({
        id: initialData?.cedula,//id
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const handlePasswordSubmit = async (passwordData) => {
        try {
            console.log("Datos recibidos desde el form: ", passwordData)
            if (!passwordData || typeof passwordData !== "object") {
                throw new Error("Los datos recibidos son inválidos.")
            }

            const backendData = await userConfig.transformData.toBackenPassword(passwordData)
            console.log("Datos transformados para el backend:", backendData)

            await handleApiCall(() => userConfig.api.updataPassword(backendData), "Contraseña actualizada correctamente.")
           
            setPasswordData({
                id: passwordData.id, // Mantén el ID del usuario
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            
            return { success: true }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error)
            return { success: false, message: "Error al actualizar la contraseña" }
        }
    }

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
    }

    const togglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        })
    }

    return (
        <div className={showProfileForm && showPasswordForm ? "profile-form-container" : "profile-form-single"}>
            {/* Left Section - Current Information */}
            {showProfileForm && (
                <div className="">
                    <GenericForm
                        profile={true}
                        entityName={"Usuario"}
                        mode="edit"
                        initialData={initialData}
                        fields={[
                            { name: "cedula", label: "Cédula", type: "text", required: true },
                            { name: "nombre", label: "Nombre", type: "text", required: true },
                            { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
                            { name: "segundoApellido", label: "Segundo Apellido", type: "text", required: true },
                            { name: "telefono", label: "Teléfono", type: "text", required: true },
                            { name: "correo", label: "Correo", type: "email", required: true },
                            { name: "nombreUsuario", label: "Nombre de Usuario", type: "text", required: true },
                        ]}
                        onSubmit={onSubmit}
                        submitButtonText="Guardar Cambios"
                        submitButtonClassName="submit-button"
                        inputClassName="common-styles"
                    />
                </div>
            )}

            {/* Right Section - Password Change */}
            {showPasswordForm && (
                <div className="password-form">
                    <div className="profile-form-group">
                        <label>Contraseña Actual</label>
                        <div className="password-input-container">
                            <Input
                                className="common-styles"
                                type={showPassword.current ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Ingrese la contraseña actual"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => togglePasswordVisibility("current")}
                                aria-label={showPassword.current ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword.current ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                        <line x1="2" x2="22" y1="2" y2="22"></line>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="profile-form-group">
                        <label>Contraseña Nueva</label>
                        <div className="password-input-container">
                            <Input
                                className="common-styles"
                                type={showPassword.new ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Ingrese la nueva contraseña"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => togglePasswordVisibility("new")}
                                aria-label={showPassword.new ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword.new ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                        <line x1="2" x2="22" y1="2" y2="22"></line>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="password-hint">Use al menos 8 caracteres incluyendo letras y números</p>
                    </div>
                    <div className="profile-form-group">
                        <label>Confirmar Contraseña</label>
                        <div className="password-input-container">
                            <Input
                                className="common-styles"
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Vuelva a ingresar la nueva contraseña"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => togglePasswordVisibility("confirm")}
                                aria-label={showPassword.confirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword.confirm ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                        <line x1="2" x2="22" y1="2" y2="22"></line>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        className="submit-button"
                        onClick={(e) => {
                            e.preventDefault()
                            handlePasswordSubmit(passwordData)
                        }}
                    >
                        Actualizar Contraseña
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileForm
