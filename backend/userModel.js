const db = require('./db');
async function findByUsername(username) {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  } catch (err) {
    console.error('DB error in findByUsername:', err);
    throw err; // rethrow so caller knows it failed
  }
}
async function createUser(user) {
  const { user_f_name, user_l_name, username, email, password, role } = user;
  try {
    await db.execute(
      `INSERT INTO users (user_f_name, user_l_name, username, email, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_f_name, user_l_name, username, email, password, role]
    );
  } catch (err) {
    console.error('DB error in createUser:', err);
    throw err;
  }
}
async function findByEmail(email) {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (err) {
    console.error('DB error in findByEmail:', err);
    throw err;
  }
}

module.exports = {
  findByUsername,
  findByEmail,
  createUser
};
