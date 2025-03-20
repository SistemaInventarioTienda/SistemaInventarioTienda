import React, { useState, useEffect, useRef } from "react";
import CheckboxList from "../../components/common/CheckboxList";
import { Button } from "../../components/common";
import Modal from "../../components/modals/Modal";
import "../../pages/styles/GrantPermission.css";
import { assignPermission } from "../../api/permission";
import { useAuthPermissions } from "../../context/authPermissions";

function GrantPermissionsForm({ isOpen, onClose, user }) {
    const { loadPermissions } = useAuthPermissions();

    const modules = [
        { value: "user", label: "Usuarios" },
        { value: "product", label: "Productos" },
        { value: "categories", label: "Categorias" },
        { value: "suppliers", label: "Proveedores" },
        { value: "clients", label: "Clientes" },
        { value: "shopping", label: "Compras" },
        { value: "sales", label: "Ventas" },
        { value: "reports", label: "Reportes" },
    ];

    const [permissions, setPermissions] = useState(() => {
        return modules.reduce((acc, module) => {
            acc[module.value] = false;
            return acc;
        }, {});
    });

    const previousPermissions = useRef(permissions);

    useEffect(() => {
        if (user && user.permissions) {
            const newPermissions = modules.reduce((acc, module) => {
                const permiso = user.permissions.find(p => p.nombre === module.label);
                acc[module.value] = permiso ? permiso.estado : false;
                return acc;
            }, {});

            // Comparar newPermissions con previousPermissions
            if (JSON.stringify(newPermissions) !== JSON.stringify(previousPermissions.current)) {
                setPermissions(newPermissions);
                previousPermissions.current = newPermissions;
            }
        }
    }, [user, modules]);

    //Funcion para manejo de cambios en los checkboxes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [name]: checked,
        }));
    };

    //Funcion para enviar los permisos al back
    const handleSubmit = async (e) => {
        e.preventDefault();

        const permissionList = modules.map(module => ({
            nombre: module.label,
            estado: permissions[module.value],
        }));
        await assignPermission(user, permissionList)
        await loadPermissions();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Seleccionar permisos de usuario"
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <div className="">
                    <CheckboxList
                        options={modules}
                        selectedOptions={permissions}
                        onChange={handleCheckboxChange}
                    />
                </div>
                <div className="modal-actions">
                    <Button type="submit" onClick={handleSubmit} className="add-btn">
                        Guardar
                    </Button>
                    <Button type="button" onClick={onClose} className="close-btn">
                        Cancelar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default GrantPermissionsForm;