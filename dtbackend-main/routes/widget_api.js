const express = require("express");
const router = express.Router();
const widgetModel = require("../queries/widgetQuery");
const bodyParser = require("body-parser");
const authenticateToken = require("../middleware/auth");

//router.use(authenticateToken);

// 위젯 추가 (Create)
router.post("/", async (req, res) => {
  let body = req.body;

  widgetModel.addWidget(body, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ result: true });
    }
  });
});

// 특정 위젯 정보 조회 (Read)
router.get("/:userid", (req, res) => {
  const { userid } = req.params;

  widgetModel.getWidgetById(userid, (err, widget) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (widget) {
      res.json(widget);
    } else {
      res.status(404).json({ error: "Widget not found" });
    }
  });
});

// 위젯 정보 수정 (Update)
router.put("/:no", (req, res) => {
  const { no } = req.params;
  let body = req.body;

  widgetModel.updateWidget(no, body, (err, changes) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (changes === 0) {
      res.status(404).json({ error: "Widget not found" });
    } else {
      res.json({ message: "Widget updated successfully" });
    }
  });
});

// 위젯 삭제 (Delete)
router.delete("/:no", (req, res) => {
  const { no } = req.params;

  widgetModel.deleteWidget(no, (err, changes) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (changes === 0) {
      res.status(404).json({ error: "Widget not found" });
    } else {
      res.json({ message: "Widget deleted successfully" });
    }
  });
});

// 위젯 순서 변경
router.post("/changeorder", async (req, res) => {
  let body = req.body;

  widgetModel.changeOrderWidget(body, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ result: true });
    }
  });
});

module.exports = router;
