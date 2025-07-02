# 📚 Bookstore REST API

A simple Node.js + Express REST API for managing a bookstore with:

- ✅ User authentication (JWT)
- ✅ File-based persistence using  files
- ✅ Protected routes for book management
- ✅ Book ownership enforcement (only creator can update/delete)
- ✅ Pagination & genre filtering support

---


## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/MohdZaidRapid/BookManagement.git
cd BookManagement
npm install
npm run start


[swaager api ](http://localhost:3000/api-docs/)
when user will retrun token after login api in swagger api please pass that token to authorize in swagger then request book api other wise it will give token not found error

🧪 Authentication Routes
Base URL: /auth

🔐 Register
POST /auth/register

Registers a new user.

Request:




{
  "email": "user@example.com",
  "password": "123456"
}
Response:




{
  "message": "User registered"
}
🔑 Login
POST /auth/login

Returns a JWT token for authentication.

Request:

{
  "email": "user@example.com",
  "password": "123456"
}
Response:

{
  "token": "<JWT_TOKEN>"
}
Use the token in all /books endpoints:

http


Authorization: Bearer <JWT_TOKEN>
📘 Book Routes (Protected)
All routes below require a valid JWT token.

Base URL: /books

📖 Get All Books
GET /books

Returns a list of all books.

Query Parameters (optional):

genre=<genre> — filter by genre

page=<page>&limit=<limit> — paginate results

Response:




[
  {
    "id": "uuid",
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Fiction",
    "publishedYear": 2021,
    "userId": "user-id"
  }
]
🔍 Get Book by ID
GET /books/:id

Returns a single book by its ID.

Response (found):




{
  "id": "uuid",
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "publishedYear": 2021,
  "userId": "user-id"
}
Response (not found):




{
  "message": "Book not found"
}
➕ Add New Book
POST /books

Adds a new book.

Request:




{
  "title": "New Book",
  "author": "Jane Doe",
  "genre": "Science",
  "publishedYear": 2023
}
Response:




{
  "id": "uuid",
  "title": "New Book",
  "author": "Jane Doe",
  "genre": "Science",
  "publishedYear": 2023,
  "userId": "authenticated-user-id"
}
✏️ Update Book by ID
PUT /books/:id

Only the user who created the book can update it.

Request:




{
  "title": "Updated Title"
}
Response (success):




{
  "id": "uuid",
  "title": "Updated Title",
  ...
}
Response (forbidden):




{
  "message": "Forbidden"
}
Response (not found):




{
  "message": "Book not found"
}
❌ Delete Book by ID
DELETE /books/:id

Only the user who created the book can delete it.

Response (success):




{
  "message": "Book deleted",
  "book": {
    "id": "uuid",
    "title": "Deleted Book",
    ...
  }
}
Response (forbidden / not found):




{
  "message": "Forbidden"
}

or




{
  "message": "Book not found"
}

# for testing run 
npm  test
