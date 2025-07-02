// tests/app.test.js

const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../app");
require("dotenv").config();

const USERS_PATH = path.resolve(__dirname, "../data/users.json");
const BOOKS_PATH = path.resolve(__dirname, "../data/books.json");

let testToken = "";
let testBookId = "";

beforeAll(() => {
  // Clear users and books before running tests
  fs.writeFileSync(USERS_PATH, "[]", "utf-8");
  fs.writeFileSync(BOOKS_PATH, "[]", "utf-8");
});

describe("Auth Routes", () => {
  test("Register a user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered");
  });

  test("Login the user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
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
        author: "John Doe",
        genre: "Fiction",
        publishedYear: 2022,
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
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Delete a book", async () => {
    const res = await request(app)
      .delete(`/books/${testBookId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Book deleted");
  });
});
