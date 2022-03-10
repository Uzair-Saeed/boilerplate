import sequelize from '../models/index.js';
import initModels from "../models/init-models.js";
import seq from 'sequelize';
import _ from 'lodash';
import { Container } from 'typedi';
import helpingService from './helping.service.js';
import general from '../api/middlewares/general.js';
import Logger from '../loaders/logger.js';
import vehicle from '../api/routes/vehicle.js';

const model = initModels(sequelize);

export default class VehicleService {
    // getting the model and other dependencies through arguments
    // not importing and directly defining anything
    constructor(model, logger) {
        this.model = model;
        this.defaultLimit = 20;
        this.logger = logger;
    }

    async AddCar(input) {
        try {
            let user = await model.User.findOne({ where: { id: input.userId }, attributes: ['id'] });

            if (!user) {
                let error = new Error();
                error.message = "User doesn't Exist";
                error.name = "No Record"
                error.status = 409;
                throw error

            }
            if (user) {
                let newCar = await model.Vehicle.create(input);

                let result = {
                    vehicleType: newCar.vehicleType,
                    vehicleName: newCar.vehicleName,
                    vehicleNumber: newCar.vehicleNumber,
                    vehicleModel: newCar.vehicleModel,
                    userId: newCar.userId
                }
                return result
            }
        } catch (e) {
            throw e;
        }
    };
    async BulkAddCars(input) {
        try {
            let user = await model.User.findOne({ where: { id: input.userId }, attributes: ['id'] });
            let vehicles = input.vehicles;

            vehicles.forEach((vehicle) => {
                vehicle.userId = input.userId
            });
            console.log(vehicles);
            if (!user) {
                let error = new Error();
                error.message = "User doesn't Exist";
                error.name = "No Record"
                error.status = 409;
                throw error

            }
            console.log(input);
            if (user) {
                let newCars = await model.Vehicle.bulkCreate(vehicles);

                let result = newCars
                return result
            }
        } catch (e) {
            throw e;
        }
    };
    async BulkUpdateCars(input) {
        try {
            let user = await model.User.findOne({ where: { id: input.userId }, attributes: ['id'] });
            let vehicles = input.vehicles;

            vehicles.forEach((vehicle) => {
                vehicle.userId = input.userId
            });
            console.log(vehicles);
            if (!user) {
                let error = new Error();
                error.message = "User doesn't Exist";
                error.name = "No Record"
                error.status = 409;
                throw error

            }
            console.log(input);
            if (user) {
                let newCars = await model.Vehicle.bulkCreate(vehicles,
                    {
                        updateOnDuplicate: ['vehicleType', "vehicleName", "vehicleNumber", "vehicleModel", "updatedAt"]
                    });

                let result = newCars
                return result
            }
        } catch (e) {
            throw e;
        }
    };
    async AllCars(id) {
        try {
            let carsData = {}
            // check if email exist
            let cars = await model.Vehicle.findAll({
                where: { userId: id }
            });

            carsData = cars
            return carsData;
        } catch (e) {
            throw e;
        }
    }
};