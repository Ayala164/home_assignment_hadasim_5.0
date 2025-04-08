import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// minAmount cost productName
const Register = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        password:"",
        phone: "",
        agentName: "",
        goodsList: []
    });
    const toast = useRef(null);
    const [newGood, setNewGood] = useState({
        productName: "",
        cost: "",
        minAmount: ""
    });
    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:1135/auth/registerSupplier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: formData.companyName,
                    password: formData.password,
                    phone: formData.phone,
                    agentName: formData.agentName,
                    goodsList: formData.goodsList
                })
            });

            const data = await response.json();
            if (response.ok) {
                toast.current.show({ severity: "success", summary: "Success", detail: "נרשמת בהצלחה למערכת !", life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: data.message || "שגיאה ברישום", life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "שגיאה בחיבור לשרת", life: 3000 });
        }
    };

    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <Toast ref={toast} />
            <Card title="הצטרפות" className="p-4 w-25">
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="companyName">שם החברה </label>
                        <InputText id="companyName" value={formData.companyName} onChange={(e) => handleChange(e, "companyName")} />
                    </div>
                    <div className="field">
                        <label htmlFor="password">סיסמא </label>
                        <InputText id="password" value={formData.password} onChange={(e) => handleChange(e, "password")} />
                    </div>

                    <div className="field">
                        <label htmlFor="PhoneNumber"> מספר טלפון</label>
                        <InputText id="PhoneNumber" value={formData.phone} onChange={(e) => handleChange(e, "phone")} />
                    </div>

                    <div className="field">
                        <label htmlFor="agentName">שם נציג</label>
                        <div className="p-inputgroup">
                            <InputText id="agentName" value={formData.agentName} onChange={(e) => handleChange(e, "agentName")} />
                        </div>
                    </div>

                    <div className="field">
                        <label>רשימת מוצרים</label>

                        {/* fields for new product */}
                        <div className="p-inputgroup">
                            <InputText
                                placeholder="שם מוצר"
                                value={newGood.productName}
                                onChange={(e) => setNewGood({ ...newGood, productName: e.target.value })}
                            />
                            <InputText
                                placeholder="מחיר ליחידה"
                                type="number"
                                value={newGood.cost}
                                onChange={(e) => setNewGood({ ...newGood, cost: e.target.value })}
                            />
                            <InputText
                                placeholder="כמות מינימלית"
                                type="number"
                                value={newGood.minAmount}
                                onChange={(e) => setNewGood({ ...newGood, minAmount: e.target.value })}
                            />
                            <Button
                                label="הוסף מוצר"
                                icon="pi pi-plus"
                                onClick={() => {
                                    if (newGood.productName && newGood.cost && newGood.minAmount) {
                                        setFormData({
                                            ...formData,
                                            goodsList: [...formData.goodsList, newGood]
                                        });
                                        setNewGood({ productName: "", cost: "", minAmount: "" }); // איפוס השדות
                                    }
                                }}
                                className="p-button-success"
                            />
                        </div>

                        <table className="p-datatable p-component">
                            <thead>
                                <tr>
                                    <th>שם מוצר</th>
                                    <th>מחיר ליחידה</th>
                                    <th>כמות מינימלית</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.goodsList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.productName}</td>
                                        <td>{item.cost}</td>
                                        <td>{item.minAmount}</td>
                                        <td>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>




                    <Button label="הצטרפות" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={handleRegister} />
                </div>
            </Card>
        </div>
    );
};

export default Register;

