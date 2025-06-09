import request from 'supertest';
import { server } from '../app.js';
import { expect } from 'chai';

let token = '';
let supplierName = `ProveedorTest-${Date.now()}`;
let phone = `12345${Math.floor(Math.random() * 1000)}`;
let email = `correo-${Date.now()}@proveedortest.com`;
let iban = `ES6621000418401234567${Math.floor(Math.random() * 1000)}`;

describe('Pruebas del módulo de Proveedores', () => {

    before((done) => {
        request(server)
            .post('/api/auth/login')
            .send({
                DSC_NOMBREUSUARIO: 'admin',
                DSC_CONTRASENIA: 'adminadmin'
            })
            .end((err, res) => {
                if (err) return done(err);

                const setCookie = res.header['set-cookie'];
                const tokenCookie = setCookie?.find(cookie => cookie.startsWith('token='));
                token = tokenCookie?.split(';')[0].replace('token=', '');

                expect(token).to.be.a('string');
                done();
            });
    });

    it('Debe crear un proveedor válido', (done) => {
        request(server)
            .post('/api/supplier/saveSupplier') 
            .set('Cookie', `token=${token}`)
            .send({
                DSC_NOMBRE: supplierName,
                ID_TIPOPROVEEDOR: 1,
                ESTADO: 1,
                CTA_BANCARIA: iban,//"ES6621000418401234567890"
                DSC_DIRECCIONEXACTA: "Calle TEST 123",
                DSC_VENTA: "Venta de productos",
                phones: [{ DSC_TELEFONO: phone }],
                emails: [{ DSC_CORREO: email }]
            })
            .expect(201)
            .end((err, res) => {
                console.log(res.body); //Muestra el mensaje del backend
                expect(res.body).to.have.property('message');
                done(err);
            });
    });

});