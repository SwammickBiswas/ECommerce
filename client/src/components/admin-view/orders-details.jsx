import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../@/hooks/use-toast";
import { getAllOrdersAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "../../store/admin/order-slice/index";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const initialFormData = {
    status:""
}

function AdminOrdersDetailsView({orderDetails}) {
    const[formData,setFormData] = useState(initialFormData) 
    const {user} = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const {toast} = useToast()
    function handleUpdateStatus(event){
        event.preventDefault()
        const {status} = formData
        dispatch(updateOrderStatus({id:orderDetails?._id,orderStatus:status})).then((data)=>{
            console.log(data,"data");
            if(data?.payload?.success){
                dispatch(getOrderDetailsForAdmin(orderDetails?._id))
                dispatch(getAllOrdersAdmin())
                setFormData(initialFormData)
                toast({
                    title: data?.payload?.message || "Updated successfully",
                })
            }
        })
        
        
    }
    return ( 
        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="flex mt-6 items-center justify-between">
                    <p className="font-medium">Order ID</p>
                    <Label>{orderDetails?._id}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Order Date</p>
                    <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
                </div>
                <div className="flex mt-6 items-center justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>${orderDetails?.totalAmount}</Label>
                </div>
                <div className="flex mt-6 items-center justify-between">
                    <p className="font-medium">Payment Method</p>
                    <Label>{orderDetails?.paymentMethod}</Label>
                </div>
                <div className="flex mt-6 items-center justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>{orderDetails?.paymentStatus}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Order Status</p>
                    <Label>
                    <Badge
                          className={`py-1 px-3 ${
                            orderDetails?.orderStatus === "confirmed"
                              ? "bg-green-500" : orderDetails?.orderStatus === "rejected"
                              ? "bg-red-500" : orderDetails?.orderStatus === "shipped"
                              ? "bg-blue-500" : orderDetails?.orderStatus === "delivered"
                              ? "bg-orange-500" : "bg-gray-500"
                              }`}
                        >
                          {orderDetails?.orderStatus}
                        </Badge>
                        </Label>
                </div>
            </div>
                <Separator/>
                <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">
                        Order Details
                    </div>
                    <ul className="grid gap-3">
                        {
                            orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?
                            orderDetails?.cartItems?.map(item => (
                                <>
                                
                                <li className="flex items-center justify-between p-2">
                                    <span className="flex-1 text-left">Title: {item?.title}</span>
                                    <span className="flex-1 text-center">Quantity: {item?.quantity}</span>
                                    <span className="flex-1 text-right">Price: {item?.price}</span>
                                </li>
                                </>
                            )) : null
                        }
                    </ul>
                </div>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">
                        Shipping Info
                    </div>
            <div className="grid gap-0.5 text-muted-foreground">
             <span>{user?.userName}</span>
             <span>{orderDetails?.addressInfo?.address}</span>
             <span>{orderDetails?.addressInfo?.city}</span>
             <span>{orderDetails?.addressInfo?.pincode}</span>
             <span>{orderDetails?.addressInfo?.phone}</span>
             <span>{orderDetails?.addressInfo?.notes}</span>

            </div>
                </div>
            </div>
                <div>
                    <CommonForm 
                        formControls={[{
                            label: "Order Status",
                            name: "status",
                            componentType: "select",
                            options: [
                                { id: "pending", label: "Pending" },
                                { id: "inProcess", label: "In Process" },
                                { id: "inShipping", label: "In Shipping" },
                                { id: "delivered", label: "Delivered" },
                                { id: "rejected", label: "Rejected" },
                            ],
                        }]} 
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={"Update Order Status"}
                        onSubmit={handleUpdateStatus}
                    />
                </div>
            </div>
        </DialogContent>
     );
}

export default AdminOrdersDetailsView;