import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { server } from '../app.js';
import { TOKEN_SECRET } from '../config.js';

function generarUsuarioAleatorio() {
  const randomNum = Math.floor(Math.random() * 1000000);
  const phone = String(Math.floor(Math.random() * 100000000)).padStart(8, '8');
  const id = String(Math.floor(Math.random() * 100000000)).padStart(9, '7');

  return {
    DSC_NOMBREUSUARIO: `testuser${randomNum}`,
    DSC_CORREO: `test${randomNum}@email.com`,
    DSC_CONTRASENIA: "123456TesT.",
    CONFIRMARCONTRASENIA: "123456TesT.",
    DSC_TELEFONO: phone,
    ID_ROL: 1,
    DSC_CEDULA: id,
    DSC_NOMBRE: "Test",
    DSC_APELLIDOUNO: "TestAPUNO",
    DSC_APELLIDODOS: "TestAPDOS",
    ESTADO: 1,
  };
}

describe('POST /api/auth/register', () => {
  it('Debe registrar correctamente un usuario válido', async () => {
    const tokenPayload = { id: 1, username: "testuser" };
    const token = jwt.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '5m' });
    const nuevoUsuario = generarUsuarioAleatorio();

    const res = await request(server)
      .post('/api/auth/register')
      .set('Cookie', `token=${token}`)
      .send(nuevoUsuario);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('DSC_NOMBREUSUARIO', nuevoUsuario.DSC_NOMBREUSUARIO);
    expect(res.body).to.have.property('DSC_CORREO', nuevoUsuario.DSC_CORREO);
  });

  it('Debe fallar si las contraseñas no coinciden', async () => {
    const tokenPayload = { id: 1, username: "testuser" };
    const token = jwt.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '5m' });

    const usuarioInvalido = generarUsuarioAleatorio();
    usuarioInvalido.CONFIRMARCONTRASENIA = "diferente";

    const res = await request(server)
      .post('/api/auth/register')
      .set('Cookie', `token=${token}`)
      .send(usuarioInvalido);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.equals('Las contraseñas no coinciden.');
  });

  it('Debe fallar si faltan campos requeridos', async () => {
    const tokenPayload = { id: 1, username: "testuser" };
    const token = jwt.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '5m' });

    const res = await request(server)
      .post('/api/auth/register')
      .set('Cookie', `token=${token}`)
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.an('array');
  });

  it('Debe manejar error interno del servidor', async () => {

    const tokenPayload = { id: 1, username: "testuser" };
    const token = jwt.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '5m' });

    // Enviar datos mal formados para forzar error
    const res = await request(server)
      .post('/api/auth/register')
      .set('Cookie', `token=${token}`)
      .send({ DSC_NOMBREUSUARIO: null });

    expect(res.status).to.be.oneOf([400, 500]);
  });
});
