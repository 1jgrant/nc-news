exports.up = function (knex) {
  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.text("slug").primary().notNullable();
    topicsTable.text("description");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("topics");
};
