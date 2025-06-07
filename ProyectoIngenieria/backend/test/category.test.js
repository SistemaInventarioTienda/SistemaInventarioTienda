import request from 'supertest';
import { server } from '../app.js';
import { expect } from 'chai';

let token = '';
let categoryName = `CategoriaTest-${Date.now()}`;

describe('Pruebas del módulo de Categorías', () => {
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

    it('Debe obtener todas las categorías (o manejar 204 sin error)', (done) => {
        request(server)
            .get('/api/category/categories')
            .set('Cookie', `token=${token}`)
            .end((err, res) => {
                if (res.status === 204) {
                    console.log('✔ No hay categorías registradas actualmente (204)');
                    return done(); // pasa la prueba igual
                }

                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('category').that.is.an('array');
                done(err);
            });
    });

    it('Debe agregar una categoría válida', (done) => {
        request(server)
            .post('/api/category/saveCategory')
            .set('Cookie', `token=${token}`)
            .send({
                DSC_NOMBRE: categoryName,
                ESTADO: 1
            })
            .expect(201)
            .end((err, res) => {
                expect(res.body).to.have.property('message');
                expect(res.body.message[0]).to.include('exito');
                done(err);
            });
    });

    it('Debe rechazar categoría inválida (sin nombre)', (done) => {
        request(server)
            .post('/api/category/saveCategory')
            .set('Cookie', `token=${token}`)
            .send({ ESTADO: 1 })
            .expect(400)
            .end((err, res) => {
                expect(res.body).to.have.property('message');
                done(err);
            });
    });

    after((done) => {
        request(server)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`)
            .end((err, res) => {
                if (err) return done(err);

                console.log('✔ Sesión terminada después del test');
                token = ''; 
                done();
            });
    });
});
