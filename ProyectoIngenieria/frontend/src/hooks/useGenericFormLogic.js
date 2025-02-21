import { useState, useEffect, useRef } from "react";
import { validateGeneral } from "../schemas/validations/validateGeneral";
import { validateSupplier } from "../schemas/validations/validateSupplier";
import { validateProduct } from "../schemas/validations/validateProduct";

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
    const [localSubcategoriesTypes, setLocalSubcategoriesTypes] = useState(subcategoriesTypes);
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
        console.log("DATOS ENVIADOS",formData);
        e.preventDefault();
        setIsProcessing(true);

        try {

            let errors = validateGeneral(formData);

            if (entityName === "Proveedor") {
                errors = [...errors, ...validateSupplier(formData, phones, emails)];
            }else if (entityName === "Producto"){
                errors = [...errors, ...validateProduct(formData)];
            }

            if (errors.length > 0) {
                setErrorMessages(errors);
                setIsProcessing(false);
                return;
            }

            const dataToSubmit = {
                ...formData,
                telefonos: phones,
                correos: emails,
                estado: parseInt(formData.estado, 10),
            };

            await onSubmit(dataToSubmit);
        } catch (error) {
            console.error("Error procesando el formulario:", error.message);
            setErrorMessages(["Error al procesar el formulario. Intente nuevamente."]);
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
        isProcessing
    };
}