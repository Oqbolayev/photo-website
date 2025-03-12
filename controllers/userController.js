const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Foydalanuvchilarni olish
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Xatolik:", error.message);
    res.status(500).send("Serverda ichki xatolik yuz berdi");
  }
};

// Ro'yxatdan o'tish (signup)
exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;

    // Foydalanuvchi bor-yo‘qligini tekshirish
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 LIMIT 1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Bu username allaqachon mavjud" });
    }

    // Parolni shifrlash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yangi foydalanuvchini kiritish
    const newUser = await pool.query(
      "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstname, lastname, username, hashedPassword]
    );

    res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    console.error("Xatolik:", error.message);
    res.status(500).send("Serverda ichki xatolik yuz berdi");
  }
};

// Tizimga kirish (login)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Username bo‘yicha foydalanuvchini qidirish
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1 LIMIT 1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Username yoki parol noto‘g‘ri" });
    }

    const user = userResult.rows[0];

    // Parolni tekshirish
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Parol noto‘g‘ri" });
    }

    // JWT token yaratish
    const token = jwt.sign(
      { userId: user.id, username: user.username },
       "men senga bir gap aytaman ,hech kim bilmasin",
      { expiresIn: "10m" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Xatolik:", error.message);
    res.status(500).send("Serverda ichki xatolik yuz berdi");
  }
};
