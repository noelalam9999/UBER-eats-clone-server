import mongoose, { Schema } from "mongoose";
const IngredientSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});
const ICartSchema = new Schema({
    _id: { type: String, required: true },
    resId: { type: String, required: true },
    cartId: { type: String, required: true },
    name: { type: String, required: false },
    image: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    addon: [{ type: IngredientSchema }],
    no: [{ type: IngredientSchema }],
});
const orderSchema = new Schema({
    userId: { type: String, required: true },
    deliveryFee: { type: Number, default: 5 },
    deliveryTime: { type: Number, default: 30 },
    cartItems: [{ type: ICartSchema }],
    restaurantId: { type: String, required: false },
    subtotal: { type: Number, required: true },
    orderStatus: { type: String, default: "pending" },
    ordertype: { type: String, required: true },
    delivery: { type: Boolean, required: true },
    pickup: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
});
const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
//# sourceMappingURL=model.js.map