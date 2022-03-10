import { celebrate, Joi } from 'celebrate';

// using celebrate which actually uses joi to validate requests
// adding common middlewares here to be used by the routes

export default {
    commonIdParameter: celebrate({
        params: {
            id: Joi.number().required(),
        }
    }),
    // ----------------- User --------------- //
    patchUser: celebrate({
        params: {
            id: Joi.string().max(250).required(),
        },
        body: Joi.object({
            first_name: Joi.string().min(2).max(25).optional(),
            last_name: Joi.string().min(2).max(25).optional(),
            email: Joi.string().email().min(5).max(250).optional(),
        }).min(1)
    }),
    postUser: celebrate({
        body: Joi.object({
            name: Joi.string().min(2).max(25).required(),
            email: Joi.string().email().min(5).max(250).optional(),
            gender: Joi.string().min(4).max(6).optional(),
            password: Joi.string().required()
        })
    }),
    postLogin: celebrate({
        body: Joi.object({
            password: Joi.string().min(6).max(20).required(),
            email: Joi.string().email().min(5).max(250).required()
        })
    }),
    postChangePassword: celebrate({
        body: Joi.object({
            oldPassword: Joi.string().min(6).max(20).required(),
            newPassword: Joi.string().min(6).max(20).required()
        })
    }),
    postForgetPassword: celebrate({
        body: Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required()
        })
    }),
    putUser: celebrate({
        body: Joi.object({
            name: Joi.string().min(2).max(25).required(),
            gender: Joi.string().min(4).max(6).optional(),
        }),
        params: {
            id: Joi.number().required()
        }
    }),
    // ----------------- SalesUser --------------- //
    postSalesPerson: celebrate({
        body: Joi.object({
            name: Joi.string().min(1).max(25).required(),
            email: Joi.string().email().min(5).max(250).optional(),
            // bpCode: Joi.string().min(4).max(8).required(),
            password: Joi.string().min(5).max(20).required()
        })
    }),
    postSalesPersonLogin: celebrate({
        body: Joi.object({
            password: Joi.string().min(5).max(20).required(),
            email: Joi.string().email().required()
        })
    }),
    postSalesPersonChangePassword: celebrate({
        body: Joi.object({
            newPassword: Joi.string().min(6).max(20).required()
        }),
        params: {
            id: Joi.number().required()
        }
    }),
    putSalesPerson: celebrate({
        body: Joi.object({
            name: Joi.string().min(1).max(25).optional(),
            email: Joi.string().email().min(5).max(250).optional(),
        }),
        params: {
            id: Joi.number().required()
        }
    }),
    customerPost: celebrate({
        body: Joi.object({
            name: Joi.string().min(1).max(250).required(),
            bpCode: Joi.string().required()
        })
    }),
    putCustomer: celebrate({
        body: Joi.object({
            name: Joi.string().min(1).max(250).required(),
            bpCode: Joi.string().required()
        }),
        params: {
            id: Joi.number().required()
        }
    }),
    deleteCustomer: celebrate({
        params: {
            id: Joi.number().required()
        }
    }),
    getCustomers: celebrate({
        query: {
            name: Joi.string().optional(),
            bpCode: Joi.string().optional(),
            id: Joi.number().optional(),
            // sortBy: Joi.string().required(),
            // order: Joi.string().required(),
            limit: Joi.number().optional(),
            offset: Joi.number().optional(),
            any: Joi.string().optional()
        }
    }),
    // ------------------- Materials --------------- //
    materialPost: celebrate({
        body: Joi.object({
            name: Joi.string().min(1).max(250).required(),
            itemNo: Joi.string().required(),
            // quantity: Joi.number().required()
        })
    }),
    putMaterial: celebrate({
        body: Joi.object({
            name: Joi.string().min(1).max(250).optional(),
            itemNo: Joi.string().optional(),
            // quantity: Joi.number().optional()
        }),
        params: {
            id: Joi.number().required()
        }
    }),
    deleteMaterial: celebrate({
        params: {
            id: Joi.number().required()
        }
    }),
    getMaterials: celebrate({
        query: {
            name: Joi.string().optional(),
            itemNo: Joi.string().optional(),
            id: Joi.number().optional(),
            // sortBy: Joi.string().required(),
            // order: Joi.string().required(),
            limit: Joi.number().optional(),
            offset: Joi.number().optional(),
            any: Joi.string().optional()
        }
    }),
    // ------------------- Order --------------- //
    orderPost: celebrate({
        body: Joi.object({
            sellingPrice: Joi.number().min(0.1).required(),
            deliveryLocation: Joi.string().optional(),
            quantity: Joi.number().required(),
            requestDate: Joi.string().required(),
            additionalInfo: Joi.string().optional(),
            status: Joi.number().required(),
            CustomerId: Joi.number().required(),
            MaterialId: Joi.number().required(),
            SalesPersonId: Joi.number().required(),
            date_order_place: Joi.date().required(),
            tz: Joi.string().optional()
        })
    }),
    putOrder: celebrate({
        body: Joi.object({
            sellingPrice: Joi.number().min(0.1).optional(),
            deliveryLocation: Joi.string().optional(),
            quantity: Joi.number().optional(),
            requestDate: Joi.string().optional(),
            additionalInfo: Joi.string().optional(),
            status: Joi.number().optional(),
            CustomerId: Joi.number().optional(),
            MaterialId: Joi.number().optional(),
            SalesPersonId: Joi.number().optional(),
            date_order_place: Joi.date().optional(),
            tz: Joi.string().optional()
        }),
        params: {
            id: Joi.number().required()
        }
    }),
    deleteOrder: celebrate({
        params: {
            id: Joi.number().required()
        }
    }),
    getOrders: celebrate({
        query: {
            customerName: Joi.string().optional(),
            materialName: Joi.string().optional(),
            salesPersonName: Joi.string().optional(),
            CustomerId: Joi.number().optional(),
            MaterialId: Joi.number().optional(),
            SalesPersonId: Joi.number().optional(),
            status: Joi.number().optional(),
            id: Joi.number().optional(),
            quantity: Joi.number().optional(),
            limit: Joi.number().optional(),
            offset: Joi.number().optional(),
            any: Joi.string().optional()
        }
    }),
    // ------------------- Vehicle --------------- //
    postVehicle: celebrate({
        body: Joi.object({
            vehicleType: Joi.string().min(2).max(25).required(),
            vehicleName: Joi.string().min(2).max(25).required(),
            vehicleNumber: Joi.string().min(1).max(15).optional(),
            vehicleModel: Joi.number().optional(),
        })
    }),
    updateVehicle: celebrate({
        body: Joi.object({
            vehicleType: Joi.string().min(2).max(25).required(),
            vehicleName: Joi.string().min(2).max(25).required(),
            vehicleNumber: Joi.string().min(1).max(15).optional(),
            vehicleModel: Joi.number().optional(),
        }),
        params: {
            id: Joi.number().required()
        }
    }),
};