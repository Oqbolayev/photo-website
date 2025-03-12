const pool = require("../config/db");

exports.likes = async (req, res) => {
  try {
    const { userId, photoId } = req.body;
    // Berilgan user berilgan photoga like bosganmi yo'qmi
    const isLiked = await pool.query(
      "SELECT * FROM likes WHERE userID = $1 and photoId = $2",
      [userId, photoId]
    );

    // Agar like bosgan bo'lsa, likeni o'chirib yuboramiz
    if (isLiked.rows.length > 0) {
      await pool.query("DELETE FROM likes WHERE userId = $1 and photoId = $2", [
        userId,
        photoId,
      ]);

      return res
        .status(200)
        .json({ message: "Like o`chirildi", isLiked: false });
    }

    // Aks holda yangi like yaratamiz
    await pool.query("INSERT INTO likes VALUES ($1, $2) RETURNING *", [
      userId,
      photoId,
    ]);

    res.status(201).json({ message: "Like qilindi", isLiked: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
}