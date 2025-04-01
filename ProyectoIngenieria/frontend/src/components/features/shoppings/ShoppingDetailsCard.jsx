import { useState, useEffect, useRef } from 'react';
import { SearchSelect } from '../../common';
import { searchProduct, registerProduct } from '../../../api/product';
import ProductTable from '../../features/ProductTable';
import { toast } from 'sonner';
import { Button } from '../../common';
import { useNavigate } from "react-router-dom";
import { Box } from "lucide-react"

const ShoppingDetailsCard = ({ shoppingForm }) => {
    const navigate = useNavigate();
    const barcodeBuffer = useRef('');
    const timeoutId = useRef(null);
    const [showProductCreation, setShowProductCreation] = useState(false);
    const [newProductBarcode, setNewProductBarcode] = useState('');

    const handleSelectProduct = async (product) => {
        shoppingForm.addProduct({
            id: product.ID_PRODUCT,
            name: product.DSC_NOMBRE,
            price: product.MON_COMPRA,
            quantity: 1,
            subtotal: product.MON_COMPRA,
        });
    };

    const handleCreateProduct = async () => {
        try {
            const newProduct = await registerProduct({
                DSC_CODIGO_BARRAS: newProductBarcode,
                DSC_NOMBRE: `Nuevo Producto ${newProductBarcode}`,
                MON_COMPRA: 0,
                MON_VENTA: 0,
                CANT_STOCK: 0
            });

            toast.success("Producto creado exitosamente");
            setShowProductCreation(false);
            handleSelectProduct(newProduct);
        } catch (error) {
            toast.error("Error al crear el producto");
        }
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
                        } else {
                            setNewProductBarcode(code);
                            setShowProductCreation(true);
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
                        onClick={() => navigate('/product', { state: { openProductModal: true } })}
                        style={{ borderRadius: '8px' }}
                    >
                        <Box size={18} />
                        Nuevo Producto
                    </Button>
                </div>

                {showProductCreation && (
                    <div className="product-creation-alert">
                        <p>¿Desea crear un nuevo producto con código {newProductBarcode}?</p>
                        <Button onClick={handleCreateProduct}>Crear Producto</Button>
                    </div>
                )}

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