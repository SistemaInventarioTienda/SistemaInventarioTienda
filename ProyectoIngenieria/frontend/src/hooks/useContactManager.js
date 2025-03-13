import { useState } from 'react';
import { toast } from "sonner";

export function useContactManager(initialContacts = [], onContactsChange) {
    const [contacts, setContacts] = useState(initialContacts);
    const [newContact, setNewContact] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const validateContact = (contact, type) => {
        if (type === 'phone') {
            return /^\d{8}$/.test(contact); // Valida números de teléfono de 8 dígitos
        } else if (type === 'email') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact); // Valida correos electrónicos
        }
        return false;
    };

    const isDuplicate = (contact) => {
        return contacts.some((existingContact) => existingContact === contact);
    };

    const handleAddOrUpdateContact = (e, type) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!newContact.trim()) {
            toast.error('El campo no puede estar vacío.');
            return;
        }

        if (!validateContact(newContact, type)) {
            toast.error(
                type === 'phone'
                    ? 'Ingrese un número de teléfono válido (8 dígitos)'
                    : 'Ingrese un correo válido'
            );
            return;
        }

        if (isDuplicate(newContact)) {
            toast.error('Este contacto ya existe. Por favor, ingrese uno diferente.');
            return;
        }

        let updatedContacts;
        if (editingIndex !== null) {
            // Actualizar contacto existente
            updatedContacts = [...contacts];
            updatedContacts[editingIndex] = newContact;
        } else {
            // Agregar nuevo contacto
            updatedContacts = [...contacts, newContact];
        }

        setContacts(updatedContacts);
        setEditingIndex(null);
        setNewContact('');

        // Llamar a onContactsChange para propagar los cambios al componente padre
        onContactsChange(updatedContacts);
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
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
        if (editingIndex === index) {
            setNewContact('');
            setEditingIndex(null);
        }

        // Llamar a onContactsChange para propagar los cambios al componente padre
        onContactsChange(updatedContacts);
    };

    const handleCancelEdit = () => {
        setNewContact('');
        setEditingIndex(null);
    };

    return {
        contacts,
        newContact,
        editingIndex,
        setNewContact,
        handleAddOrUpdateContact,
        handleEditContact,
        handleDeleteContact,
        handleCancelEdit,
    };
}