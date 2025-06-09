import { expect } from 'chai';
import { validateSubcategoryData } from '../../logic/validateFields.logic.js';

describe('Subcategoría - Validación simple de nombre', () => {
    it('debe aceptar un nombre válido y un ID_CATEGORIA válido', () => {
        const req = { body: { DSC_NOMBRE: 'Celulares', ID_CATEGORIA: 1 } };
        const result = validateSubcategoryData(req);
        expect(result).to.be.true;
    });

    it('debe rechazar un nombre vacío', () => {
        const req = { body: { DSC_NOMBRE: '', ID_CATEGORIA: 1 } };
        const result = validateSubcategoryData(req);
        expect(result).to.be.an('array');
        expect(result).to.include('El campo DSC_NOMBRE es requerido y no puede estar vacío.');
    });

    it('debe rechazar ID_CATEGORIA vacío', () => {
        const req = { body: { DSC_NOMBRE: 'Celulares', ID_CATEGORIA: '' } };
        const result = validateSubcategoryData(req);
        expect(result).to.be.an('array');
        expect(result).to.include('El campo ID_CATEGORIA es requerido y no puede estar vacío.');
    });
});
