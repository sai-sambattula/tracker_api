import { Router } from "express";
import * as TrackerCtrl from "../controllers/trackerCtrl.js";
import { authMiddleware } from "../../Middlewares/AuthMiddleware.js";


const TrackerRoutes = Router();


TrackerRoutes.post("/auth/signup", TrackerCtrl.signupCtrl);
TrackerRoutes.post("/auth/login", TrackerCtrl.loginCtrl);
TrackerRoutes.post("/auth/refresh", TrackerCtrl.refreshTokenCtrl);

TrackerRoutes.use(authMiddleware);

// Habits
TrackerRoutes.get("/habits", TrackerCtrl.getHabitsCtrl);
TrackerRoutes.post("/habits", TrackerCtrl.addHabitCtrl);
TrackerRoutes.put("/habits/:id", TrackerCtrl.updateHabitCtrl);
TrackerRoutes.delete("/habits/:id", TrackerCtrl.archiveHabitCtrl);
TrackerRoutes.post("/habits/:id/log", TrackerCtrl.logHabitCtrl);
TrackerRoutes.get("/habits/:id/history", TrackerCtrl.getHabitHistoryCtrl);
TrackerRoutes.get("/habits/:id/streak", TrackerCtrl.getHabitStreakCtrl);

// Expenses
TrackerRoutes.get("/expenses", TrackerCtrl.getExpensesCtrl);
TrackerRoutes.post("/expenses", TrackerCtrl.addExpenseCtrl);
TrackerRoutes.delete("/expenses/:id", TrackerCtrl.deleteExpenseCtrl);
TrackerRoutes.get("/expenses/summary", TrackerCtrl.getSummaryCtrl);
TrackerRoutes.get("/budgets", TrackerCtrl.getBudgetsCtrl);
TrackerRoutes.post("/budgets", TrackerCtrl.setBudgetCtrl);
TrackerRoutes.get("/categories", TrackerCtrl.getCategoriesCtrl);

// Settings
TrackerRoutes.get("/settings", TrackerCtrl.getSettingsCtrl);
TrackerRoutes.put("/settings", TrackerCtrl.updateSettingsCtrl);

export default TrackerRoutes;