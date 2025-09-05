import { useState, useEffect, useRef } from 'react';
import { SearchSelect } from '../../common';
import { searchProduct } from '../../../api/product';
import ProductTable from '../ProductTable';
import { toast } from 'sonner';

const ProformaDetailsCard = ({ proformaForm }) => {
    const barcodeBuffer = useRef('');
    const timeoutId = useRef(null);

    const handleSelectProduct = (product) => {
        proformaForm.addProduct({
            id: product.ID_PRODUCT,
            name: product.DSC_NOMBRE,
            price: product.MON_VENTA,
            quantity: 1,
            subtotal: product.MON_VENTA,
            tax: product.IMPUESTO || 0,
            discount: product.DESCUENTO || 0,
        });
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                return;
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                const code = barcodeBuffer.current;
                barcodeBuffer.current = '';

                if (code) {
                    searchProduct(1, 10, code, 'DSC_CODIGO_BARRAS', 'asc')
                        .then((data) => {
                            if (data.products?.length > 0) {
                                handleSelectProduct(data.products[0]);
                                toast.success(`¡Producto con el código ${code} agregado correctamente!`);
                            } else {
                                toast.error(`¡Producto con el código ${code} no encontrado!`);

                            }
                        })
                        .catch(console.error);
                }
            } else if (event.key.length === 1) {
                barcodeBuffer.current += event.key;
                clearTimeout(timeoutId.current);
                timeoutId.current = setTimeout(() => {
                    barcodeBuffer.current = '';
                }, 500);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timeoutId.current);
        };
    }, []);


    return (
        <div className='proforma-card proforma-card-fixed'>
            <div className='proforma-card-header'>
                <h2 className='proforma-card-title'>Productos seleccionados</h2>
            </div>
            <div className='proforma-card-content'>
                <SearchSelect
                    placeholder="Buscar producto por nombre o código de barras"

                    fetchOptions={(term, page, size) =>
                        searchProduct(page, size, term, "DSC_NOMBRE", "asc")
                    }
                    onSelect={handleSelectProduct}
                    displayField='DSC_NOMBRE'
                    valueField='ID_PRODUCT'
                />

                <ProductTable
                    enablePerItemAdjustments 
                    style="margin: 20px"
                    selectedProducts={proformaForm.selectedProducts}
                    updateProductQuantity={proformaForm.updateProductQuantity}
                    updateProductField={proformaForm.updateProductField}
                    removeProduct={proformaForm.removeProduct}
                />
            </div>
        </div>
    )

}

export default ProformaDetailsCard;