import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import fileDataRoutes from "./routes/fileDataRoutes.js"
import warehouseRoutes from "./routes/warehouseRoutes.js"; // Import warehouse routes
import taggingRoutes from "./routes/taggingRoutes.js"
import analysisRoutes from "./routes/analysisRoutes.js";
import bwipjs from 'bwip-js';
import FileData from "./models/FileData.js";
import Warehouse from "./models/warehouse.js";
import User from "./models/user.js";
import Tagging from "./models/tagging.js";

const app = express();
// create __dirname
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from "./helpers/authHelper.js";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/images", express.static(__dirname + '/images'));
// Routes setup
app.use("/", userRoutes); // Mount user routes at /api/users
app.use("/", fileDataRoutes);
app.use("/", warehouseRoutes);
app.use("/", taggingRoutes);
app.use("/", taggingRoutes);
app.use("/", analysisRoutes);



Warehouse.belongsTo(FileData, { foreignKey: "fileDataId" });
Tagging.belongsTo(FileData, { foreignKey: "fileDataId" });

const PORT = 8000;

// sequelize.sync({ alter: true }).then(() => {
sequelize.sync({ force: false }).then(async () => {

    // Check if the admin user table exists, if not, create it
    const adminUser = await User.findOne({ where: { email: "admin@gmail.com" } });
    const hashedPassword = await hashPassword("123456");
    if (!adminUser) {
        await User.create({
            userName: "admin",
            mobile: "1234567890",
            email: "admin@gmail.com",
            password: hashedPassword, // Ensure you set the hashedPassword here
            permissions: {
                dashboardAccess: true,
                fileEntryAccess: true,
                taggingAccess: true,
                wareHouseAccess: true,
                userManagementAccess: true,
            },
        });
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Unable to sync the database:', error);
});


