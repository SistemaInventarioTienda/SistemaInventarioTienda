import React, { useRef, useState, useEffect } from 'react';
import { Button } from './';
import { Upload, Trash } from "lucide-react";
import './styles/inputFile.css';

const DEFAULT_IMAGE_URL = process.env.PUBLIC_URL + '/assets/image/default_image.png';

const InputFile = ({
    value,
    mode,
    label = "Archivo",
    accept = "image/*",
    onFileSelect
}) => {
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        // Determinar qué imagen mostrar según el modo y el valor
        if (mode === 'add') {
            setPreview(null);
        } else {
            console.log(DEFAULT_IMAGE_URL);
            if (value && typeof value === 'string' && (value.startsWith("http") || value.startsWith("/"))) {

                // Si `value` es una URL válida, usarla como vista previa
                setPreview(process.env.PUBLIC_URL + value);
            } else {
                // Si no hay URL válida, usar la imagen predeterminada
                setPreview(DEFAULT_IMAGE_URL);
            }
        }
    }, [value, mode]);

    const handleOnChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(DEFAULT_IMAGE_URL);
            }
            // Llamamos a la función onFileSelect con el archivo seleccionado
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleImageError = () => {
        // Si ocurre un error al cargar la imagen, usar la imagen predeterminada
        setPreview(DEFAULT_IMAGE_URL);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreview(null);
        if (onFileSelect) {
            onFileSelect(null); // Notificar que se eliminó el archivo
        }
    };

    const formatFileSize = (size) => {
        if (size < 1024) return `${size} bytes`;
        else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
        else return `${(size / 1048576).toFixed(2)} MB`;
    };

    return (
        <div className="input-file-container">
            <label>{label}</label>
            {preview ? (
                <div className="selected-file">
                    <img
                        src={preview}
                        alt="Vista previa"
                        className="preview-image"
                        onError={handleImageError}
                    />
                    <div className="file-info">
                        <p className="file-name">{selectedFile ? selectedFile.name : ""}</p>
                        <p className="file-size">{selectedFile ? formatFileSize(selectedFile.size) : ""}</p>
                    </div>
                    {(mode === 'edit' || mode === 'add') && (
                        <>
                            {/* Botón de eliminar solo si no es la imagen predeterminada */}
                            {preview !== DEFAULT_IMAGE_URL && (
                                <Button onClick={removeFile} type="button">
                                    <Trash />
                                </Button>
                            )}
                            {!selectedFile && (
                                <Button onClick={onChooseFile} className="file-btn" type="button">
                                    <Upload />
                                    <span>{mode === 'edit' ? "Seleccionar Nuevo Archivo" : "Seleccionar Archivo"}</span>
                                </Button>
                            )}
                            <input
                                onChange={handleOnChange}
                                type="file"
                                ref={inputRef}
                                style={{ display: "none" }}
                                accept={accept}
                            />
                        </>
                    )}
                </div>
            ) : (
                <>
                    {(mode === 'edit' || mode === 'add') && (
                        <>
                            <Button onClick={onChooseFile} className="file-btn" type="button">
                                <Upload />
                                <span>{mode === 'edit' ? "Seleccionar Nuevo Archivo" : "Seleccionar Archivo"}</span>
                            </Button>
                            <input
                                onChange={handleOnChange}
                                type="file"
                                ref={inputRef}
                                style={{ display: "none" }}
                                accept={accept}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default InputFile;