const pool = require("../config/db");
const jwt = require("jsonwebtoken");

exports.addPhoto = async (req, res) => {
  try {
    const { userId } = req.body;
    const filepath = req.file.path;
    const result = await pool.query(
      "INSERT INTO photos (filepath, userId) VALUES ($1, $2) RETURNING *",
      [filepath, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Xatolik:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// Foydalanuvchining rasmlarini olish
exports.getPhotos = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId talab qilinadi" });
    }

    const result = await pool.query(
      `SELECT 
          photos.id, 
          photos.filepath,   
          users.firstname,  
          users.lastname,  
          COUNT(likes.photoId) AS likeCount,
          EXISTS (
              SELECT 1 FROM likes WHERE likes.userId = $1 AND likes.photoId = photos.id
          ) AS isLiked
      FROM photos
      LEFT JOIN likes ON likes.photoId = photos.id
      INNER JOIN users ON photos.userId = users.id
      GROUP BY photos.id, users.id;`,
      [userId]
    );
    const photos = result.rows.map(photo =>{
      return {...photo,url:'http://localhost:4000/' + photo.filepath}
    })
    
    res.status(200).json(photos);

  } catch (error) {
    console.error("Xatolik:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

exports.myPhotos = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    
    const resultUser = await pool.query(
      "SELECT * FROM photos WHERE userId = $1",
      [userId]
    );
    res.status(200).json(resultUser.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};


// Rasmni o'chirish
exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query("DELETE FROM photos WHERE id = $1 RETURNING *", [id]);
    if (del.rowCount === 0) {
      return res.status(404).json({ message: "Rasm topilmadi yoki allaqachon o‘chirilgan" });
    }

    res.status(200).json({ message: "Rasm muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    console.error("Xatolik:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};


