import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from "primereact/toast";
import { setToken } from '../redux/tokenSlice';
import { InputText } from "primereact/inputtext";

export default function MasterOrder() {
    const [suppliers, setSuppliers] = useState([]);
    const [amount, setAmount] = useState({})
    const [productDetailsMap, setProductDetailsMap] = useState({}); // מפה של פרטי המוצרים לפי ID
    const token = useSelector((state) => state.token.token)
    const [orderSentStatus, setOrderSentStatus] = useState({}); // סטטוס לכל ספק
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [cost, setCost] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({}); // אובייקט שמכיל את המוצרים שנבחרו לכל ספק

    // מביאה את כל הספקים מהשרת
    const fetchSuppliers = async () => {
        try {
            const response = await axios.get("http://localhost:1135/supplier/", {
                headers: {
                    Authorization: `Bearer ${token}` // הוספת ה-Token לכותרות
                }
            })
            setSuppliers(response.data) // שמירת הנתונים ב-state
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }
    const updateProductStatus = async (supplierId) => {
        const selectedProductIds = selectedProducts[supplierId] || []; // שליחה רק של המוצרים שנבחרו עבור ספק זה

        if (selectedProductIds.length === 0) {
            console.log("No products selected for this supplier.");
            return;
        }
        const goodsWithAmounts = selectedProductIds.map(productId => {
            const product = productDetailsMap[productId]; // שליפת פרטי המוצר
            const selectedAmount = amount[supplierId]?.[productId]; // הכמות שהוזנה
            const finalAmount = selectedAmount || product.minAmount; // אם לא נבחרה כמות, השתמש בכמות המינימלית

            return {
                productId,
                amount: finalAmount,
            };
        }).filter(item => item.amount > 0)


        try {
            const date = new Date().toISOString().split('T')[0]; // תאריך ההזמנה

            const response = await axios.post(
                `http://localhost:1135/order/`,
                { supplier: supplierId, goods: goodsWithAmounts, date, },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                const { accessToken, userInfo } = response.data;
                dispatch(setToken({ token: accessToken, userInfo }));
                console.log("Orders created successfully");
            }
        } catch (error) {
            console.error("Error updating product status:", error);
        }
    };


    const getProductDetails = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:1135/goods/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // עדכון עם פרטי המוצר
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };
    useEffect(() => {
        fetchSuppliers()
    }, []);

    useEffect(() => {
        const fetchProductDetailsForAllGoods = async () => {
            const newProductDetailsMap = {};
            for (let supplier of suppliers) {
                for (let item of supplier.goodsList) {
                    const product = await getProductDetails(item);
                    newProductDetailsMap[item] = product; // עדכון המפה
                }
            }
            setProductDetailsMap(newProductDetailsMap); // שמירת כל פרטי המוצרים במפה
        };

        if (suppliers.length > 0) {
            fetchProductDetailsForAllGoods(); // קריאה לפונקציה בעת קבלת הספקים
        }
    }, [suppliers]); // הפעלת ה-effect כאשר הספקים נטענים

    const toggleProductSelection = (supplierId, productId) => {
        setSelectedProducts(prevState => {
            const updatedState = { ...prevState }; // עותק של ה-state הקודם

            // אם אין רשימה עבור הספק הזה, ניצור חדשה
            if (!updatedState[supplierId]) {
                updatedState[supplierId] = [];
            }

            // אם המוצר כבר נבחר, נמסור אותו, אחרת נוסיף אותו לרשימה
            if (updatedState[supplierId].includes(productId)) {
                updatedState[supplierId] = updatedState[supplierId].filter(id => id !== productId); // הסרת המוצר
            } else {
                updatedState[supplierId].push(productId); // הוספת המוצר
            }

            return updatedState; // מחזיר את המצב המעודכן
        });
    };

    const handleAmountChange = (supplierId, productId, newAmount) => {

        setAmount(prevState => ({
            ...prevState,
            [supplierId]: {
                ...prevState[supplierId],
                [productId]: newAmount, // עדכון הכמות עבור המוצר
            }
        }));
    };
    const handleCostChange = (supplierId, productId, newCost) => {

        setCost(prevState => ({
            ...prevState,
            [supplierId]: {
                ...prevState[supplierId],
                [productId]: newCost, 
            }
        }));
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h2>רשימת הספקים</h2>
            {suppliers.length === 0 ? (
                <p>אין ספקים להצגה</p>
            ) : (
                <div className="grid">
                    {suppliers.map((supplier) => (
                        <Card key={supplier._id} title={supplier.companyName} className="col-12 md:col-6 lg:col-4 p-2">
                            <p><strong>שם נציג:</strong> {supplier.agentName}</p>
                            <p><strong>טלפון:</strong> {supplier.phone}</p>
                            {/* <p><strong> כמות:</strong> {supplier.status}</p> */}

                            <h4>הסחורות המוצעות:</h4>
                            <ul>
                                {supplier.goodsList && supplier.goodsList.length > 0 ? (
                                    supplier.goodsList.map((item, index) => {
                                        const product = productDetailsMap[item]; // שליפה מתוך המפה

                                        return (
                                            <li key={index}>
                                                {product ? (
                                                    <>
                                                        <p>{product.productName} - {product.cost}₪ (מינימום {product.minAmount})</p>
                                                        <Button
                                                            icon="pi pi-check"
                                                            label="סמן V"
                                                            onClick={() => toggleProductSelection(supplier._id, item)} // מעדכן רק את המוצרים של הספק הנבחר
                                                            className={selectedProducts[supplier._id]?.includes(item) ? "p-button-success" : "p-button-secondary"}
                                                        />
                                                        <InputText
                                                            placeholder="כמות"
                                                            type="number"
                                                            value={amount[supplier._id]?.[item] || ''}
                                                            onChange={(e) => {
                                                                const enteredAmount = e.target.value
                                                                // const enteredAmount = parseInt(e.target.value, 10);
                                                                if (enteredAmount !== undefined && enteredAmount !== null) {
                                                                    handleAmountChange(supplier._id, item, enteredAmount)
                                                                    handleCostChange(supplier._id, item,enteredAmount*product.cost)
                                                                }
                                                                
                                                            }}
                                                            onBlur={(e) => {
                                                                const enteredAmount = parseInt(e.target.value, 10);
                                                                if (product.minAmount > enteredAmount) {
                                                                    handleAmountChange(supplier._id, item, product.minAmount)
                                                                    handleCostChange(supplier._id, item,product.cost*product.minAmount)
                                                                    // e.target.value = product.minAmount;
                                                                    alert(`הכמות חייבת להיות גדולה מ-${product.minAmount}`);
                                                                }
                                                            }}
                                                        />
                                                        <p><strong>מחיר:</strong> {cost[supplier._id]?.[product._id] || 0}</p>

                                                    </>
                                                ) : (
                                                    <p>טוען פרטי מוצר...</p>
                                                )}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <p>אין מוצרים זמינים</p>
                                )}
                            </ul>
                            <Button
                                label={orderSentStatus[supplier._id] ? "ההזמנה נשלחה" : "להזמנה לחץ כאן"}
                                icon="pi pi-send"
                                onClick={() => updateProductStatus(supplier._id)}
                                className={`p-button mt-3 ${orderSentStatus[supplier._id] ? "p-button-success" : "p-button-info"}`}
                            />

                        </Card>
                    ))}
                </div>
            )}

            <Button label="רענן" icon="pi pi-refresh" onClick={fetchSuppliers} className="p-button-info mt-3" />
        </div>
    );
}























