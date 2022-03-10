import { Router } from 'express';
import middlewares from '../middlewares/index.js';
import Logger from '../../loaders/logger.js';
import passport from '../../config/passport.js';
import sequelize from '../../models/index.js';
import initModels from "../../models/init-models.js";
import _ from 'lodash';
import { Container } from 'typedi';
import vehicleService from '../../services/vehicle.js';
import general from '../middlewares/general.js';

const route = Router();
const model = initModels(sequelize);

export default (app) => {

    // for this assignment I could use this logger directly
    // but i am using this DI for getting logger
    const logger = Container.get('logger');

    app.use('/user', route);

    route.post('/addVehicle', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), middlewares.validation.postVehicle, async (req, res, next) => {
        try {
            let inputData = req.body;
            inputData = { ...inputData, userId: req.user.id }

            const model = Container.get('Vehicle');
            const instance = new vehicleService(model, logger);
            const data = await instance.AddCar(inputData);

            return res.success(data);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
    route.get('/viewCars', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), async (req, res, next) => {
        try {

            const id = req.user.id;

            const model = Container.get('Vehicle');
            const instance = new vehicleService(model, logger);

            const data = await instance.AllCars(id);

            return res.success(data);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });

    route.put('/updateVehicle/:id', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), middlewares.validation.updateVehicle, async (req, res, next) => {
        try {

            let id = req.params.id;
            let data = req.body

            model.Vehicle.findOne({
                where: {
                    id,
                    userId: req.user.id
                }
            })
                .then(async (vehicle) => {
                    if (!vehicle) {
                        let error = new Error();
                        error.message = "Vehicle Not Found";
                        error.name = "permission"
                        error.status = 404;
                        throw error
                    };
                    // Update vehicle
                    if (data) {
                        vehicle.set(data)
                        vehicle.save()
                    }
                    res.success({
                        success: true,
                        msg: 'Successfully Updated',
                        vehicle
                    })
                }).catch((e) => {
                    Logger.error('% Error %', e)
                    throw e
                })
        } catch (e) {
            Logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
    route.delete('/deleteVehicle/:id', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), async (req, res, next) => {
        try {

            let id = req.params.id;

            model.Vehicle.findOne({
                where: {
                    id,
                    userId: req.user.id
                }
            })
                .then(async (vehicle) => {
                    if (!vehicle) {
                        let error = new Error();
                        error.message = "Cannot delete vehicle";
                        error.name = "permission"
                        error.status = 404;
                        res.send({
                            msg: 'Cannot delete'
                        })
                        return
                    };
                    // Delete vehicle
                    vehicle.destroy();
                    vehicle.save();
                    res.success({
                        success: true,
                        msg: 'Successfully Deleted',
                        vehicle
                    })
                }).catch((e) => {
                    Logger.error('% Error %', e)
                    throw e
                })
        } catch (e) {
            Logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
}

