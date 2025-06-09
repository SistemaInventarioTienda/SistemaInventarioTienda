import { expect } from 'chai';
import sinon from 'sinon';
import { validateCategoryName } from '../../logic/validateFields.logic.js';
import { categorySchema } from '../../schemas/category.schema.js';
import { saveCategory } from '../../logic/category/category.logic.js';
import Category from '../../models/category.model.js';

describe('Categoría - Validaciones y lógica', () => {
    describe('Validación del nombre de categoría - lógica simple', () => {
        it('debe aceptar nombres válidos', () => {
            const req = { body: { DSC_NOMBRE: 'Electrónica' } };
            const result = validateCategoryName(req);
            expect(result).to.be.true;
        });

        it('debe rechazar nombres vacíos', () => {
            const req = { body: { DSC_NOMBRE: '' } };
            const result = validateCategoryName(req);
            expect(result).to.be.an('array');
            expect(result[0]).to.equal('El campo DSC_NOMBRE es requerido y no puede estar vacío.');
        });
    });

    describe('Validación del schema de categoría - Zod', () => {
        it('debe aceptar un nombre válido', () => {
            const data = { DSC_NOMBRE: 'Ropa' };
            const result = categorySchema.safeParse(data);
            expect(result.success).to.be.true;
        });

        it('debe rechazar un nombre muy corto', () => {
            const data = { DSC_NOMBRE: 'ab' };
            const result = categorySchema.safeParse(data);
            expect(result.success).to.be.false;
            expect(result.error.issues[0].message).to.equal(
                'El nombre de la categoría debe tener al menos 3 caracteres.'
            );
        });
    });
});
