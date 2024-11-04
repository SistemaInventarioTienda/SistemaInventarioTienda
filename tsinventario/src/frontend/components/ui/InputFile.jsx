import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../ui';
import { Upload, Trash } from "lucide-react";
import '../css/InputFile.css';

const DEFAULT_IMAGE_URL = process.env.PUBLIC_URL + '/Assets/image/clientes/default_client.png';

const InputFile = ({ value, mode, entity }) => {
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(mode === 'add' ? null : value || DEFAULT_IMAGE_URL);

    useEffect(() => {
        if (mode !== 'add') {
            setPreview(value || DEFAULT_IMAGE_URL);
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
        setPreview(null);
    };

    const formatFileSize = (size) => {
        if (size < 1024) return `${size} bytes`;
        else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
        else return `${(size / 1048576).toFixed(2)} MB`;
    };

    return (
        <div className="input-file-container">
            <label>Fotografía</label>
            {preview ? (
                <div className="selected-file">
                    <img
                        src={preview}
                        alt="Vista previa"
                        className="preview-image"
                        onError={handleImageError} // Aquí agregamos el evento onError
                    />
                    <div>
                        <p>{selectedFile ? selectedFile.name : ""}</p>
                        <p className="file-size">{selectedFile ? formatFileSize(selectedFile.size) : ""}</p>
                    </div>
                    {(mode === 'edit' || mode === 'add') && entity === 'Cliente' ? (
                        <>
                            <Button onClick={removeFile} type="button">
                                <Trash />
                            </Button>
                            <Button onClick={onChooseFile} className="file-btn" type="button">
                                <Upload />
                                <span>{mode === 'edit' ? "Seleccionar Nuevo Archivo" : "Seleccionar Archivo"}</span>
                            </Button>
                            <input
                                onChange={handleOnChange}
                                type="file"
                                ref={inputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </>
                    ) : null}
                </div>
            ) : (
                <>
                    {(mode === 'edit' || mode === 'add') && entity === 'Cliente' ? (
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
                                accept="image/*"
                            />
                        </>
                    ) : null}
                </>
            )}
        </div>
    );
};

export default InputFile;
