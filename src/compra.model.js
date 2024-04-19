const {DataTypes} = require('sequelize');

const getCompraModel = (db) => {
  return db.define('compres', {
    idfactura: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    usuari: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idproducte: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    oferta: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    quantitat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  });
}

module.exports = {getCompraModel};
