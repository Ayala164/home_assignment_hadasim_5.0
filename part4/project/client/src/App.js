import logo from './logo.svg';
import './App.css';
import './flags.css'
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';  
import React, { useState } from "react";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // או תנסה ערכה אחרת
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Login from "./Components/Login"; // קומפוננטת ההתחברות
import { Button } from "primereact/button";
import Register from "./Components/Register"; // יבוא קומפוננטת הרישום
import MyPage from './Components/MyPage';
import SupplierView from './Components/SupplierView';
import MasterView from './Components/MasterView';
import MasterOrder from './Components/MasterOrder';
import Orders from './Components/Orders';



function App() {

  const navigate = useNavigate();


const personalAreaButton = (
  <div className="flex gap-2">
      <Button 
          label="כניסה לאזור האישי" 
          icon="pi pi-user" 
          className="p-button-outlined" 
          onClick={() => navigate("/Login")} 
      />
      <Button 
          label="הצטרפות ספק חדש" 
          icon="pi pi-user-plus" 
          className="p-button-primary" 
          onClick={() => navigate("/Register")} 
      />
  </div>
);
const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
const end = (
    <div className="flex align-items-center gap-2">
        <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
    </div>
);
  return (
    <div className="App">
      <div className="card">
      <Menubar end={personalAreaButton} />


    </div>
            <Routes> 
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* נתיב חדש להרשמה */}
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/masterview" element={<MasterView />} />
                <Route path="/supplierview" element={<SupplierView />} />
                <Route path="/masterview/masterorder" element={<MasterOrder />} />
                <Route path="/masterview/orders" element={<Orders />} />


                {/* <Route path="/admindashboard" element={<AdminDashboard />} /> נתיב חדש להרשמה */}
                {/* <Route path="/supplierdashboard" element={<SupplierDashboard />} /> נתיב חדש להרשמה */}
            </Routes>
  
    </div>
  );
}

export default App;
