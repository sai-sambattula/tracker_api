import express from "express";
import TrackerRoutes from "./routes/trackerRoutes.js";

const indexappRouter = express();

indexappRouter.use("/t",TrackerRoutes);

export default indexappRouter;