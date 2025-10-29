const db = require("../db");
const utils = require("../utils/utils");
const bcrypt = require("bcrypt");

//#region 사용자 관련 쿼리 함수

const loginUser = (userid, password, callback) => {
  const query = "SELECT * FROM users WHERE userid = ?";
  let result = {
    status: 200,
    error: null,
    user: null,
    token: null,
  };

  let error;
  let row;

  try {
    row = db.prepare(query).get(userid);

    if (row) {
      if (row.password === password) {
        delete row.password;

        result.user = row;
      } else {
        result.status = 400;
        result.error = "비밀번호가 틀렸습니다.";
      }
    } else {
      result.status = 404;
      result.error = "사용자를 찾을 수 없습니다.";
    }
  } catch (err) {
    result.status = 500;
    result.error = "로그인 중 오류가 발생했습니다.";
  }

  if (callback) {
    callback(result);
  }
};

// 사용자 추가 함수
const addUser = (body, callback) => {
  const convert = utils.makeInsertQuery(body, "users");
  const query = convert.query;
  const values = convert.values;

  let error;
  let result;

  try {
    result = db.prepare(query).run(values);
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error);
  }
};

// 모든 사용자 조회 함수
const getUsers = (callback) => {
  const query = `SELECT * FROM users`;

  let error;
  let result;

  try {
    result = db.prepare(query).all();
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error, result);
  }
};

// 특정 사용자 조회 함수
const getUserById = (userid, callback) => {
  const query = `SELECT * FROM users WHERE userid = ?`;

  let error;
  let result;

  try {
    result = db.prepare(query).get(userid);
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error, result);
  }
};

// 사용자 정보 수정 함수
const updateUser = (userid, body, callback) => {
  const convert = utils.makeUpdateQuery(body, "userid = ?", [userid], "users");
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

// 사용자 삭제 함수
const deleteUser = (userid, callback) => {
  const query = `DELETE FROM users WHERE userid = ?`;

  let error;

  try {
    db.prepare(query).run(userid);
  } catch (err) {
    error = err;
  }

  if (callback) {
    callback(error, 1);
  }
};

//#endregion

module.exports = {
  loginUser,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
