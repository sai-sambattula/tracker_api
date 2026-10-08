import express from "express";
import TrackerRoutes from "./routes/trackerRoutes.js";

const indexappRouter = express();

indexappRouter.use("/n",TrackerRoutes);

export default indexappRouter;