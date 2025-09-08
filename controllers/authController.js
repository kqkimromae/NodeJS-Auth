import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../libss/prisma.js";
// register function
export const register = async (req, res) => {
  const { username, password, name, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, role, username, password: hashed, },
      select: { id: true, username: true, createdAT: true },
    });
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ message: "username & password are required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { username }, // ต้องกำหนด @unique ที่ username
      select: { id: true, username: true, password: true },
    });
    if (!user) return res.status(400).json({ message: "User not found" });
    // เทียบรหัสผ่าน
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    // ออก token

    const accessToken = jwt.sign(
      { userid: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { userid: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};