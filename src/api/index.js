import { Router } from 'express';
import user from './routes/user.js';
import vehicle from './routes/vehicle.js';


// this is the single entry point for loading all the routes
export default () => {
	const app = Router();

	user(app);
	vehicle(app);

	return app
}