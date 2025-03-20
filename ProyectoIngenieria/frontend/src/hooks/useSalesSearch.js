import { useState, useEffect } from "react";
import { searchProduct } from '../api/product';

export const useSalesSearch = (saleForm) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchTerm) {
                setProducts([]);
                return;
            }
            setLoading(true);
            try {
                const response = await searchProduct(page, 5, searchTerm, "DSC_NOMBRE", "asc");
                setProducts(response.products);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, page]);

    const selectProduct = (product) => {
        saleForm.addProduct({
            id: product.ID_PRODUCT,
            name: product.DSC_NOMBRE,
        });
        setSearchTerm("");
        setProducts([]);
    };

    return {
        searchTerm,
        setSearchTerm,
        products,
        loading,
        selectProduct,
        page,
        setPage,
        totalPages
    };
};
