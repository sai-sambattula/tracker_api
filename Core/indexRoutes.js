import express from "express";
import TrackerRoutes from "./routes/trackerRoutes.js";

const indexappRouter = express();

indexappRouter.use("/",TrackerRoutes);

export default indexappRouter;