import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

import Logo from "./../assets/logoapk.png";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidUserCircle } from "react-icons/bi";


export const NavbarAT = () => {
    const [dataProfile, setDataProfile] = useState(null);
    const [showProfile, setshowProfile] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token) {
            let apiUrl;

            // Check the user's role and set the API URL accordingly
            if (role === 'Admin' || role === 'Infrastruktur' || role === 'Sosial') {
                apiUrl = 'https://vdzgxgqr-4080.asse.devtunnels.ms/profilepetugas/get';
            } else {
                apiUrl = 'https://vdzgxgqr-4080.asse.devtunnels.ms/profile/get';
            }

            fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Request failed');
                    }
                })
                .then(data => {
                    setDataProfile(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, []);

    function getLocationLabel(path) {
        switch (path) {
            case '/Home':
                return 'Home';

            case '/Pengaduan':
                return 'Pengaduan';

            case '/Profile':
                return 'Profile';

            case '/InputProfile':
                return 'InputProfile';

            case '/Petugas':
                return 'Petugas';

            case '/Masyarakat':
                return 'Masyarakat';

            case '/User':
                return 'Akun Petugas';
        }
    }

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
        }).then(result => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/';
            }
        });
    };

    if (!dataProfile) {
        return <div></div>;
    }

    return (
        <div className="flex xl:w-[83%] w-full right-0 fixed z-1 font-Poppins">
            <div className='w-full bg-white font-Inter h-[70px] relative flex'>
                <h1 className="text-2xl font-bold my-auto ml-5">{getLocationLabel(location.pathname)}</h1>

                <div className="relative ml-auto my-auto flex">
                    <div className="" onMouseEnter={() => setshowProfile(true)} onMouseLeave={() => setshowProfile(false)}>
                        <div className="my-auto flex mr-5">
                            <img src={`http://localhost:9000/pengaduan.profile/${dataProfile.foto}`} className='w-12 h-12 my-auto mr-2 rounded-full p-1 border-unggu border' />
                        </div>

                        {showProfile && (
                            <div className="absolute inset-0 items-center justify-center z-10 w-[300px] h-fit -left-[220px] top-[40px] ">
                                <div className="bg-white p-3 mt-7 shadow-lg shadow-black/20 w-full rounded-md">
                                    <div className="flex">
                                        <img src={`http://localhost:9000/pengaduan.profile/${dataProfile.foto}`} className='w-10 h-10 my-auto mr-2 rounded-full border-2' />
                                        <p className="w-fit h-fit my-auto ml-2">{dataProfile.nama}</p>
                                    </div>

                                    <hr className="my-3" />

                                    <NavLink to={'/Profile'}>
                                        <div className="flex ml-2 p-1 hover:bg-unggu-muda rounded-md text-gray-400 cursor-pointer hover:text-black">
                                            <BiSolidUserCircle className='w-8 h-8 my-auto mr-2 rounded-full' />
                                            <p className="w-fit h-fit my-auto ml-2">Profile</p>
                                        </div>
                                    </NavLink>

                                    <div className="flex mt-4 ml-3 p-1 hover:bg-unggu-muda rounded-md text-gray-400 cursor-pointer hover:text-black" onClick={handleLogout}>
                                        <HiOutlineLogout className='w-7 h-7 my-auto mr-2 rounded-full' />
                                        <p className="w-fit h-fit my-auto ml-2">Logout</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
