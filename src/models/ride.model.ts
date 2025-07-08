import mongoose, { Schema, Document,  model } from  "mongoose";
import { RideStatus } from "../types/ride.types";


export interface IRide extends Document {
    driver: Schema.Types.ObjectId;
    passenger: Schema.Types.ObjectId;
    pickUpLocation: string;
    dropOffLocation: string;
    status: RideStatus;
    createdAt: Date;
    updatedAt: Date;

}

const RideSchema: Schema = new Schema<IRide> ({
    driver: { type: Schema.ObjectId, ref: 'Driver' },
    passenger: { type: Schema.ObjectId, ref: 'Passenger', index: true, required: true },
    pickUpLocation: { type: String, required: true},
    dropOffLocation: { type: String, required: true},
    status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed'], default: 'pending'}
},
{
    timestamps: true,
}
)

export const Ride = mongoose.model<IRide>('Ride', RideSchema);

