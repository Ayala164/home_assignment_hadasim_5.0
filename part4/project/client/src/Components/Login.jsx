import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/tokenSlice';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import MyPage from "./MyPage"
const Login = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        password: ""
    });
    const navigate = useNavigate(); // 🔹 מאפשר ניווט לדפים אחרים
    const dispatch = useDispatch();
    const toast = useRef(null);
    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleLogin = async () => {
        // e.preventDefault(); // מונע רענון של הדף
        try {
            const response = await fetch("http://localhost:1135/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: formData.companyName,
                    password: formData.password
                })
            });
            const data = await response.json();
            if (response.status === 200) {
                const { accessToken, userInfo } = data;
                console.log(accessToken)
                // שמירת הטוקן ב-Redux
                dispatch(setToken({ token: accessToken, userInfo }));

                // ניווט לפי סוג המשתמש
                if (userInfo.roles[0] === "Master") {
                    navigate("/masterview"); // דף מנהל
                } else if(userInfo.roles[0] === "Supplier") {
                    navigate("/supplierview"); // דף ספק
                }
                 toast.current.show({ severity: "success", summary: "Success", detail: "התחברת בהצלחה למערכת !", life: 3000 });

            }
            else if(response.status === 400) {
                toast.current.show({ severity: "error", summary: "Error", detail: data.message || "כל השדות הם חובה", life: 3000 });
                }
            else if(response.status === 401) {
                toast.current.show({ severity: "error", summary: "Error", detail: data.message || "משתמש לא מזוהה", life: 3000 });
                }
            } catch (error) {
                toast.current.show({ severity: "error", summary: "Error", detail: "שגיאה בחיבור לשרת", life: 3000 });
            }
        };

        return (
            <div className="flex justify-content-center align-items-center h-screen">
                <Toast ref={toast} />
                <Card title="התחברות" className="p-4 w-25">
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="companyName">שם החברה </label>
                            <InputText id="companyName" value={formData.companyName} onChange={(e) => handleChange(e, "companyName")} />
                        </div>
                        <div className="field">
                            <label htmlFor="password">סיסמא </label>
                            <InputText id="password" value={formData.password} onChange={(e) => handleChange(e, "password")} />
                        </div>

                        <Button label="התחברות" icon="pi pi-sign-in" className="p-button-success w-full mt-3" onClick={handleLogin} />
                    </div>
                </Card>
            </div>
        );
    };

    export default Login;















































