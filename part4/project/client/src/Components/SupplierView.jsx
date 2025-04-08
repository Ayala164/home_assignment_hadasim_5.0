import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useSelector } from 'react-redux';

export default function SupplierView() {
    const [orders, setOrders] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productDetailsMap, setProductDetailsMap] = useState({});
    const [supplierDetailsMap, setSupplierDetailsMap] = useState({});
    const token = useSelector((state) => state.token.token);
    const [orderSentStatus, setOrderSentStatus] = useState({});

    // שליפת ההזמנות מהשרת
    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:1135/order/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            setOrders(response.data);
            console.log(orders[0].amount)
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // שליפת פרטי הספק לפי ID
    const getSupplierDetails = async (supplierId) => {
        try {
            const response = await axios.get(`http://localhost:1135/supplier/${supplierId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching supplier details:", error);
        }
    };

    // שליפת פרטי המוצר לפי ID
    const getProductDetails = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:1135/goods/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    // קריאה לשליפת פרטי המוצרים ופרטי הספקים
    useEffect(() => {
        fetchOrders();  // קריאה לפונקציה בעת טעינת הדף
    }, []);  // תוודא שה-[] גורם לקריאה להתבצע רק פעם אחת.

    useEffect(() => {
        const fetchDetailsForAllOrders = async () => {
            const newProductDetailsMap = {};
            const newSupplierDetailsMap = {};

            // מבצע קריאות אסינכרוניות עבור כל ההזמנות
            const fetchOrderDetails = async () => {
                for (let order of orders) {
                    // רק אם פרטי המוצר עדיין לא נטענו
                    if (order.goods && !newProductDetailsMap[order.goods]) {
                        const product = await getProductDetails(order.goods);
                        newProductDetailsMap[order.goods] = product;
                    }

                    // אם פרטי הספק עדיין לא נטענו
                    if (order.supplier && !newSupplierDetailsMap[order.supplier]) {
                        const supplier = await getSupplierDetails(order.supplier);
                        newSupplierDetailsMap[order.supplier] = supplier;
                    }
                }

                // עדכון המפות לאחר סיום כל הקריאות
                setProductDetailsMap(newProductDetailsMap);
                setSupplierDetailsMap(newSupplierDetailsMap);
            };

            // קרא את פרטי המוצרים והספקים רק אם יש הזמנות
            if (orders.length > 0) {
                await fetchOrderDetails();
            }
        };

        fetchDetailsForAllOrders();
    }, [orders]);  // מבצע קריאה רק כאשר משתנה ה-state של ההזמנות.

    const updateOrderStatus = async (orderId,orderStatus) => {
        if(orderStatus!="exist"){
            return
        }
        try {
            console.log(orderId,orderStatus)
            const response = await axios.put(
                `http://localhost:1135/order`,
                { _id: orderId,status:orderStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200 || response.status === 201) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? { ...order, status: "process" }
                            : order
                    )
                );
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const toggleProductSelection = (productId) => {
        setSelectedProducts((prevState) =>
            prevState.includes(productId)
                ? prevState.filter((id) => id !== productId)
                : [...prevState, productId]
        );
    };

    return (
        <div className="p-4">
            <h2>רשימת ההזמנות</h2>
            {orders.length === 0 ? (
                <p>אין הזמנות להצגה</p>
            ) : (
                <div className="grid">
                    {orders.map((order) => (
                        <Card key={order._id} className="col-12 md:col-6 lg:col-4 p-2">
{                            console.log(order.status)
}                            <p><strong>סטטוס:</strong> {order.status}</p>
                            <p><strong>ספק:</strong> {supplierDetailsMap[order.supplier]?.companyName}</p> {/* פרטי הספק */}
                           <p><strong>מחיר:</strong> {productDetailsMap[order.goods]?.cost*order.amount}</p>
                           <p><strong>כמות:</strong> {order.amount}</p>
                           {console.log(productDetailsMap[order.goods]?.cost)}
                            <h4>מוצרים בהזמנה:</h4>
                            <ul>
                                {order.goods ? (  
                                    <>
                                        <li>
                                            {productDetailsMap[order.goods] ? (
                                                <>
                                                    <p>{productDetailsMap[order.goods].productName} - {productDetailsMap[order.goods].cost}₪ (מינימום {productDetailsMap[order.goods].minAmount})</p>
                                                </>
                                            ) : (
                                                <p>טוען פרטי מוצר...</p>
                                            )}
                                        </li>
                                    </>
                                ) : (
                                    <p>אין מוצרים בהזמנה</p>
                                )}
                            </ul>
                            <Button
                                label={orderSentStatus[order._id] ? order.status : order.status}
                                icon="pi pi-send"
                                onClick={() => updateOrderStatus(order._id,order.status)}
                                className={`p-button mt-3 ${orderSentStatus[order._id] ? "p-button-success" : "p-button-info"}`}
                            />
                        </Card>
                    ))}
                </div>
            )}
            <Button label="רענן" icon="pi pi-refresh" onClick={fetchOrders} className="p-button-info mt-3" />
        </div>
    );
}
