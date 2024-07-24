import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const FileData = sequelize.define("FileData", {
    CSA: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    noOfPages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    typeOfRequest: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfApplication: {
        type: DataTypes.DATE,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

export default FileData;
