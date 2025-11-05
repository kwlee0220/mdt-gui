const makeInsertQuery = (body, tablename) => {
  const fields = Object.keys(body);
  const values = Object.values(body);
  const placeholders = fields.map(() => "?").join(", ");

  const query = `INSERT INTO ${tablename} (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;

  console.log("INSERT", tablename, query);

  return {
    query: query,
    values: values,
  };
};

const makeUpdateQuery = (body, str_filter, value_filter, tablename) => {
  const fields = Object.keys(body);
  let values = Object.values(body);
  let placeholders = fields.map((field, idx) => `${field} = ?`).join(", ");

  placeholders += ` WHERE ${str_filter}`;

  const mergeArr = [...values, ...value_filter];

  const query = `UPDATE ${tablename} SET ${placeholders}`;

  console.log("Update", tablename, query);

  return {
    query: query,
    values: mergeArr,
  };
};

module.exports = {
  makeInsertQuery,
  makeUpdateQuery,
};
