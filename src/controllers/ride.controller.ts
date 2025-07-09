import { Request, Response } from 'express';
import { Ride } from '../models/ride.model';
import { AuthRequest } from '../types/authRequest';
import { Schema, Types } from 'mongoose';
import { User} from '../models/user.model';

//@route POST /api/v1/rides/request
//@desc Rider Request ride(rider only)
//@access Private

export const requestRide = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { pickUpLocation, dropOffLocation } = req.body;
        const userId = req.user?.id

        if(!pickUpLocation || !dropOffLocation) {
            res.status(400).json({
                success: false,
                message: "Pickup location and drop-off location are required"
            });
            return;
        }

        const rider = await User.findById(userId).select('-password -__v');
        console.log(rider)

        const ride = await Ride.create(
            {
                pickUpLocation: pickUpLocation,
                dropOffLocation: dropOffLocation,
                rider: rider?._id,

            }
        )

        res.status(200).json({
            success: true,
            message: "Ride requested successfully.",
            data: ride
        })
    } catch (error) {
        console.log({message: "Error requesting ride", error});
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
}

//@route GET /api/v1/rides/pending
//@desc Driver views all pending rides (driver only), Fetch all new rides (pending)
//@access Private

export const getPendingRides = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if(!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user found. Please login"
            });
        }

        const rider = await User.findById(userId).select('-password -__v');
        console.log(rider)

        const rides = await Ride.find({
            // rider: rider?._id,
            status: "pending"
        }).select('-createdAt -updatedAt -__v')

        res.status(200).json({
            success: true,
            message: "Rides fetched successfully.",
            data: rides
        })
    } catch (error) {
        console.log({ message: "Error fetching rides", error});
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
}

//@route GET /api/v1/rides/pending
//@desc Driver views all pending rides (driver only), Fetch all new rides (pending)
//@access Private

export const acceptRide = async(req: AuthRequest, res: Response): Promise<void> => {
    try{
        const rideId = req.params.id;
        const userId = req.user?.id;

        if(!rideId || !userId) {
            res.status(400).json({
                success: false,
                message: "Ride ID and user ID are required"
            });
            return;
        }

        const ride = await Ride.findById(rideId);
        if(!ride || ride.status !== 'pending') {
            res.status(404).json({
                success: false,
                messge: "Ride not available at this time"
            });
            return;
        }
            ride.status = 'accepted';
            ride.driver = userId as any;
            await ride.save();
        
        res.status(200).json({
            success: true,
            message: "Ride accepted successfully.",
            data: ride
        })
    } catch (error) {
        console.log({ message: "Error accepting ride", error});
        res.status(500).json({ success: false, error: "Internal Server Error"});
        return;
    }
}


//@route PATCH /api/v1/rides/:id/start
//@desc Driver starts ride (driver only), (status change to in progress)
//@access Private

export const startRide = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const rideId = req.params.id;
        const userId = req.user?.id;

        if(!rideId || !userId) {
            res.status(400).json({
                success: false,
                message: "Ride ID and user ID are required"
            });
            return;
        }
        const ride = await Ride.findById(rideId);
        if(!ride || ride.status !== 'accepted') {
            res.status(404).json({
                success: false,
                message: "Ride not accepted at this time. Please accept the ride first."
            });
            return;
        }
        ride.status = "in_progress";
        await ride.save();

        res.status(200).json({
            success: true,
            message: "Ride started successfully.",
            data: ride
        })
    } catch (error) {
        console.log({message: "Error starting ride", error});
        res.status(500).json({
            success: false,
            error: "Internal Server Error"})
            return;
    }
}

//@route PATCH /api/v1/rides/:id/complete
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private

export const completeRide = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const rideId = req.params.id;
        const userId = req.user?.id;
        if(!rideId || !userId) {
            res.status(400).json({
                success: false,
                message: "Ride ID and user ID are required"
            });
            return;
        }
        
        const ride = await Ride.findById(rideId);
        if(!ride || ride.status !== 'in_progress') {
            res.status(404).json({
                success: false,
                message: "Ride not in progress at this time. Please start the ride first.",
            });
            return;
        }
        ride.status = "completed";
        await ride.save();

        res.status(200).json({
            success: true,
            message: "Ride completed successfully",
            data: ride
        })
    } catch (error) {
        console.log({ message: "Error finishing ride", error});
        res.status(500).json({ success: false, error: "Internal Server Error"});
        return;
    }
}

//Trip History
//@route GET /api/v1/rides/my-trips
//@desc View/fetch user specific trips (all roles)
//@access Private