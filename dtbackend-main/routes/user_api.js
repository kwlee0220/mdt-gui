const express = require("express");
const router = express.Router();
const userModel = require("../queries/userQuery");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/auth");

//router.use(authenticateToken);

// 모든 사용자 정보 조회 (Read)
router.get("/", (req, res) => {
  userModel.getUsers((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(users);
    }
  });
});

// 특정 사용자 정보 조회 (Read)
router.get("/:id", (req, res) => {
  const { id } = req.params;

  userModel.getUserById(id, (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// 사용자 정보 수정 (Update)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let body = req.body;

  userModel.updateUser(id, body, (err, changes) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (changes === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ message: "User updated successfully" });
    }
  });
});

// 사용자 삭제 (Delete)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  userModel.deleteUser(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (changes === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

module.exports = router;
