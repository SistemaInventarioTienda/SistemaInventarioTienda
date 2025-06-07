import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { server } from "../app.js";
import { TOKEN_SECRET } from "../config.js";


function generarUsuarioAleatorio() {
    const randomNum = Math.floor(Math.random() * 1000000);
    return {
      DSC_CEDULA: `${100000000 + randomNum}`, 
      DSC_NOMBRE: 'Josue',
      DSC_APELLIDOUNO: 'Porras',
      DSC_APELLIDODOS: 'Rojas',
      ESTADO: 1,
      DSC_DIRECCION: 'San José',
      telefonos: [{ numeroTelefono: `8888${(999 + randomNum).toString().slice(-4)}` }]
    };
  }
  
describe('POST /api/clientes', () => {
  it('Debe registrar un cliente válido', async () => {
    // Token válido que expira en 5 segundos
    const tokenPayload = { id: 1, username: "testuser" };
    const token = jwt.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '5s' });
    const usuario = generarUsuarioAleatorio();
    const res = await request(server)
      .post('/api/client/register')
      .set('Cookie', `token=${token}`)
      .send(usuario);

    expect(res.status).to.equal(200);
    expect(res.body.cliente).to.have.property("DSC_CEDULA", usuario.DSC_CEDULA);
  });
});
