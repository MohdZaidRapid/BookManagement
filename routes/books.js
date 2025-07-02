const express = require("express");
const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
const { readJSON, writeJSON } = require("../utils/fileHandler");

const router = express.Router();
const BOOKS_PATH = "./data/books.json";

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: List all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of books
 */
router.get("/", async (req, res) => {
  let books = await readJSON(BOOKS_PATH);
  const { genre, page = 1, limit = 10 } = req.query;

  if (genre) books = books.filter((b) => b.genre === genre);
  const start = (page - 1) * limit;
  const paginated = books.slice(start, start + Number(limit));

  res.json(paginated);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 */
router.get("/:id", async (req, res) => {
  const books = await readJSON(BOOKS_PATH);
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created
 */

router.post("/", async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;
  const books = await readJSON(BOOKS_PATH);

  const newBook = {
    id: uuidv4(),
    title,
    author,
    genre,
    publishedYear,
    userId: req.user.id,
  };

  books.push(newBook);
  await writeJSON(BOOKS_PATH, books);
  res.status(201).json(newBook);
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated
 */

router.put("/:id", async (req, res) => {
  const books = await readJSON(BOOKS_PATH);
  const index = books.findIndex((b) => b.id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Book not found" });
  if (books[index].userId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  books[index] = { ...books[index], ...req.body };
  await writeJSON(BOOKS_PATH, books);
  res.json(books[index]);
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete("/:id", async (req, res) => {
  const books = await readJSON(BOOKS_PATH);
  const index = books.findIndex((b) => b.id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Book not found" });
  if (books[index].userId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  const removed = books.splice(index, 1);
  await writeJSON(BOOKS_PATH, books);
  res.json({ message: "Book deleted", book: removed[0] });
});

module.exports = router;
