import { Schema, model, Document, Types } from 'mongoose';
import { Hotel } from '../../../domain/entities/hotel';

export interface HotelDocument extends Omit<Hotel, 'id'>, Document {
    _id: Types.ObjectId;
}

const HotelSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    amenities: [{ type: String }],
    image: { type: String },
    rating: { type: Number, min: 0, max: 5 },
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

export const HotelModel = model<HotelDocument>('Hotel', HotelSchema);
