import { expect } from "chai";
import { validateSupplierData } from "../../logic/validateFields.logic.js";
import { createSupplier } from "../../controllers/supplier.controller.js";
describe("Proveedor - validacion simple de nombre", () => {
    //1era Prueba
  it("Debe rechazar un proveedor sin nombre", () => {
    const req = {
      body: {
        DSC_DIRECCIONEXACTA: "Calle Falsa 123",
        ID_TIPOPROVEEDOR: 1,
        ESTADO: "Activo",
        phones: [],
        emails: [],
      },
    };

    const resp = validateSupplierData(req);
    expect(resp).to.include(
      "El campo DSC_NOMBRE es requerido y no puede estar vacío."
    );
  });
//2da Prueba
  it("Debe fallar si el correo es inválido", async () => {
    const req = {
      body: {
        DSC_NOMBRE: "Proveedor Test",
        DSC_DIRECCIONEXACTA: "Calle Falsa 123",
        ID_TIPOPROVEEDOR: 1,
        ESTADO: 1,
        phones: [{DSC_TELEFONO: 12345678}],
        emails: [{ DSC_CORREO: "correo-invalido" }],
      },
    };

    const res = {
      status: (code) => {
        expect(code).to.equal(400);
        return {
          json: (data) => {
            expect(data.message).to.include("El correo no es válido.");
          },
        };
      },
    };

    await createSupplier(req, res);
  });
 //3era Prueba
  it("Debe aceptar datos válidos", () => {
    const req = {
        body: {
            DSC_NOMBRE: "Proveedor Test",
            DSC_DIRECCIONEXACTA: "Calle Falsa 123",
            ID_TIPOPROVEEDOR: 1,
            ESTADO: 1,
            phones: [{ DSC_TELEFONO: "123456789" }],
            emails: [{ DSC_CORREO: "test@test.com" }]
        }
    };

    const result = validateSupplierData(req);
    expect(result).to.be.true;
});
});

//Prueba para workflow de github