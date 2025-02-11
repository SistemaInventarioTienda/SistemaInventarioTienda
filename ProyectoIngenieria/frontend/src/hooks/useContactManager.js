import { useState } from 'react';
import useAlert from './useAlert';

export function useContactManager(initialContacts = []) {
    const [contacts, setContacts] = useState(initialContacts);
    const [newContact, setNewContact] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const { alert, showAlert, hideAlert } = useAlert(); // Usamos el hook de alertas

    const validateContact = (contact, type) => {
        if (type === 'phone') {
            return /^\d{8}$/.test(contact);
        } else if (type === 'email') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        }
        return false;
    };

    const handleAddOrUpdateContact = (e, type) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!newContact.trim()) return;

        if (!validateContact(newContact, type)) {
            showAlert(
                type === 'phone' ? 'Ingrese un número de teléfono válido (8 dígitos)' : 'Ingrese un correo válido',
                'error'
            );
            return;
        }

        if (editingIndex !== null) {
            const updatedContacts = [...contacts];
            updatedContacts[editingIndex] = newContact;
            setContacts(updatedContacts);
            setEditingIndex(null);
        } else {
            setContacts([...contacts, newContact]);
        }

        setNewContact('');
    };

    const handleEditContact = (e, index) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setNewContact(contacts[index]);
        setEditingIndex(index);
    };

    const handleDeleteContact = (e, index) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setContacts(contacts.filter((_, i) => i !== index));

        if (editingIndex === index) {
            setNewContact('');
            setEditingIndex(null);
        }
    };

    const handleCancelEdit = () => {
        setNewContact('');
        setEditingIndex(null);
        hideAlert();
    };

    return {
        contacts,
        newContact,
        editingIndex,
        alert,
        setNewContact,
        handleAddOrUpdateContact,
        handleEditContact,
        handleDeleteContact,
        handleCancelEdit,
    };
}
