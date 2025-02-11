import { Plus, Trash, Edit, XCircle } from 'lucide-react';
import { Alert, Button, InputButton } from '../common';
import { useContactManager } from '../../hooks/useContactManager';

import "./styles/contactManager.css";

export default function ContactManager({
    contacts: initialContacts = [],
    onContactsChange = () => { },
    type = 'phone',
    mode = 'view',
}) {
    const {
        contacts,
        newContact,
        editingIndex,
        alert,
        setNewContact,
        handleAddOrUpdateContact,
        handleEditContact,
        handleDeleteContact,
        handleCancelEdit,
    } = useContactManager(initialContacts);

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';  // Nueva variable para modo 'add'

    return (
        <div className="contacts-container">
            <label>{type === 'phone' ? 'Teléfonos' : 'Correos Electrónicos'}</label>

            {alert.show && (
                <Alert
                    type={alert.type || "warning"}
                    message={alert.message}
                    duration={3000}
                />
            )}

            {!isViewMode && (
                <div className="contact-input-group">
                    <InputButton
                        type={type === 'phone' ? 'tel' : 'email'}
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        placeholder={`Ingrese el ${type === 'phone' ? 'teléfono' : 'correo'}`}
                        inputClassName="border-custom"
                        onButtonClick={(e) => handleAddOrUpdateContact(e, type)}
                        icon={editingIndex !== null ? Edit : Plus}
                        buttonLabel={editingIndex !== null ? "Actualizar" : "Agregar"}
                    />
                    {editingIndex !== null && (
                        <Button className="btn cancel-btn" onClick={handleCancelEdit}>
                            <XCircle size={20} />
                            Cancelar la edición
                        </Button>
                    )}
                </div>
            )}

            {contacts.length > 0 && (
                <div className="contacts-table">
                    <table>
                        <thead>
                            <tr>
                                <th>{type === 'phone' ? 'Teléfono' : 'Correo'}</th>
                                {(isEditMode || isAddMode) && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact, index) => (
                                <tr key={index}>
                                    <td>{contact}</td>
                                    {(isEditMode || isAddMode) && (
                                        <td className="action-cell">
                                            {isEditMode && (  // Solo mostrar Edit en modo edit
                                                <Button
                                                    className="btn-edit-btn"
                                                    variant="ghost"
                                                    onClick={(e) => handleEditContact(e, index)}
                                                >
                                                    <Edit className="icon-cm" size={20} />
                                                </Button>
                                            )}
                                            <Button
                                                className="btn-delete-btn"
                                                variant="ghost"
                                                onClick={(e) => handleDeleteContact(e, index)}
                                            >
                                                <Trash className="icon-cm" size={20} />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}