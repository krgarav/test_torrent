import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Tagging = sequelize.define("Tagging", {
    documentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pdfFileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

});

export default Tagging;
