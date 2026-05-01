// import { getOrderById } from "@/lib/actions/order.actions";
// import OrderDetails from "./order-details";
// import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
// import AssignDeliveryDriver from "./driver-assign-form";

// const OrderUpdateView =   async({ orderId }: { orderId: string }) => {

//     const order = await getOrderById(orderId)

//   return (
//     <>

//     {
//         order?.deliveryDriver ? (
//                   <DialogContent className="!max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Order Details</DialogTitle>
//         </DialogHeader>

//         <OrderDetails
//           orderId={(notification.metadata as { orderId: string }).orderId}
//           type="readonly"
//         />
//       </DialogContent>
//         ) : (
//            <DialogContent className="!max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Assign a delivery driver</DialogTitle>
//         </DialogHeader>

//             <AssignDeliveryDriver  />
//         )
//     }

//     </>
//   );
// };

// export default OrderUpdateView;
