const db = require("../db");
const utils = require("../utils/utils");

//#region 위젯 관련 쿼리 함수

// 위젯 추가 함수
const addWidget = (body, callback) => {
  const convert = utils.makeInsertQuery(body, "widgets");
  const query = convert.query;
  const values = convert.values;

  let error;

  try {
    db.prepare(query).run(values);
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error);
  }
};

// 특정 위젯 조회 함수
const getWidgetById = (userid, callback) => {
  const query = `SELECT * FROM widgets WHERE userid = ? ORDER BY prenum ASC`;

  let error;
  let result;

  try {
    result = db.prepare(query).all(userid);
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error, result);
  }
};

// 위젯 정보 수정 함수
const updateWidget = (no, body, callback) => {
  const convert = utils.makeUpdateQuery(body, "no = ?", [no], "widgets");
  const query = convert.query;
  const values = convert.values;

  let error;

  try {
    db.prepare(query).run(values);
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error, 1);
  }
};

// 위젯 삭제 함수
const deleteWidget = (no, callback) => {
  const query = `DELETE FROM widgets WHERE no = ?`;

  let error;

  try {
    db.prepare(query).run(no);
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error, 1);
  }
};

const changeOrderWidget = (list) => {
  list.forEach((item) => {
    const query = `UPDATE widgets SET prenum = ? WHERE no = ?`;
    try {
      db.prepare(query).run(item.prenum, item.no);
    } catch (err) {
      // 에러 핸들링 필요시 추가
    }
  });
};

//#endregion

module.exports = {
  addWidget,
  getWidgetById,
  updateWidget,
  deleteWidget,
  changeOrderWidget,
};
