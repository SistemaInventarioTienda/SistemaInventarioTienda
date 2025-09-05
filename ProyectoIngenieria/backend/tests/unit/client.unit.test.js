import { expect } from 'chai';
import sinon from 'sinon';
import Client from '../../models/client.model.js';
import phoneClient from '../../models/phoneClient.model.js';


// controllers/client.controller.js

export function createRegisterClient({ getDateCR, validateRegisterPhones }) {
  return async function registerClient(req, res) {
    try {
      const {
        DSC_CEDULA,
        DSC_NOMBRE,
        DSC_APELLIDOUNO,
        DSC_APELLIDODOS,
        ESTADO,
        DSC_DIRECCION,
        telefonos
      } = req.body;

      // Validaciones simples
      if (!DSC_NOMBRE || DSC_NOMBRE.trim() === '') {
        return res.status(400).json({ message: 'El nombre no es valida' });
      }

      // Validar teléfonos
      const validatePhonesResult = await validateRegisterPhones(telefonos);
      if (validatePhonesResult) {
        return res.status(400).json({ message: validatePhonesResult });
      }

      const fecha = await getDateCR();

      const cliente = new Client({
        DSC_CEDULA,
        DSC_NOMBRE,
        DSC_APELLIDOUNO,
        DSC_APELLIDODOS,
        ESTADO,
        DSC_DIRECCION,
        FEC_CREADOEN: fecha
      });

      const savedClient = await cliente.save();

      const telefonosConCliente = telefonos.map((t) => ({
        ID_CLIENTE: savedClient.ID_CLIENTE,
        DSC_TELEFONO: t.numeroTelefono,
        FEC_CREADOEN: fecha,
        ESTADO: 1,
      }));

      await phoneClient.bulkCreate(telefonosConCliente);

      return res.json({ status: 200, message: 'Cliente registrado correctamente' });
    } catch (err) {
      console.error('Error al registrar cliente:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  };
}



describe('Registrado clientes (Simulacion-test, validacion de registro de clientes)', () => {
  let req, res, registerClient;

  beforeEach(() => {
    req = {
      body: {
        DSC_CEDULA: '401620022',
        DSC_NOMBRE: 'Josue',
        DSC_APELLIDOUNO: 'Porras',
        DSC_APELLIDODOS: 'Rojas',
        ESTADO: 1,
        DSC_DIRECCION: 'Calle julieta',
        telefonos: [
          { numeroTelefono: '00998877' },
          { numeroTelefono: '22334455' },
        ],
      }
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(Client.prototype, 'save').resolves({ ID_CLIENTE: 1, update: sinon.stub() });
    sinon.stub(phoneClient, 'bulkCreate').resolves(true);
    sinon.stub(phoneClient, 'findAll').resolves([]);

    const getDateCRStub = sinon.stub().resolves('2024-06-09');
    const validatePhonesStub = sinon.stub().resolves(null);

    registerClient = createRegisterClient({
      getDateCR: getDateCRStub,
      validateRegisterPhones: validatePhonesStub
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('debe registrar correctamente al cliente', async () => {
    await registerClient(req, res);
    expect(res.json.calledOnce).to.be.true;
    const response = res.json.getCall(0).args[0];
    expect(response).to.have.property('status', 200);
  });
  it('debe devolver error si validateRegisterPhones falla', async () => {
  // Reemplazamos la función stub con una que falla
  registerClient = createRegisterClient({
    getDateCR: sinon.stub().resolves('2024-06-09'),
    validateRegisterPhones: sinon.stub().resolves('Número inválido')
  });

  await registerClient(req, res);
  expect(res.status.calledWith(400)).to.be.true;
  expect(res.json.calledWithMatch({ message: 'Número inválido' })).to.be.true;
});
it('debe devolver error si el nombre está vacío', async () => {
  req.body.DSC_NOMBRE = ' '; 
  await registerClient(req, res);
  expect(res.status.calledWith(400)).to.be.true;
  expect(res.json.calledWithMatch({ message: 'El nombre no es valida' })).to.be.true;
});

});
