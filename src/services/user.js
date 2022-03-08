import sequelize from '../models/index.js';
import initModels from "../models/init-models.js";
import seq from 'sequelize';
import _ from 'lodash';
import { Container } from 'typedi';
import helpingService from './helping.service.js';
import general from '../api/middlewares/general.js';
import Logger from '../loaders/logger.js';

const model = initModels(sequelize);

// this is the service class for Admin Users 
// it takes care of quering the database

export default class UserService {

    // getting the model and other dependencies through arguments
    // not importing and directly defining anything
    constructor(model, logger) {
        this.model = model;
        this.defaultLimit = 20;
        this.logger = logger;
    }

    async AddNew(input) {
        try {
            let user = await model.User.findOne({ where: { email: input.email }, attributes: ['id'] })
            if (!user) {

                let newUser = await model.User.create(input);

                newUser.salt = newUser.makeSalt()
                newUser.hashedPassword = newUser.encryptPassword(input.password, newUser.salt);
                newUser.save();

                let result = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
                return result
            }
            if (user) {
                let error = new Error();
                error.message = "User Already Exist";
                error.name = "duplication"
                error.status = 409;
                throw error
            }
        } catch (e) {
            throw e;
        }
    }

    async update(data, id) {
        try {
            model.User.findOne({
                where: {
                    id
                }
            })
                .then(async (user) => {
                    if (!user) {
                        let error = new Error();
                        error.message = "User Not Found";
                        error.name = "permission"
                        error.status = 404;
                        throw error
                    };
                    // Update user
                    if (data) {
                        user.set(data)
                        user.save()
                    }
                    return user;
                }).catch((e) => {
                    throw e
                })
        } catch (e) {
            throw e;
        }
    }

    async login(input) {
        let email = input.email
        let password = input.password
        let userData = {};

        try {
            // check if email exist
            let user = await model.User.findOne({
                where: { email: email }
            });

            if (!user || !user.salt || !user.hashedPassword) {
                let error = new Error();
                error.message = "Invalid email or Password.";
                error.name = "permission"
                error.status = 401;
                throw error
            }
            if (!user.authenticate(password)) {
                let error = new Error();
                error.message = "Invalid email or Password.";
                error.name = "permission"
                error.status = 401;
                throw error
            }

            userData.userInfo = user
            const tokenData = {
                id: userData.userInfo.id,
                name: userData.userInfo.name,
                email: userData.userInfo.email
            }

            userData.userInfo = {
                ...tokenData,
            }

            let token = await helpingService.signLoginData({ data: tokenData });
            token = await general.encryptData(token);
            userData.tokenInfo = token;
            return userData;
        } catch (e) {
            throw (e);
        }
    }

    async changePassword(data, id) {
        try {

            let user = await model.User.findOne({ where: { id } })
            if (!user) throw "User not found";
            if (!user.authenticate(data.oldPassword)) {
                let error = new Error();
                error.message = "Old Password is wrong";
                error.name = "permission"
                error.status = 400;
                throw error
            }
            user.salt = user.makeSalt()
            // hashing newPassword, encrypted
            user.hashedPassword = user.encryptPassword(data.newPassword, user.salt)

            // save user
            await user.save()
            return user;
            // check if phone exist and isDeleted equal to false
        } catch (e) {
            Logger.error('🔥 error: %o', e);
            // console.log(e)
            throw e
        }
    }

    async validation(id) {
        try {
            let userData = {}
            // check if email exist
            let user = await model.User.findOne({
                where: { id }
            });

            userData.userInfo = user
            const tokenData = {
                id: userData.userInfo.id,
                name: userData.userInfo.name,
                email: userData.userInfo.email
            }

            userData.userInfo = {
                ...tokenData,
            }

            let token = await helpingService.signLoginData({ data: tokenData });
            token = await general.encryptData(token);
            userData.tokenInfo = token;
            return userData;
        } catch (e) {
            throw e;
        }
    }
};