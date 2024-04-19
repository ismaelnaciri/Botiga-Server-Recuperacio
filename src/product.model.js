const {DataTypes} = require("sequelize");

const getProductModel = (db) => {
  return db.define("producte", {
    idproducte: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preu: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    oferta: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    }
  });
}

module.exports = {getProductModel};
