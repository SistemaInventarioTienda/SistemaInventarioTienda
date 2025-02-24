import React, { useState } from "react";
import CheckboxList from "../../components/common/CheckboxList";
import { Button } from "../../components/common";
import Modal from "../../components/modals/Modal";
import "../../pages/styles/GrantPermission.css";
function GrantPermissionsForm({ isOpen, onClose }) {
  const modules = [
    { value: "userModule", label: "Módulo de usuarios" },
    { value: "userSettings", label: "Configuración de usuario" },
    { value: "productModule", label: "Módulo de productos" },
    { value: "categoryModule", label: "Módulo de categorias" },
    { value: "supplierModule", label: "Módulo de proveedores" },
    { value: "customerModule", label: "Módulo de clientes" },
    { value: "salesHistory", label: "Historial de compras" },
    { value: "newSale", label: "Realizar nueva venta" },
    { value: "purchaseHistory", label: "Historial de compras" },
    { value: "newPurchase", label: "Realizar nueva compra" },
    { value: "reportModule", label: "Módulo de reportes" },
  ];

  //Estados para el manejo de los permisos seleccionados
  const [permissions, setPermissions] = useState(
    modules.reduce((acc, module) => {
      acc[module.value] = false; //Inicializa los permisos como no seleccionados
      return acc;
    }, {})
  );

  //Funcion para manejo de cambios en los checkboxes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  //Funcion para enviar los permisos al back
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Permisos seleccionados", permissions);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Seleccionar permisos de usuario"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-content">
            <CheckboxList
              options={modules}
              selectedOptions={permissions}
              onChange={handleCheckboxChange}
            />
          </div>
        {/* Botones de accion */}
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
