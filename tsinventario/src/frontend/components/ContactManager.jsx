import { useState } from 'react'
import { Plus, Trash } from 'lucide-react'
import { Alert } from '../components/ui'
import { Button, InputButton } from '../components/ui';
import "./css/contactManager.css";

export default function Component({
    contacts = [],
    onContactsChange = () => { },
    type = 'phone'
}) {
    const [newContact, setNewContact] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '' });

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

        if (!newContact.trim()) return;

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
        onContactsChange(contacts.filter((_, index) => index !== indexToDelete));
    };

    return (
        <div className="contacts-container">
            <label>Telefonos</label>
            {alert.show && (
                <Alert
                    type="warning"
                    message={alert.message}
                    duration={3000}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            <div className="contact-input-group">
                <InputButton
                    type={type === 'phone' ? 'tel' : 'email'}
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder={`Ingrese el ${type === 'phone' ? 'teléfono' : 'correo'}`}
                    inputClassName="form-control border-custom"
                    inputStyle={{
                        backgroundColor: "#F5F7FA",
                        borderColor: "#05004E",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "Poppins, sans-serif",
                        color: "#05004E",
                    }}
                    onButtonClick={handleAddContact}
                    icon={Plus}
                />
            </div>

            {contacts.length > 0 && (
                <div className="contacts-table">
                    <table>
                        <thead>
                            <tr>
                                <th>{type === 'phone' ? 'Teléfono' : 'Correo'}</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact, index) => (
                                <tr key={index}>
                                    <td>{contact}</td>
                                    <td>
                                        <Button
                                            className="btn delete-btn"
                                            style={{
                                                backgroundColor: '#F44336',
                                                borderRadius: '16px',
                                                width: '40px',
                                                height: '40px'
                                            }}
                                            variant="ghost"
                                            onClick={() => handleDeleteContact(index)}
                                        >
                                            <Trash size={20} color="#FFFFFF" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
