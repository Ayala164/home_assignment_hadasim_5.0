import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from 'react-redux';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Badge } from 'primereact/badge';


export default function MmsterView() {
  const navigate = useNavigate();

    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
      );
      const items = [
        // {
        //     label: 'Home',
        //     icon: 'pi pi-home',
        //     // command: () => {
        //     //     navigate('./Home')}
        // },
        {
            label: 'הזמנות',
            // icon: 'pi pi-star',
            // badge: 3,
            command: () => {
                navigate('./orders')},
            // template: itemRenderer
        },
        // {
        //     label: 'Projects',
        //     icon: 'pi pi-search',
        // },
        {
            label: 'להזמין סחורה',
            command: () => {
                navigate('./masterorder')},
        }
    ];
    return(
        <div className="card">
     <Menubar model={items}  />

    </div>
    )
    
}