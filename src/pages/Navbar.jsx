import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

import Logo from "./../assets/logoapk.png";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiSolidDashboard, BiTargetLock, BiLogOut, BiCategory } from "react-icons/bi";
import { BsListTask, BsFillClipboardCheckFill } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { AiOutlineDown, AiOutlineUp, AiOutlineInbox, AiOutlinePicture, AiOutlineHome, AiOutlineCheckCircle } from "react-icons/ai";

//logo task BsFillClipboardCheckFill

export const Navbar = () => {
    const { id } = useParams();
    // const idString = id.toString();

    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [IDD, setIDD] = useState(localStorage.getItem('ID'));
    const [isClicked, setIsClicked] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [showSubNav, setShowSubNav] = useState(false);
    const [IDprojek, setIDprojek] = useState([]); // Menambahkan state data


    const toggleSubNav = () => {
        setIsClicked(!isClicked);
        setShowSubNav(!showSubNav);
        setShowSubMenu(!showSubMenu);
    };


    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Kamu yakin mau Logout",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/';
            }
        });
    };

    const [dataProfile, setDataProfile] = useState(null); // Menambahkan state data

    const location = useLocation(); // Mendapatkan informasi tentang URL yang sedang aktif

    const hideNavbarPaths = ['/', '/Register', '/register',]; // Paths untuk halaman yang tidak perlu menampilkan Navbar

    if (hideNavbarPaths.includes(location.pathname)) {
        return null; // Jika path saat ini ada dalam daftar hideNavbarPaths, tampilkan null (tidak ada Navbar)
    }


    // Gunakan useEffect untuk mengambil data saat komponen pertama kali di-render
    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
    
        // const id = localStorage.getItem('ID');
        // setIDD(id);
    
        // Cek apakah token tersimpan di Local Storage
        const token = localStorage.getItem('token');
        if (token) {
            let apiUrl;
    
            // Check the user's role and set the API URL accordingly
            if (role === 'Admin' || role === 'Infrastruktur' || role === 'Sosial') {
                apiUrl = 'http://localhost:4080/profilepetugas/get';
            } else {
                apiUrl = 'http://localhost:4080/profile/get';
            }
    
            // Lakukan permintaan ke server menggunakan token dan API URL yang sesuai
            fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Permintaan gagal');
                    }
                })
                .then(data => {
                    // console.log('Respon dari server (Berhasil mendapatkan profile):', data);
                    setDataProfile(data);
                })
                .catch(error => {
                    console.error('Terjadi kesalahan:', error);
                });
    
            // ... (rest of your code)
    
        } else {
            console.log('Token tidak ditemukan');
        }
    
    }, []); // Parameter kedua [] memastikan bahwa useEffect hanya dijalankan sekali saat komponen pertama kali di-render
    
    // Mengecek apakah dataProfile tidak null sebelum mencoba mengakses properti
    if (!dataProfile) {
        return <div></div>;
    }

    
    // Memperbarui label setiap 2 detik
    setInterval(() => {
        const id = localStorage.getItem('ID');
        setIDD(id);
    }, 1000);
    
    // console.log(dataProfile.id_user);
    




    return (
        <div className="xl:flex flex-wrap xl:w-[260px] hidden bg-white fixed font-Poppins">
            <div className='w-[260px] bg-white font-Inter h-[647px] sm:hidden lg:block'>
                <img className='w-[80px] mx-auto mt-10 mb-5 '
                    src={Logo} />

                

                <NavLink to='/Pengaduan'>
                    <div className={`flex mx-auto w-[200px] hover:bg-regal-blue hover:text-white rounded-xl p-3 mt-10 text-gray-400 ${location.pathname === '/Pengaduan' ? 'nav-link-active' : location.pathname === `/Objective/${IDD}` ? 'nav-link-active' : location.pathname === `/KeyResult/${IDD}` ? 'nav-link-active' : ''}`}>
                        <div className="flex my-auto w-fit font-semibold h-fit" >
                            <BiTargetLock size={'23px'} />
                            <p className={`ml-3 ${location.pathname === '/Pengaduan' ? 'nav-link-active' : ''}`} >Pengaduan</p>
                        </div>
                    </div>
                </NavLink>

                {/* {userRole === 'Admin' && (
          <NavLink to='/Approving'>
            <div className={`flex mx-auto w-[200px] hover:bg-regal-blue hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/Approving' ? '' : ''}`}>
              <div className="flex my-auto w-fit font-semibold h-fit" >
                <AiOutlineCheckCircle size={'23px'} />
                <p className={`ml-3 ${location.pathname === '/Approving' ? '' : ''}`} >Approving</p>
              </div>
            </div>
          </NavLink>
        )} */}

                {userRole === 'Admin' && (
                    <div className={`mx-auto w-[200px] mt-5 text-gray-400`}>
                        {/* <div className={`w-full mx-auto flex hover:bg-regal-blue hover:text-white rounded-xl p-3 text-gray-400 ${isClicked ? 'text-white bg-gray-300' : ''} `} onClick={toggleSubNav} id="nav-menu-1"> */}
                        <div className={`w-full mx-auto flex hover:bg-regal-blue hover:text-white rounded-xl cursor-pointer p-3 text-gray-400 ${location.pathname === '/Petugas' ? 'nav-link-active' : location.pathname === '/Masyarakat' ? 'nav-link-active' : ''} `} onClick={toggleSubNav} id="nav-menu-1">
                            <span className={` font-semibold mr-2`}><AiOutlineCheckCircle size={'23px'} /></span>
                            <p className={`w-fit font-semibold `}>User</p> <span className={`w-fit ml-auto h-fit my-auto font-semibold `}>{isClicked ? <AiOutlineUp /> : <AiOutlineDown />}</span>
                        </div>

                        <div className={`transition-all duration-1000 ease-in-out overflow-hidden ${showSubMenu ? 'block max-h-[200px] duration-1000 transition' : 'h-0'}`}>
                            {showSubNav && (
                                <div className="w-[150px] ml-auto">
                                    <ul className={`list-none w-full hover:list-disc mt-1 p-3 cursor-pointer rounded-xl ${location.pathname === '/Petugas' ? 'list-disc text-black' : ''}`}>
                                        <li className={`font-semibold ${location.pathname === '/Petugas' ? ' ' : ''}`}>
                                            <NavLink
                                                to='/Petugas'
                                                className={` flex font-semibold  ${location.pathname === '/Petugas' ? '' : ''}`}
                                            >
                                                Petugas
                                            </NavLink>
                                        </li>
                                    </ul>
                                    <ul className={`list-none hover:list-disc mt-1 p-3 cursor-pointer rounded-xl   ${location.pathname === '/Masyarakat' ? 'list-disc text-black' : ''}`}>
                                        <li className={`font-semibold`}>
                                            <NavLink
                                                to='/Masyarakat'
                                                className={`font-semibold`}
                                            >
                                                Masyarakat
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {userRole === 'Admin' && (

                    <NavLink to='/User'>
                        <div className={`flex mx-auto w-[200px] hover:bg-regal-blue hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/User' ? 'nav-link-active' : ''}`}>
                            <div className="flex my-auto w-fit font-semibold h-fit" >
                                <FaRegCircleUser size={'23px'} />
                                <p className={`ml-3 ${location.pathname === '/User' ? 'nav-link-active' : ''}`} >Tambah Akun</p>
                            </div>
                        </div>
                    </NavLink>
                )}

            </div>

            <div className={`flex mt-auto mx-auto w-[200px] hover:bg-regal-blue hover:text-white rounded-xl p-3 text-gray-400 cursor-pointer`} onClick={handleLogout}>
                <div className="flex my-auto w-fit font-semibold h-fit" >
                    <BiLogOut size={'23px'} />
                    <p className={`ml-3 `} >LOGOUT</p>
                </div>
            </div>

            <div className={`flex mt-auto mx-auto w-[200px] bg-white h-10`}>
            </div>

        </div>
    )
}
