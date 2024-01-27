import { createOrder } from "../models/order/query.js";
import { createScheduleOrder } from "../models/scheduleOrder/query.js";
import { sendToSkeleton } from "../service/order.service.js";
// import { createOrderQuery } from '../models/order/query.js';
// export const createOrder = async (req: Request, res: Response) => {
//   try {
//     const order = await createOrderQuery(req.body);
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
export const createOrderController = async (req, res) => {
    try {
        const orderData = req.body;
        orderData.userId = req.body.user.id;
        const createdOrder = await createOrder(orderData);
        const forSkeleton = await sendToSkeleton(createdOrder);
        // res.status(201).json(createdOrder);
        res.status(201).json(forSkeleton);
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const createScheduleOrderController = async (req, res) => {
    try {
        const orderData = req.body;
        orderData.userId = req.body.user.id;
        console.log(orderData);
        const createdOrder = await createScheduleOrder(orderData);
        res.status(201).json(createdOrder);
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//# sourceMappingURL=order.controller.js.map