import { Schema, model, Document, Types } from 'mongoose';
import { Room, RoomType, BedType } from '../../../domain/entities/room';

export interface RoomDocument extends Omit<Room, 'id'>, Document {
    _id: Types.ObjectId;
}

const RoomSchema = new Schema({
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, enum: [
        "individual_1_bed",
        "individual_2_beds",
        "individual_3_beds",
        "suite_large_bed",
        "suite_large_small_bed"
    ], required: true },
    capacity: { type: Number, required: true },
    beds: [{ type: String, enum: ["single", "double", "king"] }],
    pricePerNight: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            const transformedRet: any = ret;
            transformedRet.id = transformedRet._id.toString();
            delete transformedRet._id;
            delete transformedRet.__v;
            return transformedRet;
        }
    }
});

export const RoomModel = model<RoomDocument>('Room', RoomSchema);