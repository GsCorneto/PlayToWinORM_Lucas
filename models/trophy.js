const db = require("../db/conn")
const {DataTypes} = require ("sequelize")

const Jogo = require("./usuario")

const Trofeu = db.define("Trofeu", {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "Trofeis"
});

Trofeu.belongsTo(Jogo);
Jogo.hasMany(Trofeu);

module.exports = Trofeu;