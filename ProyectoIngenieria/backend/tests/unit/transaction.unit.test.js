import { expect } from 'chai';
import sinon from 'sinon';
import Transaction from '../../models/transaction.model.js';
import User from '../../models/user.model.js';


export function createDeleteTransaction({ timeHasPassed }) {
  return async function deleteTransaction(req, res) {
    try {
      const transaction = await Transaction.findOne({
        attributes: ['ID_TRANSACCION', 'FEC_TRANSACCION'],
        where: { ID_TRANSACCION: req.params.id }
      });
      if (!transaction) {
        return res.status(404).json({ message: "Transacción no encontrada." });
      }

      const user = await User.findOne({
        attributes: ['ID_USUARIO'],
        where: { DSC_CEDULA: req.user.id }
      });

      if (!user) return res.status(404).json({ message: "El usuario no tiene permiso de eliminar la transacción." });

      const TimeHasPassed = await timeHasPassed(transaction.FEC_TRANSACCION); 
      if (TimeHasPassed) {
        return res.status(404).json({ message: "El tiempo para eliminar una transacción ha expirado." });
      }

      await transaction.update(
        {
          ESTADO: 2,
        },
        {
          where: { ID_TRANSACCION: req.params.id }
        }
      );

      return res.status(200).json({ message: "Transacción eliminada con éxito." });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ message: error.message });
    }
  };
}


describe('Eliminar transacciones (Simulación de eliminación para testeo)', () => {
  let req, res, transactionMock, userMock, deleteTransaction;

  beforeEach(() => {
    req = {
      params: { id: 123 },
      user: { id: '401620022' }
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    transactionMock = {
      ID_TRANSACCION: 123,
      FEC_TRANSACCION: '2024-06-08T10:00:00Z',
      update: sinon.stub().resolves()
    };

    userMock = { ID_USUARIO: 1 };

    sinon.stub(Transaction, 'findOne').resolves(transactionMock);
    sinon.stub(User, 'findOne').resolves(userMock);

    const timeHasPassedStub = sinon.stub().resolves(false); 
    deleteTransaction = createDeleteTransaction({ timeHasPassed: timeHasPassedStub });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('debe eliminar correctamente una transacción', async () => {
    await deleteTransaction(req, res);

    expect(transactionMock.update.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Transacción eliminada con éxito." })).to.be.true;
  });

  it('debe devolver error si no se encuentra el usuario', async () => {
    User.findOne.resolves(null);

    await deleteTransaction(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: "El usuario no tiene permiso de eliminar la transacción." })).to.be.true;
  });

  
});

//realizando test