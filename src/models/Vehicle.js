
import _sequelize from 'sequelize';

const { Model, Sequelize } = _sequelize;

export default class Vehicle extends Model {
    static associate(models) {
        this.belongsTo(models.User, { as: 'User' });
    }
    static init(sequelize, DataTypes) {
        super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            vehicleType: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            vehicleName: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            vehicleNumber: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            vehicleModel: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            /*    userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {         // User hasMany Vehicles 1:n
                        model: 'User',
                        key: 'id'
                    }
                }*/
        }, {
            sequelize,
            tableName: 'Vehicle',
            timestamps: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id" },
                    ]
                }
            ]
        });
        return Vehicle;
    }
}