import React, { useEffect, useState } from 'react';
import GenericForm from '../../components/common/GenericForm';


const PaymentForm = ({initialData, fields, onSubmit, onCancel})=> {

    return (
        <GenericForm
            entityName={"Abono"}
            mode= "add" //dinamico en el futuro, para editar y agregar.
            initialData={initialData}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
};

export default PaymentForm;