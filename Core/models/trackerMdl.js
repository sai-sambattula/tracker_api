import { ExecuteQuery } from "../../Config/sqlHelper.js";
import { v4 as uuidv4 } from "uuid";



export async function findUserByPhoneMdl(phone) {
  const rows = await ExecuteQuery(`SELECT * FROM users WHERE phone = ?`, [phone]);
  return rows[0];
}

export async function createUserMdl({ name, phone, passwordHash }) {
  const id = uuidv4();
  await ExecuteQuery(`INSERT INTO users (id, name, phone, password_hash) VALUES (?,?,?,?)`, [id, name, phone, passwordHash]);
  await ExecuteQuery(`INSERT INTO settings (user_id) VALUES (?)`, [id]);
  return { id, name, phone };
} 

// ===== HABITS =====
export async function getHabitsWithTodayStatusMdl(userId) {
  const sql = `
    SELECT h.id, h.name, h.icon, COALESCE(l.status,'pending') AS status, l.note
    FROM habits h
    LEFT JOIN habit_logs l ON l.habit_id = h.id AND l.log_date = CURDATE()
    WHERE h.archived = 0 AND h.user_id = ?`;
  return await ExecuteQuery(sql, [userId]);
}

export async function createHabitMdl(userId, { name, icon, repeat_days, reminder_time }) {
  const id = uuidv4();
  await ExecuteQuery(
    `INSERT INTO habits (id, user_id, name, icon, repeat_days, reminder_time) VALUES (?,?,?,?,?,?)`,
    [id, userId, name, icon, repeat_days, reminder_time]
  );
  return { id, name, icon, repeat_days, reminder_time };
}

export async function updateHabitMdl(userId, habitId, f) {
  await ExecuteQuery(
    `UPDATE habits SET name=?, icon=?, repeat_days=?, reminder_time=? WHERE id=? AND user_id=?`,
    [f.name, f.icon, f.repeat_days, f.reminder_time, habitId, userId]
  );
  return { id: habitId, ...f };
}

export async function archiveHabitMdl(userId, habitId) {
  await ExecuteQuery(`UPDATE habits SET archived=1 WHERE id=? AND user_id=?`, [habitId, userId]);
}

export async function logHabitMdl(userId, habitId, status, note, mood) {
  const id = uuidv4();
  await ExecuteQuery(
    `INSERT INTO habit_logs (id, habit_id, user_id, log_date, status, note, mood)
     SELECT ?, id, ?, CURDATE(), ?, ?, ? FROM habits WHERE id=? AND user_id=?
     ON DUPLICATE KEY UPDATE status=VALUES(status), note=VALUES(note), mood=VALUES(mood)`,
    [id, userId, status, note, mood, habitId, userId]
  );
  return { habitId, status, note, mood };
}

export async function getHabitHistoryMdl(userId, habitId, month) {
  return await ExecuteQuery(
    `SELECT log_date, status, note FROM habit_logs
     WHERE habit_id=? AND user_id=? AND DATE_FORMAT(log_date,'%Y-%m')=? ORDER BY log_date`,
    [habitId, userId, month]
  );
}

export async function getHabitStreakMdl(userId, habitId) {
  const rows = await ExecuteQuery(
    `SELECT status FROM habit_logs WHERE habit_id=? AND user_id=? ORDER BY log_date DESC LIMIT 60`,
    [habitId, userId]
  );
  let streak = 0;
  for (const r of rows) { if (r.status === "done") streak++; else break; }
  return { current_streak: streak };
}

// ===== EXPENSES =====
export async function getTransactionsMdl(userId) {
  return await ExecuteQuery(
    `SELECT t.id, t.amount, t.note, t.type, t.txn_date, c.name AS category, c.icon
     FROM transactions t JOIN categories c ON c.id=t.category_id
     WHERE t.user_id=?
     ORDER BY t.txn_date DESC, t.created_at DESC LIMIT 20`,
    [userId]
  );
}

export async function createTransactionMdl(userId, { category_id, amount, note, type, txn_date }) {
  const id = uuidv4();
  await ExecuteQuery(
    `INSERT INTO transactions (id, user_id, category_id, amount, note, type, txn_date) VALUES (?,?,?,?,?,?,?)`,
    [id, userId, category_id, amount, note, type, txn_date || new Date().toISOString().slice(0, 10)]
  );
  return { id, category_id, amount, note, type, txn_date };
}

export async function deleteTransactionMdl(userId, id) {
  await ExecuteQuery(`DELETE FROM transactions WHERE id=? AND user_id=?`, [id, userId]);
}

export async function getSpendSummaryMdl(userId, month) {
  const rows = await ExecuteQuery(
    `SELECT SUM(amount) AS total_spent FROM transactions
     WHERE type='expense' AND user_id=? AND DATE_FORMAT(txn_date,'%Y-%m')=?`,
    [userId, month]
  );
  return rows[0];
}

export async function getBudgetsWithSpentMdl(userId, month) {
  return await ExecuteQuery(
    `SELECT c.name, c.icon, c.color, b.limit_amount, COALESCE(SUM(t.amount),0) AS spent
     FROM categories c
     JOIN budgets b ON b.category_id=c.id AND b.month=? AND b.user_id=?
     LEFT JOIN transactions t ON t.category_id=c.id AND t.type='expense' AND t.user_id=?
          AND DATE_FORMAT(t.txn_date,'%Y-%m')=?
     WHERE c.user_id=?
     GROUP BY c.id`,
    [month, userId, userId, month, userId]
  );
}

export async function upsertBudgetMdl(userId, { category_id, month, limit_amount }) {
  const id = uuidv4();
  await ExecuteQuery(
    `INSERT INTO budgets (id, user_id, category_id, month, limit_amount) VALUES (?,?,?,?,?)
     ON DUPLICATE KEY UPDATE limit_amount=VALUES(limit_amount)`,
    [id, userId, category_id, month, limit_amount]
  );
  return { category_id, month, limit_amount };
}

export async function getCategoriesMdl(userId) {
  return await ExecuteQuery(`SELECT * FROM categories WHERE user_id=?`, [userId]);
}

// ===== SETTINGS =====
export async function getSettingsMdl(userId) {
  const rows = await ExecuteQuery(`SELECT * FROM settings WHERE user_id=?`, [userId]);
  return rows[0];
}

export async function updateSettingsMdl(userId, f) {
  await ExecuteQuery(
    `UPDATE settings SET morning_reminder=?, night_reminder=?, reminders_on=?,
     day_count_threshold=?, rest_day=?, theme=?, monthly_budget=? WHERE user_id=?`,
    [f.morning_reminder, f.night_reminder, f.reminders_on, f.day_count_threshold,
     f.rest_day, f.theme, f.monthly_budget, userId]
  );
  return f;
}