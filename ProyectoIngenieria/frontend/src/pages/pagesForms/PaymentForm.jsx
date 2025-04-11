import React, { useEffect, useState } from 'react';
import GenericForm from '../../components/common/GenericForm';


const PaymentForm = ({initialData, fields, onSubmit, onCancel, mode})=> {

    //Datos que recibe el formulario generico.
    const filteredInitialData = {
        ID_CREDITO: initialData?.ID_CREDITO || 0,
        MON_PENDIENTE:initialData?.MON_PENDIENTE || 0,
        MON_ABONADO: initialData?.MON_ABONADO ?? initialData.amount ?? "",
        ID_ABONO: initialData?.id || 0,
        
      };
    return (
        <GenericForm
            entityName={"Abono"}
            mode= {mode}//"add" //dinamico en el futuro, para editar y agregar.
            initialData={filteredInitialData}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
};

export default PaymentForm;