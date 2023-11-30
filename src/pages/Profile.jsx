import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { HiWrenchScrewdriver } from 'react-icons/hi2';
import { BsInstagram, BsPencilSquare } from 'react-icons/bs';
import { RiTwitterXFill } from 'react-icons/ri';
import { FaTiktok } from 'react-icons/fa';

import Logo from './../assets/BGG.png';

export const Profile = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [Divisi, setDivisi] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [fotoFile, setfotoFile] = useState(null);
    const [instagramLink, setInstagramLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [tiktokLink, setTiktokLink] = useState('');
    const [dataProfile, setDataProfile] = useState(null);
    const [dataProfileAll, setDataProfileAll] = useState(null);
    const [formData, setFormData] = useState({
        namabadan: '',
        nama: '',
        email: '',
        notelpon: '',
        foto: null,
    });

    const role = localStorage.getItem('role');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const profileApiUrl =
                role === 'Admin' || role === 'Infrastruktur' || role === 'Sosial'
                    ? 'http://localhost:4080/profilepetugas/get'
                    : 'http://localhost:4080/profile/get';

            fetch(profileApiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Permintaan gagal');
                    }
                })
                .then((data) => {
                    setDataProfile(data);
                    setfotoFile(data.foto);
                    setImageFile(`http://localhost:9000/pengaduan.profile/${data.foto}`);
                    const produkData = data;
                    if (!formData.nama) {
                        setFormData({
                            namabadan: produkData.namabadan,
                            nama: produkData.nama,
                            email: produkData.email,
                            notelpon: produkData.notelpon,
                            foto: fotoFile,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                });

            fetch('http://localhost:4080/profile/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Permintaan gagal');
                    }
                })
                .then((data) => {
                    setDataProfileAll(data.profileData);
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                });
        } else {
            console.log('Token tidak ditemukan');
        }
    }, []);

    const convertDateFormat = (inputDate) => {
        if (!inputDate) {
            return null;
        }

        const dateComponents = inputDate.split('-');
        if (dateComponents.length !== 3) {
            return null;
        }

        const year = dateComponents[0];
        const month = dateComponents[1];
        const day = dateComponents[2];

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    };

    if (!dataProfile) {
        return <div>Loading...</div>;
    }
    if (!dataProfile.nama) {
        window.location.href = '/InputProfile';
    }

    const sosmeed = dataProfile.sosmed;
    const TanggalBenar = dataProfile.tanggal_lahir;
    const tanggalYangBenar = convertDateFormat(TanggalBenar);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'foto') {
            const file = e.target.files[0];
            setfotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    const Edit = async () => {
        try {

            const formDataToSend = {
                ...formData,
                foto: fotoFile,
            };

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.put(`http://localhost:4080/profilepetugas/edit`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify(formDataToSend),
            });

            if (response.status === 200 || response.status === 201) {
                try {
                    const responseData = response.data;
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil Edit Profile!',
                        icon: 'success',
                        confirmButtonText: 'OKE',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/Profile';
                        }
                    });

                    setSuccessMessage('Berhasil Edit Profile!');
                } catch (error) {
                    console.error('Gagal mengambil data JSON dari respons:', error);
                    Swal.fire('Error', 'Terjadi kesalahan dalam memproses respons', 'error');
                }
            }
            console.log('Data produk berhasil diperbarui', response.data);
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

    return (
        <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>
            <div className='w-[260px]'></div>

            <div className='w-[1260px]'>
                <div className='h-[70px]'></div>

                <div className='w-[1200px] mx-auto mt-[25px]'>
                    <img src={Logo} className='' />
                    <div className='flex relative -z-0 p-4 rounded-xl -mt-14 bg-white/80 w-[95%] mx-auto'>
                        <img
                            src={`http://localhost:9000/pengaduan.profile/${dataProfile.foto}`}
                            className='w-20 h-20 border-unggu/60 p-[5px] border-4 rounded-full my-auto'
                        />

                        <div className='my-auto ml-3'>
                            <h1 className='font-semibold text-xl'>{dataProfile.nama}</h1>
                            <h1 className='font-semibold text-base text-gray-500'>{dataProfile.role}</h1>
                        </div>

                        <div
                            className='ml-auto flex my-auto p-1 rounded-xl w-[120px] h-[50px] bg-white cursor-pointer hover:text-unggu hover:bg-Gold'
                            onClick={() => setShowEditModal(true)}
                        >
                            <div className='w-fit my-auto mx-auto h-fit flex'>
                                <BsPencilSquare size={'23px'} />
                                <p className=' font-semibold ml-2'>Edit</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-[1200px] mx-auto flex mt-[20px]'>
                    <div className='w-[700px] bg-white p-4 rounded-xl'>
                        <h1 className='font-semibold text-xl'>Profile Information</h1>
                        <h1 className='text-justify text-gray-500 mt-4'>{dataProfile.bio}</h1>

                        <div className='h-[1px] w-[95%] bg-gradient-to-r from-white/60 via-gray-300 to-white/60 mx-auto my-8'></div>

                        <div className='w-full h-fit flex'>
                            <div className=''>
                                <h1 className='font-semibold text-gray-400 mb-5'>
                                    Nama badan: <span className='font-normal'>{dataProfile.namabadan}</span>
                                </h1>
                                <h1 className='font-semibold text-gray-400 mb-5'>
                                    Nama: <span className='font-normal'>{dataProfile.nama}</span>
                                </h1>
                                <h1 className='font-semibold text-gray-400 mb-5'>
                                    Nomor telfon: <span className='font-normal'>{dataProfile.notelpon}</span>
                                </h1>
                                <h1 className='font-semibold text-gray-400 mb-5'>
                                    Email: <span className='font-normal'>{dataProfile.email}</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    {showEditModal && (
                        <div className='fixed inset-0 flex items-center justify-center z-10'>
                            <div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>
                            <div className='modal-container bg-white w-full max-w-2xl mx-auto rounded shadow-lg z-50 overflow-y-auto'>
                                <div className='modal-close flex z-50'>
                                    <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                        <h1>Edit Profile</h1>
                                    </div>
                                    <div
                                        className='close-button p-4 h-fit w-fit ml-auto cursor-pointer'
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]'>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='modal-content py-4 text-left px-6'>
                                    <div className='w-full max-h-[570px] '>
                                        <div className='w-full max-h-[480px] overflow-auto'>
                                            <label htmlFor='' className='font-semibold'>
                                                Nama badan
                                            </label>
                                            <input
                                                type='text'
                                                name='namabadan'
                                                required
                                                value={formData.namabadan || dataProfile.namabadan || ''}
                                                onChange={handleInputChange}
                                                className='px-2 mt-1 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-3'
                                            />
                                            <br />
                                            <label htmlFor='' className='font-semibold'>
                                                Nama
                                            </label>
                                            <input
                                                type='text'
                                                name='nama'
                                                required
                                                value={formData.nama || dataProfile.nama || ''}
                                                onChange={handleInputChange}
                                                className='px-2 mt-1 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-3'
                                            />
                                            <br />

                                            <label htmlFor='' className='font-semibold'>
                                                Email
                                            </label>
                                            <input
                                                type='email'
                                                name='email'
                                                required
                                                value={formData.email || dataProfile.email}
                                                onChange={handleInputChange}
                                                className='px-2 mt-1 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-3'
                                            />
                                            <br />

                                            <label htmlFor='' className='font-semibold'>
                                                Nomor telfon
                                            </label>
                                            <input
                                                type='text'
                                                name='notelpon'
                                                required
                                                value={formData.notelpon || dataProfile.notelpon}
                                                onChange={handleInputChange}
                                                className='px-2 mt-1 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-3'
                                            />
                                            <br />

                                            <input
                                                type='file'
                                                name='foto'
                                                id='file-input'
                                                onChange={handleInputChange}
                                                className='p-2 h-8 rounded-[5px] w-full mt-1 mb-[30px]'
                                                style={{ display: 'none' }}
                                            />
                                            <div className='w-full mt-1 mb-1'>
                                                <button
                                                    type='button'
                                                    className='bg-Gold w-full mx-auto text-black px-2 py-1 rounded-md mt-1'
                                                    onClick={() => document.getElementById('file-input').click()}
                                                >
                                                    Edit Foto
                                                </button>
                                            </div>
                                            <div className='w-[150px] mx-auto mt-5'>
                                                <img src={imageFile} alt='Foto Profil' style={{ maxWidth: '100%' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full mx-auto mt-5'>
                                        <input
                                            type='submit'
                                            value='Kirim'
                                            onClick={Edit}
                                            className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
