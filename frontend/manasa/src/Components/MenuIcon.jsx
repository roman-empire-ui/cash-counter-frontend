import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from "lucide-react";

const MenuIcon = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="absolute top-5 right-5 z-50 bg-purple-700/90 hover:bg-purple-800 transition-colors p-2 rounded-full shadow-md cursor-pointer"
                onClick={() => navigate('/rem-amounts')}
                title="Remaining Amounts Page"
            >
                <Menu size={26} color="white" />
            </div>
        </div>
    )
}

export default MenuIcon
