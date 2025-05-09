import { useState, useEffect, useRef } from "react";
import { validateGeneral } from "../schemas/validations/validateGeneral";
import { validateSupplier } from "../schemas/validations/validateSupplier";
import { validateProduct } from "../schemas/validations/validateProduct";
import { validateClient } from "../schemas/validations/validateClient";
import { validateTransaction } from "../schemas/validations/validateTransaction";
import { validatePayment } from "../schemas/validations/validatePayment";

export function useGenericFormLogic({
  entityName,
  initialData = {},
  supplierTypes = [],
  subcategoriesTypes = [],
  onSubmit,
  setErrorMessages,
}) {
  const [formData, setFormData] = useState(initialData);
  const [phones, setPhones] = useState(initialData?.telefonos || []);
  const [emails, setEmails] = useState(initialData?.correos || []);
  const [localSupplierTypes, setLocalSupplierTypes] = useState(supplierTypes);
  const [localSubcategoriesTypes, setLocalSubcategoriesTypes] =
    useState(subcategoriesTypes);
  const [searchPersonWorker, setSearchPersonWorker] = useState(null);
  const [isCedulaValid, setIsCedulaValid] = useState(false);
  const [workerError, setWorkerError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const initialLoaded = useRef(false);

  useEffect(() => {
    if (!initialLoaded.current) {
      setFormData(initialData);
      setPhones(initialData?.telefonos || []);
      setEmails(initialData?.correos || []);
      initialLoaded.current = true;
      setLocalSupplierTypes(supplierTypes || []);
      setLocalSubcategoriesTypes(subcategoriesTypes || []);
    }
  }, [initialData, supplierTypes]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
        setFormData(initialData);
    }
}, [initialData]);

  useEffect(() => {
    const worker = new Worker("workers/searchPerson.worker.js");
    worker.onmessage = ({ data }) => {
      if (data) {
        const { nombre, segundoNombre, apellidoUno, apellidoDos } = data;
        const newName = segundoNombre ? `${nombre} ${segundoNombre}` : nombre;

        setFormData((prev) => ({
          ...prev,
          nombre: newName,
          primerApellido: apellidoUno,
          segundoApellido: apellidoDos,
        }));

        setIsCedulaValid(true);
        setWorkerError(false);
      } else {
        setWorkerError(true);
        setIsCedulaValid(false);
      }
    };

    worker.onerror = () => {
      setWorkerError(true);
      setIsCedulaValid(false);
    };

    setSearchPersonWorker(worker);

    return () => worker.terminate();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cedula") {
      if (value.length === 9) {
        searchPersonWorker.postMessage(value);
        setWorkerError(false);
      } else {
        setIsCedulaValid(false);
        setFormData((prev) => ({
          ...prev,
          nombre: "",
          primerApellido: "",
          segundoApellido: "",
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    //console.log("DATOS ENVIADOS", formData);
    e.preventDefault();
    setIsProcessing(true);

    // console.log("EntityName: ", entityName);
    // console.log("formData: ", formData);
    try {
      let errors = [];
      

      if (entityName !== "Ajuste" && entityName !== "Abono" && entityName !== "Transaccion") {
        errors = validateGeneral(formData);
      } 

      if (entityName === "Proveedor") {
        errors = [...errors, ...validateSupplier(formData, phones, emails)];
      } else if (entityName === "Producto") {
        errors = [...errors, ...validateProduct(formData)];
      } else if (entityName === "Cliente") {
        errors = [...errors, ...validateClient(phones)];
      }else if (entityName === "Transaccion"){
        errors = [...errors, ...validateTransaction(formData)];
      } else if (entityName === "Abono"){
        errors = [...errors, ...validatePayment(formData)];
      }

      // else if (entityName === "Ajuste"){

      // }

      if (errors.length > 0) {
        setErrorMessages(errors);
        setIsProcessing(false);
        return;
      }

      let dataToSubmit = {};
      if (entityName === "Abono") {
        dataToSubmit = {
          ID_ABONO: formData.ID_ABONO,
          ID_CREDITO: formData.ID_CREDITO,
          MON_ABONADO: formData.MON_ABONADO, // Solo este campo es necesario para el abono
        };
      } else {
        dataToSubmit = {
          ...formData,
          telefonos: phones,
          correos: emails,
          estado: parseInt(formData.estado, 10),
          rango: parseInt(formData.rango, 10),
        };
      }

      //console.log("Estado en useGenericForm: ", formData.estado);
      //console.log("ID del credito: ", formData.ID_CREDITO);
      // Elimina el campo estado si es un ajuste y no se ha seleccionado un estado
      if (entityName === "Ajuste" && !formData.estado) {
        delete dataToSubmit.correos;
        delete dataToSubmit.telefonos; // Elimina el campo telefonos si no existen
        delete dataToSubmit.estado; // Elimina el campo estado si no existe
      } else if (entityName === "Abono" && !formData.estado) {
        delete dataToSubmit.correos;
        delete dataToSubmit.telefonos; // Elimina el campo telefonos si no existen
        delete dataToSubmit.estado;
      }else if (entityName === "Transaccion" && !formData.estado) {
        delete dataToSubmit.correos;
        delete dataToSubmit.telefonos; // Elimina el campo telefonos si no existen
        delete dataToSubmit.estado;
        delete dataToSubmit.rango;
      }else if (entityName === "Usuario") {
        //console.log("Usuario: ", formData.estado);
        delete dataToSubmit.correos;
        delete dataToSubmit.telefonos; // Elimina el campo telefonos si no existen
        delete dataToSubmit.rango;
        delete dataToSubmit.email;
      }



      console.log("Data to submit: ", dataToSubmit);
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error procesando el formulario:", error.message);
      setErrorMessages([
        "Error al procesar el formulario. Intente nuevamente.",
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    formData,
    phones,
    emails,
    localSupplierTypes,
    localSubcategoriesTypes,
    isCedulaValid,
    workerError,
    handleChange,
    handleSubmit,
    setFormData,
    setPhones,
    setEmails,
    isProcessing,
  };
}
