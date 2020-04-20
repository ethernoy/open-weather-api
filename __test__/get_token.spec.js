const supertest = require('supertest');
const app = require('../app.js');
const http = require('http');

describe("Test token retrieval api", () => {
	let server;

    beforeAll(done => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll(done => {
        server.close(done);
    });

	test("It should response a jwt object", done => {
	  supertest(app)
		.get("/")
		.then(response => {
		  expect(response.statusCode).toBe(200);
		  expect(typeof response.text).toBe('string');
		  done();
		});
	});
});