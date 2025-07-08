import express from 'express';
const router = express.Router();
import {requestRide, getPendingRides, acceptRide, startRide, completeRide} from "../controllers/ride.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/roles.middleware";


//@route POST /api/v1/rides/request
//@desc Rider Request ride(rider only)
//@access Private
router.post('/request', authMiddleware, authorizedRoles("rider"), requestRide);

//@route GET /api/v1/rides/pending
//@desc Driver views all pending rides (driver only), Fetch all new rides (pending)
//@access Private
router.get('/pending', authMiddleware, authorizedRoles("driver"), getPendingRides);

//@route PATCH /api/v1/rides/:id/accept
//@desc Driver accepts ride (driver only), (status change to accepted)
//@access Private
router.patch('/:id/accept', authMiddleware, authorizedRoles("driver"), acceptRide);


//@route PATCH /api/v1/rides/:id/start
//@desc Driver starts ride (driver only), (status change to in progress)
//@access Private
router.patch('/:id/start', authMiddleware, authorizedRoles("driver"), startRide);

//@route PATCH /api/v1/rides/:id/complete
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private
router.patch('/:id/complete', authMiddleware, authorizedRoles("driver"), completeRide);


export default router;