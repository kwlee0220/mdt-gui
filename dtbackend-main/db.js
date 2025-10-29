// db.js
const bcrypt = require("bcrypt");
const Database = require("better-sqlite3");

//#region 테이블 생성 쿼리

// 사용자 테이블 쿼리
const query_create_users = `
      CREATE TABLE IF NOT EXISTS users (
        userid TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        description TEXT,
        grade INTEGER DEFAULT 0 NOT NULL,
        regdate TEXT DEFAULT (DATETIME(CURRENT_TIMESTAMP, '+9 hours'))
      )
    `;

// 사용자 테이블 쿼리
const query_create_widget = `
        CREATE TABLE IF NOT EXISTS widgets (
          no integer PRIMARY KEY,
          prenum integer,
          userid TEXT NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          size TEXT NOT NULL,
          link TEXT,
          params TEXT,
          interval TEXT,
          widget TEXT,
          etc TEXT,
          regdate TEXT DEFAULT (DATETIME(CURRENT_TIMESTAMP, '+9 hours'))
        )
      `;

//#endregion

const path = require("path");

// SQLite 데이터베이스 연결
const dbPath = path.resolve(__dirname, "manager.db");

const db = new Database(dbPath);
db.prepare(query_create_users).run();
db.prepare(query_create_widget).run();

const userCount = db.prepare("Select COUNT(*) AS count From users").get().count;

if (userCount === 0) {
  const query = `INSERT OR IGNORE INTO users (userid, name, email, password, description, grade)
         VALUES (?, ?, ?, ?, ?, ?)`;

  const insert = db.prepare(query);
  insert.run(
    "admin",
    "관리자",
    "manager@etri.re.kr",
    "etri",
    "초기 등록 관리자",
    1
  );
  insert.run("love0042", "관리자", "love0042@zento.co.kr", "1111", "", 1);
  insert.run("etri", "관리자", "etri@etri.re.kr", "etri", "", 1);
  insert.run("mdt", "관리자", "mdt@etri.re.kr", "mdt2025", "", 1);
  console.log("기본 사용자(admin)를 생성했습니다.");
} else {
  console.log("사용자 테이블에 이미 데이터가 있습니다.");
}

module.exports = db;
