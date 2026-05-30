
'use client';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Download, ReceiptText, Truck, Star, Heart, BadgePercent, User, ShieldCheck, MapPin, LogOut, } from 'lucide-react';
import './userprofile.css';

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        link: '/dashboard',
    },
    {
        title: 'Orders',
        icon: ShoppingBag,
        link: '/orders',
    },
    // {
    //     title: 'Downloads',
    //     icon: Download,
    //     link: '/downloads',
    // },
    {
        title: 'Invoices',
        icon: ReceiptText,
        link: '/invoices',
    },
    {
        title: 'Order Return Request',
        icon: Truck,
        link: '/returns',
        active: true,
    },
    {
        title: 'Reviews',
        icon: Star,
        link: '/reviews',
    },
    {
        title: 'Wishlist',
        icon: Heart,
        link: '/wishlist',
        badge: 1,
    },
    // {
    //     title: 'Special Offers',
    //     icon: BadgePercent,
    //     link: '/offers',
    // },
    // {
    //     title: 'Profile',
    //     icon: User,
    //     link: '/profile',
    // },
    {
        title: 'Security',
        icon: ShieldCheck,
        link: '/privacy-policy',
    },
    {
        title: 'Address',
        icon: MapPin,
        link: '/address',
    },
    {
        title: 'Logout',
        icon: LogOut,
        link: '/',
    },
];

export default function UserSidebar({activeMenu,
  setActiveMenu}) {
    return (
        <aside className="dashboard-sidebar">

            {/* USER INFO */}
            <div className="sidebar-user">

                <div className="user-avatar">
                    R
                </div>

                <div>
                    <h3>Rajesh Singh</h3>
                    <p>rajeshsingh@gmail.com</p>
                </div>

            </div>

            {/* MENU */}
            <div className="sidebar-menu">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={index}
                            onClick={() => setActiveMenu(item.title)}
                            className={`sidebar-link ${activeMenu === item.title ? 'active-sidebar' : ''
                                }`} >
                            <div className="sidebar-left">
                                <Icon size={21} strokeWidth={1.8} />
                                <span>{item.title}</span>
                            </div>

                        </button>
                    );
                })}

            </div>

        </aside>
    );
}