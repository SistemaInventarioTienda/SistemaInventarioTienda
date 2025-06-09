import { expect } from "chai";
import { registerSchema } from "../../schemas/auth.schema.js"; 

describe("registerSchema", () => {
  it("debe validar un usuario válido", () => {
    const result = registerSchema.safeParse({
      DSC_NOMBREUSUARIO: "danielbv",
      DSC_CONTRASENIA: "clave123",
      DSC_CORREO: "correo@ejemplo.com",
      DSC_TELEFONO: "88889999",
      ID_ROL: 1,
      DSC_CEDULA: "123456789",
      DSC_NOMBRE: "Daniel",
      DSC_APELLIDOUNO: "Barquero",
      DSC_APELLIDODOS: "Vargas",
      FEC_CREADOEN: new Date(),
      ESTADO: 1,
    });

    expect(result.success).to.be.true;
  });

  it("debe fallar si el correo es inválido", () => {
    const result = registerSchema.safeParse({
      DSC_NOMBREUSUARIO: "danielbv",
      DSC_CONTRASENIA: "clave123",
      DSC_CORREO: "no-es-un-correo",
      DSC_TELEFONO: "88889999",
      ID_ROL: 1,
      DSC_CEDULA: "123456789",
      DSC_NOMBRE: "Daniel",
      DSC_APELLIDOUNO: "Barquero",
      DSC_APELLIDODOS: "Vargas",
      FEC_CREADOEN: new Date(),
      ESTADO: 1,
    });

    expect(result.success).to.be.false;
    expect(result.error.issues[0].message).to.equal("El correo no es válido.");
  });

  it("debe fallar si el nombre de usuario tiene menos de 3 caracteres", () => {
    const result = registerSchema.safeParse({
      DSC_NOMBREUSUARIO: "da",
      DSC_CONTRASENIA: "clave123",
      DSC_CORREO: "correo@ejemplo.com",
      DSC_TELEFONO: "88889999",
      ID_ROL: 1,
      DSC_CEDULA: "123456789",
      DSC_NOMBRE: "Daniel",
      DSC_APELLIDOUNO: "Barquero",
      DSC_APELLIDODOS: "Vargas",
      FEC_CREADOEN: new Date(),
      ESTADO: 1,
    });

    expect(result.success).to.be.false;
    expect(result.error.issues[0].message).to.equal("El nombre de usuario debe tener minimo 3 caracteres.");
  });
});
