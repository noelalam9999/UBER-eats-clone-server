import axios from "axios";
import { IOrder } from "../interfaces/order.interface.js";
import { IOrderToSend } from "../interfaces/orderToSend.interface.js";



export const prepareForSkeleton = async (orderData: IOrder) => {
  //   const allMenuItemsWithAdditionalDetails = await getMenuItemsByRestaurant(
  //     orderData.cartItems[0].resId
  //   );
  const headers = {
    "Content-Type": "application/json",
    Authorization: process.env.SKELETON_TOKEN,
  };
  const response = await axios.get(
    `${process.env.MENU_ITEMS}${orderData.cartItems[0].resId}`,
    { headers }
  );

  const allMenuItemsWithAdditionalDetails = response.data;
  // console.log(allMenuItemsWithAdditionalDetails);
  const addAdditionalDetails = await addDetailsToRestaurants(
    orderData,
    allMenuItemsWithAdditionalDetails
  );

  return {
    _id: orderData._id,
    restaurantId: parseInt(orderData.cartItems[0].resId),
    ...addAdditionalDetails,
  };
};


export const prepareForRider = async (fOrder: any, sOrder: any) => {

  return {
    _id: fOrder._id,
    riderId: null,
    userId: sOrder.userId,
    restaurantId: fOrder.restaurantId,
    items: fOrder.items,
    orderTemperatureType: 'Hot',
    deliveryPoint: {
      longitude: 53.515333,
      latitude: -6.190796
    },
    orderDeliveryTime: {
      minTime: calculateDeliveryTime(fOrder)[0],
      maxTime: calculateDeliveryTime(fOrder)[1]
    },
    deliveryFee: 5,
    subtotal: sOrder.subtotal,
    createdAt: sOrder.createdAt
  }
}

function calculateDeliveryTime(order: any) {
  let maxPreparationTime = 0;
  let minLastingTime = 0;

  if (order.items[0].item.itemLastingTime) {
    minLastingTime = order.items[0].item.itemLastingTime;
  }

  for (let i = 0; i < order.items.length; i++) {
    if (order.items[i].item.itemPreparationTime > maxPreparationTime) {
      maxPreparationTime = order.items[i].item.itemPreparationTime;
    }
    if (order.items[i].item.itemLastingTime < minLastingTime) {
      minLastingTime = order.items[i].item.itemLastingTime;
    }
  }

  let totalMinutesForMin = maxPreparationTime + minLastingTime - 20;
  let totalMinutesForMax = maxPreparationTime + minLastingTime - 10;


  const minTime = new Date(Date.now());
  minTime.setMinutes(minTime.getMinutes() + totalMinutesForMin);


  const maxTime = new Date(Date.now());
  maxTime.setMinutes(maxTime.getMinutes() + totalMinutesForMax);

  return [minTime, maxTime];
}

const addDetailsToRestaurants = async (
  orderData: IOrder,
  allMenuItemsWithAdditionalDetails: any
) => {
  const itemsWithDetails = orderData.cartItems.map((cartItem) => {

    // Searching out the ordered items from MENU
    const menuItem = allMenuItemsWithAdditionalDetails.filter((item: any) => {
      return item._id === cartItem._id;
    })[0];

    const addons = cartItem.addon?.map((item) => {
      const addon = menuItem.item.options.add.filter((ing: any) => {
        return item._id == ing._id;
      })[0];
      return addon;
    });

    const no = cartItem.no?.map((item) => {
      const no = menuItem.item.options.no.filter((ing: any) => {
        return item._id == ing._id;
      })[0];
      return no;
    });

    return {
      _id: cartItem._id,
      restaurantId: parseInt(cartItem.resId),
      categoryId: menuItem.categoryId,
      categoryName: menuItem.categoryName,
      mealTimeId: menuItem.mealTimeId,
      item: {
        _id: menuItem.item._id,
        itemId: 72,
        itemName: menuItem.item.itemName,
        itemImage: menuItem.item.itemImage,
        itemDescription: menuItem.item.itemDescription,
        itemQuantity: cartItem.quantity,
        itemPreparationTime: menuItem.item.itemPreparationTime,
        itemPackingType: menuItem.item.itemPackingType,
        itemLastingTime: menuItem.item.itemLastingTime,
        itemPortionSize: menuItem.item.itemPortionSize,
        ingredients: { ...menuItem.item.ingredients },
        options: menuItem.item.options,
        chosenOptions: {
          add: addons,
          no: no,
          _id: "65b5044ebb8664a60a98dce2",
        },
        optionalNotes: "No salt please",
        itemPrice: menuItem.item.itemPrice,
        itemCalories: menuItem.item.itemCalories,
        timeOfDay: menuItem.item.timeOfDay,
        itemProfileTastyTags: menuItem.item.itemProfileTastyTags,
        typeOfFoods: menuItem.item.typeOfFoods,
        servingTemperature: menuItem.item.servingTemperature,
        itemDietaryRestrictions: menuItem.item.itemDietaryRestrictions,
        itemPackingDimension: menuItem.item.itemPackingDimension,
      },
    };
  });

  return {
    type: orderData.delivery ? "delivery" : "pickup",
    bill: orderData.subtotal,
    unit: "USD",
    status: "pending",
    vipCustomer: false,
    items: itemsWithDetails,
    createdAt: "",
  };
};

// export const sendToRider = async (preparedOrder: any): Promise<any> => {
//   const res = await axios.post<any>(
//     process.env.RIDER_ORDER as string,
//     preparedOrder,
//   );

//   return res.data;
// };

