const supertest = require('supertest');
const app = require('../app.js');
const http = require('http');

describe("Test weather retrieval api", () => {
	let server;

    beforeAll(done => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll(done => {
        server.close(done);
    });

	test("It should response 401 since no token is provided", done => {
		supertest(app)
		.get("/weather")
		.then(response => {
			expect(response.statusCode).toBe(401);
			done();
		})
	});

	test("It should response a weather object", done => {
	  supertest(app)
		.get("/token")
		.then(response => {
			expect(response.statusCode).toBe(200);
			const token = `Bearer ${response.text}`;
			supertest(app)
			.get("/weather")
			.set("Authorization", token)
			.then(response => {
				expect(response.statusCode).toBe(200);
				expect(typeof response.body).toBe('object');
				expect(response.body).toHaveProperty("weather");
				done();
			});
		});
	});

	// test("It should response a weather object from db", done => {
	// 	supertest(app)
	// 	  .get("/token")
	// 	  .then(response => {
	// 		  expect(response.statusCode).toBe(200);
	// 		  const token = `Bearer ${response.text}`;
	// 		  supertest(app)
	// 		  .get("/weather/db")
	// 		  .set("Authorization", token)
	// 		  .then(response => {
	// 			  expect(response.statusCode).toBe(200);
	// 			  expect(typeof response.body).toBe('object');
	// 			  expect(response.body).toHaveProperty("weather");
	// 			  done();
	// 		  })
	// 		  done();
	// 	  });
	//   });
});