import { Sequelize } from "sequelize";

const sequelize = new Sequelize("torrentpower", "root", "root", {
    dialect: "mysql",
    host: "database",
    port: 3307
    // host: "localhost",
});

async function fun() {
    try {
        await sequelize.authenticate();
        console.log('Db connection established successfully');
    } catch (error) {
        console.log("Unable to create db connection", error);
    }
}
fun();

export default sequelize;
