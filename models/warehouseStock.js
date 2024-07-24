import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const User = sequelize.define("User", {
    boxNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shelfNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    RackNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default User;
