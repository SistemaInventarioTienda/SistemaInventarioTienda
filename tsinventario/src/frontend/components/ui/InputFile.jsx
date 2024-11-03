// inputfile.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../ui';
import { Upload, Trash } from "lucide-react";
import '../css/InputFile.css';

const FileInput = ({ existingPreview, isViewMode }) => {
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(existingPreview || null);

    useEffect(() => {
        if (existingPreview) {
            setPreview(existingPreview);
        }
    }, [existingPreview]);

    const handleOnChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    return (
        <div>
            {isViewMode ? (
                preview ? (
                    <img src={preview} alt="Vista previa" className="preview-image" />
                ) : (
                    <p>No hay imagen disponible</p>
                )
            ) : (
                <>
                    <input
                        onChange={handleOnChange}
                        type="file"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <Button
                        onClick={onChooseFile}
                        className='file-btn'
                        type="button"
                    >
                        <Upload />
                        <span className='material-symbols-rounded'>Subir documento</span>
                    </Button>
                    {preview && (
                        <div className='selected-file'>
                            <img src={preview} alt="Vista previa" className="preview-image" />
                            <p>{selectedFile ? selectedFile.name : ''}</p>
                            <Button
                                onClick={removeFile}
                                type="button"
                            >
                                <Trash />
                                <span className='material-symbols-rounded'></span>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FileInput;
