const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../queries/userQuery");

// 로그인
router.post("/login", (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res
      .status(400)
      .json({ error: "사용자 아이디와 비밀번호를 입력해주세요." });
  }

  userModel.loginUser(userid, password, (data) => {
    if (data) {
      if (data.status === 200) {
        const token = jwt.sign({ userid: userid }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        data.token = token;
      }

      res.status(data.status).json(data);
    } else {
      res.status(400).json({ error: "처리중 에러발생" });
    }
  });
});

// 사용자 추가 (Create)
router.post("/", async (req, res) => {
  let body = req.body;

  /*
  const hashedPassword = await bcrypt.hash(body.password, 10);

  body.password = hashedPassword;
  */

  userModel.addUser(body, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ result: true });
    }
  });
});

module.exports = router;
