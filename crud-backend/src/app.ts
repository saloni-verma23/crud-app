import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  // res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
