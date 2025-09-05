import express from 'express';
const router = express.Router();
import {requestRide, getPendingRides, acceptRide, startRide, completeRide} from "../controllers/ride.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/roles.middleware";

/**
 * @swagger
 * /api/v1/rides/request:
 *   post:
 *     summary: Request a new ride
 *     description: Rider requests a new ride by providing pickup and drop-off locations.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickUpLocation
 *               - dropOffLocation
 *             properties:
 *               pickUpLocation:
 *                 type: string
 *                 example: "Accra Mall"
 *               dropOffLocation:
 *                 type: string
 *                 example: "Kotoka International Airport"
 *     responses:
 *       200:
 *         description: Ride requested successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Ride requested successfully."
 *               data:
 *                 _id: "64b0c0f3e934b8..."
 *                 pickUpLocation: "Accra Mall"
 *                 dropOffLocation: "Kotoka International Airport"
 *                 status: "pending"
 *                 rider: "64b0c0f3e934b8..."
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Pickup location and drop-off location are required"
 *       500:
 *         description: Internal server error
 */
/**
 * @route POST /api/v1/rides/request
 * @desc Rider Request ride(rider only)
 * @access Private
 */
router.post('/request', authMiddleware, authorizedRoles("rider"), requestRide);


/**
 * @swagger
 * /api/v1/rides/pending:
 *   get:
 *     summary: Get all pending rides
 *     description: Driver fetches all rides with status `pending`.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rides fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Rides fetched successfully."
 *               data:
 *                 - _id: "64b0c0f3e934b8..."
 *                   pickUpLocation: "Accra Mall"
 *                   dropOffLocation: "Kotoka International Airport"
 *                   status: "pending"
 *                   rider: "64b0c0f3e934b8..."
 *       401:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized: No user found. Please login"
 *       500:
 *         description: Internal server error
 */
/** 
//@route GET /api/v1/rides/pending
//@desc Driver views all pending rides (driver only), Fetch all new rides (pending)
//@access Private
*/
router.get('/pending', authMiddleware, authorizedRoles("driver"), getPendingRides);

/**
 * @swagger
 * /api/v1/rides/{id}/accept:
 *   patch:
 *     summary: Accept a ride
 *     description: Driver accepts a pending ride by its ID.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride accepted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Ride accepted successfully."
 *               data:
 *                 _id: "64b0c0f3e934b8..."
 *                 status: "accepted"
 *                 driver: "64b0c0f3e934b8..."
 *       400:
 *         description: Missing ride ID or user ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Ride ID and user ID are required"
 *       404:
 *         description: Ride not available
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Ride not available at this time"
 *       500:
 *         description: Internal server error
 */
/** 
//@route PATCH /api/v1/rides/:id/accept
//@desc Driver accepts ride (driver only), (status change to accepted)
//@access Private
*/
router.patch('/:id/accept', authMiddleware, authorizedRoles("driver"), acceptRide);

/**
 * @swagger
 * /api/v1/rides/{id}/start:
 *   patch:
 *     summary: Start a ride
 *     description: Driver starts a ride that has been accepted (changes status to `in_progress`).
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride started successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Ride started successfully."
 *               data:
 *                 _id: "64b0c0f3e934b8..."
 *                 status: "in_progress"
 *       400:
 *         description: Missing IDs
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Ride ID and user ID are required"
 *       404:
 *         description: Ride not accepted
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Ride not accepted at this time. Please accept the ride first."
 *       500:
 *         description: Internal server error
 */
/**
//@route PATCH /api/v1/rides/:id/start
//@desc Driver starts ride (driver only), (status change to in progress)
//@access Private
*/
router.patch('/:id/start', authMiddleware, authorizedRoles("driver"), startRide);

/**
 * @swagger
 * /api/v1/rides/{id}/complete:
 *   patch:
 *     summary: Complete a ride
 *     description: Driver completes an in-progress ride (changes status to `completed`).
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride completed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Ride completed successfully"
 *               data:
 *                 _id: "64b0c0f3e934b8..."
 *                 status: "completed"
 *       400:
 *         description: Missing IDs
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Ride ID and user ID are required"
 *       404:
 *         description: Ride not in progress
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Ride not in progress at this time. Please start the ride first."
 *       500:
 *         description: Internal server error
 */
/**
//@route PATCH /api/v1/rides/:id/complete
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private
*/
router.patch('/:id/complete', authMiddleware, authorizedRoles("driver"), completeRide);


export default router;