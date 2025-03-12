import React, { useRef, useState, useEffect } from 'react';
import { Button } from './';
import { Upload, Trash } from "lucide-react";
import { API_URL_RESOURCES } from '../../config';
import './styles/inputFile.css';

const DEFAULT_IMAGE_URL = `${API_URL_RESOURCES}/images/image_not_found.png`;

const InputFile = ({
    value,
    mode,
    label = "Archivo",
    accept = "image/*",
    resourcePath = "images", // Nuevo parámetro genérico para manejar rutas
    onFileSelect
}) => {
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(DEFAULT_IMAGE_URL);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log("RESOURCE PATH", resourcePath);
        if (mode === 'add') {
            setPreview(DEFAULT_IMAGE_URL);
        } else if ((mode === 'edit' || mode === 'view') && value) {
            if (typeof value === "string" && (value.startsWith("http") || value.startsWith("/"))) {
                setPreview(value);
            } else if (typeof value === "object" && value instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(value);
            } else {
                setPreview(`${API_URL_RESOURCES}/${resourcePath}/${value}`);
            }
        }
    }, [value, mode, resourcePath]);

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

            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleImageError = () => {
        setPreview(DEFAULT_IMAGE_URL);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreview(DEFAULT_IMAGE_URL);
        if (onFileSelect) {
            onFileSelect(null);
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
            <div className="selected-file">
                <img
                    src={preview}
                    alt="Vista previa"
                    className="preview-image"
                    onError={handleImageError}
                    style={{ cursor: preview !== DEFAULT_IMAGE_URL ? 'pointer' : 'default' }}
                    onClick={() => {
                        if (preview !== DEFAULT_IMAGE_URL) setShowModal(true);
                    }}
                />
                <div className="file-info">
                    <p className="file-name">{selectedFile ? selectedFile.name : ""}</p>
                    <p className="file-size">{selectedFile ? formatFileSize(selectedFile.size) : ""}</p>
                </div>
                {(mode === 'edit' || mode === 'add') && (
                    <>
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


            {/* MODAL DEBE ESTAR DENTRO DEL RETURN */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={preview}
                            alt="Vista previa completa"
                            className="modal-image"
                        />
                        <Button
                            onClick={() => setShowModal(false)}
                            className="modal-close-btn"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputFile;
