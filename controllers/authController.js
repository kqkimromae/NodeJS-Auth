import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../libss/prisma.js";

// ## REGISTER (แก้ไขใหม่ทั้งหมด) ##
export const register = async (req, res) => {
  // 1. รับแค่ username และ password จาก body
  const { username, password } = req.body;

  // 2. ตรวจสอบว่ามีข้อมูลส่งมาครบหรือไม่
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashed,
        // 3. ใช้ username เป็นค่าเริ่มต้นสำหรับ name เพื่อแก้ปัญหา NOT NULL
        name: username, 
        // role จะใช้ค่า default 'USER' จากฐานข้อมูลโดยอัตโนมัติ
      },
      select: { id: true, username: true, createdAT: true },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    // 4. ปรับปรุง Error Handling ให้ดีขึ้น
    console.error(err); // แสดง error ใน console ของ server
    
    // ดักจับ Error กรณีชื่อผู้ใช้ซ้ำ (Prisma error code P2002)
    if (err.code === 'P2002') {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    // Error อื่นๆ ให้ตอบกลับเป็นข้อความกลางๆ
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

// ## LOGIN (ปรับปรุงเล็กน้อย) ##
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username & password are required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, password: true },
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    
    // **ปรับปรุง:** ใช้ 'userId' (camelCase) เพื่อให้เป็นมาตรฐานเดียวกัน
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ## REFRESH (แก้ไข Bug) ##
export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    
    // **แก้ไข Bug:** เปลี่ยนจาก user.userId ที่เป็น undefined เป็น user.userId ที่ถูกต้อง
    const accessToken = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};