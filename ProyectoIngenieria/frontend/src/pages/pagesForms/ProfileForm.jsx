// ProfileForm.jsx
import React, { useState } from 'react';
import { Input } from '../../components/common';
import GenericForm from '../../components/common/GenericForm';
import handleApiCall from '../../utils/handleApiCall';
const ProfileForm = ({ initialData, handleSubmit, userConfig }) => {

    const [passwordData, setPasswordData] = useState({
        id: initialData.cedula,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    console.log("Datos iniciales del formulario[ID]:", passwordData.cedula);

    const handlePasswordSubmit = async (passwordData) => {
        try {
            console.log("Datos recibidos desde el form: ",passwordData);
            if (!passwordData || typeof passwordData !== "object") {
                throw new Error("Los datos recibidos son inválidos.");
            }

            const backendData = await userConfig.transformData.toBackenPassword(passwordData);
            console.log("Datos transformados para el backend:", backendData);
            
            // Enviar la solicitud al backend
            //const idUser = passwordData.id;
            await handleApiCall(
                () => userConfig.api.updataPassword(backendData),
                "Contraseña actualizada correctamente."
            );

            setPasswordData({
                id: passwordData.id, // Mantén el ID del usuario
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            
            return { success: true };

        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            return { success: false, message: "Error al actualizar la contraseña" };
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value })

    }

    
    return (
        <div className="profile-form-container">
            {/* Left Section - Current Information */}
            <div className="form-card">
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
                    onSubmit={handleSubmit}
                    submitButtonText="Modificar"
                    submitButtonClassName="submit-button"
                />
            </div>

            {/* Right Section - Password Change */}
            <div className="form-card">
                <div className="password-form">
                    <div className="profile-form-group">
                        <label>Contraseña Actual</label>
                        <Input
                            className="common-styles"
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Ingrese la contraseña actual"
                        />
                    </div>
                    <div className="profile-form-group">
                        <label>Contraseña Nueva</label>
                        <Input
                            className="common-styles"
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Ingrese la nueva contraseña"
                        />
                    </div>
                    <div className="profile-form-group">
                        <label>Confirmar Contraseña</label>
                        <Input
                            className="common-styles"
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Vuelva a ingresar la nueva contraseña"
                        />
                    </div>
                                                                {/* handleSubmit */}
                    <button className="submit-button" onClick={(e) => {
                        e.preventDefault();
                        handlePasswordSubmit(passwordData)
                        }}
                        > 
                        Actualizar Contraseña
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileForm