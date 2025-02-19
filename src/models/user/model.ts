import { Schema, model, Types } from "mongoose";
import {
  // IAddress,
  ICustomer,
  ICustomerPreference,
  ILongLat,
  IUser,
} from "../../interfaces/user.interface.js";
// import { getNextSequenceValue } from '../../utilities/nextSequence.js';

// const UserSchema = new Schema<IUser>({
//   name: { type: String, required: false },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   address: { type: String, required: true },
//   image: { type: String, required: false },
// });

const LatLongSchema = new Schema<ILongLat>({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
});

const CustomerPreference = new Schema<ICustomerPreference>({
  tastyTags: { type: Object, required: true },
  category: { type: [String], required: false },
});

// const AddressSchema = new Schema<IAddress>({
//   address: { type: String, required: true },
//   buildingName: { type: String, required: true },
//   buildingType: { type: String, required: true },
//   floor: { type: String, required: true },

// })

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: false },
  dob: { type: Date, required: true },
  age: { type: Number, required: false },
  customerImage: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  uprn: { type: String },
  password: { type: String, required: true },
  address: { type: String, required: true },
  currentLatLong: { type: LatLongSchema },
  doorwayLatLong: { type: LatLongSchema },
  allOrderIdList: { type: [String], required: false },
  customerPreference: { type: CustomerPreference, required: false },
  loyaltyPoints: { type: Number, required: false },
});
// Middleware to auto-increment
// UserSchema.pre('save', async function (next) {
//     const doc = this;
//     if (!doc.userId) {
//         doc.userId = await getNextSequenceValue('userIdCounter');
//     }
//     next();
// });

const Customer = model<ICustomer>("Customer", CustomerSchema);

export default Customer;
