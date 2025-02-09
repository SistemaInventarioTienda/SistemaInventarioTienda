//SettingsForm.jsx
import React, { useState } from 'react';
import { Input } from '../../components/common';
import { FileInput} from '../../components/common';
import { NumberInput } from '../../components/common';
import GenericForm from '../../components/common/GenericForm';

const SettingsForm = ({ initialData, handleSubmit }) => {
    
    const [image, setImage] = useState(null);


    const handleImageChange = (newImage) => {
        setImage(newImage);
    };

    // useState para componente de rango
    const [quantity, setQuantity] = useState(1);
    const handleQuantityChange = (newValue) => {
        setQuantity(newValue);
    };

    // PARTE PARA ENVIAR IMAGEN AL BACK

    // Prepara los datos del formulario antes de enviarlos
    // const handleFormSubmit = (formData) => {
    //     // Agrega la imagen seleccionada a los datos del formulario
    //     const formDataWithImage = {
    //         ...formData,
    //         siteLogo: image, // Asegúrate de que el backend espere este campo
    //     };
    //     handleSubmit(formDataWithImage); // Envía los datos al padre
    // };
    
    return(
        <>
        <NumberInput
            id="stock-range"
            label="Rango para el aviso de Stock" //titulo del componente
            min={1}
            max={100}
            initialValue={quantity}
            onChange={handleQuantityChange}
        />
        <br />
        <FileInput 
            value={image ? URL.createObjectURL(image): null}
            entity={"Cliente"}
            mode="edit"
            // onChange={handleImageChange}
            onFileSelect={handleImageChange}
        />
        <GenericForm
            profile={true}
            entityName={"Ajustes"}
            mode="edit"
            initialData={initialData}
            fields={[
                { label: "Nombre del sitio", name: "siteName", type: Input, required: true },  
                { label: "Correo electrónico", name: "siteEmail", type: Input, required: true },
                { label: "Teléfono", name: "sitePhone", type: Input, required: true },
                { label: "Dirección", name: "siteAddress", type: Input, required: true },
            ]}

            onSubmit={handleSubmit}
        />
        
        
       
        </>
    )
};

export default SettingsForm