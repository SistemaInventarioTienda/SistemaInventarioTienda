import { useEffect, useRef } from 'react';

export const useBarcodeScanner = ({ enabled = true, onScan }) => {
    const bufferRef = useRef([]);
    const lastKeyTimeRef = useRef(Date.now());

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e) => {
            
            if (['input', 'textarea', 'select'].includes(e.target.tagName)) return;

            const now = Date.now();
            const timeBetweenKeys = now - lastKeyTimeRef.current;
            lastKeyTimeRef.current = now;

            if (timeBetweenKeys > 100) {
                bufferRef.current = [];
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                if (bufferRef.current.length > 0) {
                    const barcode = bufferRef.current.join('');
                    onScan(barcode);
                    bufferRef.current = [];
                }
            } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                bufferRef.current.push(e.key);
                e.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onScan]);
};
