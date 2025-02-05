// ProfileForm.jsx
import React, { useState } from 'react';
import { Input } from '../../components/common';
import GenericForm from '../../components/common/GenericForm';
const ProfileForm = ({ initialData, handleSubmit }) => {

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

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
                    <button className="submit-button" onClick={handleSubmit}>
                        Actualizar Contraseña
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileForm