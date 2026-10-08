import * as trackerMdl from "../models/trackerMdl.js";
import bcrypt from "bcryptjs";

import { generateAccesToken, generateRefreshToken, verifyRefreshToken } from "../../Utils/jwtutils.js";

// ===== AUTH =====
export const signupCtrl = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: "Name, phone, password required" });
    }
    const existing = await trackerMdl.findUserByPhoneMdl(phone);
    if (existing) return res.status(409).json({ success: false, message: "Phone already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await trackerMdl.createUserMdl({ name, phone, passwordHash });

    const accessToken = generateAccesToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (error) {
    console.error("signupCtrl error:", error);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

export const loginCtrl = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ success: false, message: "Phone and password required" });

    const user = await trackerMdl.findUserByPhoneMdl(phone);
    if (!user) return res.status(401).json({ success: false, message: "Invalid phone or password" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, message: "Invalid phone or password" });

    const accessToken = generateAccesToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.status(200).json({
      success: true,
      data: { user: { id: user.id, name: user.name, phone: user.phone }, accessToken, refreshToken },
    });
  } catch (error) {
    console.error("loginCtrl error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const refreshTokenCtrl = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token" });

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccesToken({ id: decoded.id });

    res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    console.error("refreshTokenCtrl error:", error);
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// ===== HABITS =====
export const getHabitsCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getHabitsWithTodayStatusMdl(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getHabitsCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch habits" });
  }
};

export const addHabitCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.createHabitMdl(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("addHabitCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to create habit" });
  }
};

export const updateHabitCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.updateHabitMdl(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("updateHabitCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to update habit" });
  }
};

export const archiveHabitCtrl = async (req, res) => {
  try {
    await trackerMdl.archiveHabitMdl(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: "Habit archived" });
  } catch (error) {
    console.error("archiveHabitCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to archive habit" });
  }
};

export const logHabitCtrl = async (req, res) => {
  try {
    const { status, note, mood } = req.body;
    const data = await trackerMdl.logHabitMdl(req.user.id, req.params.id, status, note, mood);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("logHabitCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to log habit" });
  }
};

export const getHabitHistoryCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getHabitHistoryMdl(req.user.id, req.params.id, req.query.month);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getHabitHistoryCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
};

export const getHabitStreakCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getHabitStreakMdl(req.user.id, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getHabitStreakCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch streak" });
  }
};

// ===== EXPENSES =====
export const getExpensesCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getTransactionsMdl(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getExpensesCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch expenses" });
  }
};

export const addExpenseCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.createTransactionMdl(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("addExpenseCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to add expense" });
  }
};

export const deleteExpenseCtrl = async (req, res) => {
  try {
    await trackerMdl.deleteTransactionMdl(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    console.error("deleteExpenseCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to delete expense" });
  }
};

export const getSummaryCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getSpendSummaryMdl(req.user.id, req.query.month);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getSummaryCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch summary" });
  }
};

export const getBudgetsCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getBudgetsWithSpentMdl(req.user.id, req.query.month);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getBudgetsCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch budgets" });
  }
};

export const setBudgetCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.upsertBudgetMdl(req.user.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("setBudgetCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to set budget" });
  }
};

export const getCategoriesCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getCategoriesMdl(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getCategoriesCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// ===== SETTINGS =====
export const getSettingsCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.getSettingsMdl(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getSettingsCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
};

export const updateSettingsCtrl = async (req, res) => {
  try {
    const data = await trackerMdl.updateSettingsMdl(req.user.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("updateSettingsCtrl error:", error);
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};