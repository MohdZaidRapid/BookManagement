const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bookstore API",
      version: "1.0.0",
      description:
        "RESTful API for managing a bookstore with JWT authentication and file-based storage.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
          required: ["email", "password"],
        },
        Book: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "8d4c8d12-91f2-4dd4-a637-489c3fc2f8bd",
            },
            title: {
              type: "string",
              example: "The Great Gatsby",
            },
            author: {
              type: "string",
              example: "F. Scott Fitzgerald",
            },
            genre: {
              type: "string",
              example: "Classic",
            },
            publishedYear: {
              type: "integer",
              example: 1925,
            },
            userId: {
              type: "string",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
          },
          required: ["title", "author", "genre", "publishedYear"],
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./app.js"], // Adjust if your routes are elsewhere
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
