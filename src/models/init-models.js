import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _User from "./User.js";
import _Vehicle from "./Vehicle.js";


export default function initModels(sequelize) {

  var User = _User.init(sequelize, DataTypes);
  var Vehicle = _Vehicle.init(sequelize, DataTypes);

  User.hasMany(Vehicle, { as: 'vehicles', foreignKey: 'userId' });
  Vehicle.belongsTo(User, { as: 'user', foreignKey: 'userId' });


  return {
    User,
    Vehicle
  };
}
