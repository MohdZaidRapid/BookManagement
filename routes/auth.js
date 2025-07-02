const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { readJSON, writeJSON } = require("../utils/fileHandler");

const router = express.Router();
const USERS_PATH = "./data/users.json";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const users = await readJSON(USERS_PATH);
  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: "Email exists" });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: Date.now().toString(), email, password: hashed });
  await writeJSON(USERS_PATH, users);
  res.status(201).json({ message: "User registered" });
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Token returned
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await readJSON(USERS_PATH);
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    "your_jwt_secret",
    { expiresIn: "1h" }
  );
  res.json({ token });
});

module.exports = router;
