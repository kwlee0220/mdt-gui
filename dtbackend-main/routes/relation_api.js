const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const router = express.Router();
const axios = require("axios");
const https = require("https");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // self-signed 인증서 무시
});

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL are required" });
  }

  console.log("relation url:", url);

  try {
    const response = await axios.get(url, { httpsAgent });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message });
  }
});

router.post("/image", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL are required" });
  }

  console.log("relation url:", url);

  try {
    const response = await axios.get(url, {
      httpsAgent,
      responseType: "arraybuffer",
    });

    res.set("Content-Type", response.headers["content-type"]);
    return res.send(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message });
  }
});

router.post("/upload", upload.single("content"), async (req, res) => {
  const { originalname, mimetype, buffer } = req.file;
  const { url } = req.body;

  const form = new FormData();
  form.append("fileName", originalname);
  form.append("contentType", mimetype);
  form.append("content", buffer);

  if (!url) {
    return res.status(400).json({ message: "URL are required" });
  }

  console.log("upload url:", url);

  try {
    const response = await axios.put(url, form, {
      httpsAgent: httpsAgent,
      headers: form.getHeaders(),
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message });
  }
});

router.patch("/", async (req, res) => {
  const { url, data } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL are required" });
  }

  console.log("relation url:", url);

  try {
    const response = await axios.patch(url, data, { httpsAgent });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message });
  }
});

module.exports = router;
