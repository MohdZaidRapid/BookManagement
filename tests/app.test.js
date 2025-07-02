const request = require("supertest");
const fs = require("fs");
const app = require("../app"); // your express app

let testToken = "";
let testBookId = "";

describe("Auth Routes", () => {
  test("Register a user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: `test+${Date.now()}@example.com`, // avoid duplicate
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered/i);
  });

  test("Login the user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    testToken = res.body.token;
  });
});

describe("Books Routes (Auth Required)", () => {
  test("Add a new book", async () => {
    const res = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        title: "Test Book",
        author: "Tester",
        genre: "Test",
        publishedYear: 2024,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Book");
    testBookId = res.body.id;
  });

  test("Get books", async () => {
    const res = await request(app)
      .get("/books")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Delete a book", async () => {
    const res = await request(app)
      .delete(`/books/${testBookId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
  });
});
