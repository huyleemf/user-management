export const getInfo = async (trx, table, id) => {
  return trx(table)
    .select("userId", "username", "email", "role")
    .where("userId", id)
    .first();
};
