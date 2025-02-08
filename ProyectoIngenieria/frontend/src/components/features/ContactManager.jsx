import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Alert, Button, InputButton  } from '../common';

import "./styles/contactManager.css";

export default function ContactManager({
    contacts = [],
    onContactsChange = () => { },
    type = 'phone',
    mode = 'view'
}) {
    const [newContact, setNewContact] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '' });

    const isViewMode = mode === 'view';

    const validateContact = (contact) => {
        if (type === 'phone') {
            const phoneRegex = /^\d{8}$/;
            return phoneRegex.test(contact);
        } else if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(contact);
        }
        return false;
    };

    const handleAddContact = (e) => {
        e.preventDefault();
        if (isViewMode || !newContact.trim()) return;

        if (!validateContact(newContact)) {
            setAlert({
                show: true,
                message: type === 'phone'
                    ? 'Por favor ingrese un número de teléfono válido (8 dígitos)'
                    : 'Por favor ingrese una dirección de correo electrónico válida'
            });
            return;
        }

        onContactsChange([...contacts, newContact]);
        setNewContact('');
    };

    const handleDeleteContact = (indexToDelete) => {
        if (isViewMode) return;
        onContactsChange(contacts.filter((_, index) => index !== indexToDelete));
    };

    return (
        <div className="contacts-container">
            <label>{type === 'phone' ? 'Teléfonos' : 'Correos Electrónicos'}</label>

            {alert.show && (
                <Alert
                    type="warning"
                    message={alert.message}
                    duration={3000}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            {!isViewMode && (
                <div className="contact-input-group">
                    <InputButton
                        type={type === 'phone' ? 'tel' : 'email'}
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        placeholder={`Ingrese el ${type === 'phone' ? 'teléfono' : 'correo'}`}
                        inputClassName=" border-custom"
                        onButtonClick={handleAddContact}
                        icon={Plus}
                    />
                </div>
            )}

            {contacts.length > 0 && (
                <div className="contacts-table">
                    <table>
                        <thead>
                            <tr>
                                <th>{type === 'phone' ? 'Teléfono' : 'Correo'}</th>
                                {!isViewMode && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact, index) => (
                                <tr key={index}>
                                    <td>{contact}</td>
                                    {!isViewMode && (
                                        <td>
                                            <Button
                                                className="btn delete-btn"
                                                variant="ghost"
                                                onClick={() => handleDeleteContact(index)}
                                            >
                                                <Trash size={20} color="#FFFFFF" />
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