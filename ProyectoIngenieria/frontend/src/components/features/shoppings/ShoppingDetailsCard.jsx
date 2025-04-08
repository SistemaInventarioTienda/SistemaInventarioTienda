import { useState, useEffect, useRef } from 'react';
import { SearchSelect } from '../../common';
import { searchProduct } from '../../../api/product';
import ProductTable from '../../features/ProductTable';
import { toast } from 'sonner';
import { Button } from '../../common';
import { useNavigate } from "react-router-dom";
import { Box } from "lucide-react"

const ShoppingDetailsCard = ({ shoppingForm }) => {
    const navigate = useNavigate();
    const barcodeBuffer = useRef('');
    const timeoutId = useRef(null);

    const handleSelectProduct = async (product) => {
        shoppingForm.addProduct({
            id: product.ID_PRODUCT,
            name: product.DSC_NOMBRE,
            price: product.MON_COMPRA,
            barcode: product.DSC_CODIGO_BARRAS,
            quantity: 1,
            subtotal: product.MON_COMPRA,
        });
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') return;

            if (event.key === 'Enter') {
                event.preventDefault();
                const code = barcodeBuffer.current;
                barcodeBuffer.current = '';

                searchProduct(1, 10, code, 'DSC_CODIGO_BARRAS', 'asc')
                    .then((data) => {
                        if (data.products?.length > 0) {
                            handleSelectProduct(data.products[0]);
                            toast.success(`Producto ${code} agregado`);
                        }
                    })
                    .catch(console.error);
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
        <div className="shoppings-card shoppings-card-fixed">
            <div className="shoppings-card-header">
                <h2 className="shoppings-card-title">Productos Seleccionados</h2>
            </div>
            <div className="shoppings-card-content">
                <div className="shoppings-input-section">
                    <SearchSelect
                        placeholder="Buscar producto..."
                        fetchOptions={(term, page, size) =>
                            searchProduct(page, size, term, "DSC_NOMBRE", "asc")
                        }
                        onSelect={handleSelectProduct}
                        displayField="DSC_NOMBRE"
                        valueField="ID_PRODUCT"
                        style={{ flex: 1 }}
                    />

                    <Button
                        className="add-btn"
                        style={{ marginTop: '1rem', marginBottom: '1rem', width: '100%', borderRadius: '16px' }}
                        onClick={() => {
                            sessionStorage.setItem('shoppingFormState', JSON.stringify({
                                selectedProducts: shoppingForm.selectedProducts,
                                selectedSupplier: shoppingForm.selectedSupplier,
                                selectedPaymentMethod: shoppingForm.selectedPaymentMethod,
                                productReceiptDate: shoppingForm.productReceiptDate,
                                note: shoppingForm.note,
                                total: shoppingForm.total
                            }));

                            navigate('/product', {
                                state: {
                                    openProductModal: true,
                                    returnTo: {
                                        pathname: '/shopping/new',
                                        state: { fromProduct: true }
                                    },
                                }
                            });
                        }}
                    >
                        <Box size={18} />
                        Nuevo Producto
                    </Button>
                </div>

                <ProductTable
                    selectedProducts={shoppingForm.selectedProducts}
                    updateProductQuantity={shoppingForm.updateProductQuantity}
                    removeProduct={shoppingForm.removeProduct}
                />
            </div>
        </div>
    );
};

export default ShoppingDetailsCard;