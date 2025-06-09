import { expect } from 'chai';
import { updateSchema } from '../../schemas/product.schema.js'; 

describe('Validación de actualización de productos - updateSchema', () => {
  it('Debería aceptar un objeto válido', () => {
    const data = {
      DSC_NOMBRE: 'Zapatos Deportivos',
      DSC_DESCRIPTION: 'Zapatos para correr con buen agarre.',
      MON_VENTA: 25000,
      MON_COMPRA: 18000,
      SUBCATEGORIA: 'calzado-deportivo',
    };

    const result = updateSchema.safeParse(data);
    expect(result.success).to.be.true;
  });

  it('Debería rechazar si DSC_NOMBRE tiene menos de 3 caracteres', () => {
    const data = {
      DSC_NOMBRE: 'Z',
      DSC_DESCRIPTION: 'Descripción válida',
      MON_VENTA: 25000,
      MON_COMPRA: 18000,
      SUBCATEGORIA: 'calzado-deportivo',
    };

    const result = updateSchema.safeParse(data);
    expect(result.success).to.be.false;
    expect(result.error.issues[0].path[0]).to.equal('DSC_NOMBRE');
  });



  it('Debería rechazar si faltan todos los campos', () => {
    const result = updateSchema.safeParse({});
    expect(result.success).to.be.false;
    const errores = result.error.issues.map((e) => e.path[0]);
    expect(errores).to.have.members([
      'DSC_NOMBRE',
      'DSC_DESCRIPTION',
      'MON_VENTA',
      'MON_COMPRA',
      'SUBCATEGORIA'
    ]);
  });
});
