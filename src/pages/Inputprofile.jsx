import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const InputProfile = () => {
    const [successMessage, setSuccessMessage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        namabadan: '',
        nama: '',
        notelpon: '',
        email: '',
        alamat: '',
        foto: null,
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const selectedFile = e.target.files[0];

            if (selectedFile) {
                const objectUrl = URL.createObjectURL(selectedFile);

                setFormData({
                    ...formData,
                    foto: selectedFile,
                });

                setImageFile(objectUrl);
            } else {
                setFormData({
                    ...formData,
                    foto: null,
                });
                setImageFile(null);
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.post('http://localhost:4080/profilepetugas/petugas/add', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Pendaftaran berhasil!',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Profile';
                    }
                });

                setSuccessMessage('Pendaftaran berhasil!');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

    return (
        <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>
            <div className="w-[375px]"></div>
            <div className="w-full">
<div className='h-[70px]'></div>

                <div className="w-[1220px] bg-white mx-auto mt-5">
                    <h1 className="w-[94%] mx-auto font-semibold text-3xl py-[36px]">Input Profile</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="flex">
                            <div className="w-[1100px] mx-auto">
                            <label htmlFor="" className='font-semibold h-fit'>Nama Badan</label>
                                <input type="text" name="namabadan" placeholder='Nama Lengkap' autoFocus value={formData.namabadan} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />
                                <label htmlFor="" className='font-semibold h-fit'>Nama</label>
                                <input type="text" name="nama" placeholder='Nama Lengkap' autoFocus value={formData.nama} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />

                                    <label htmlFor="" className='font-semibold h-fit'>Nomor Telpon</label>
                                <input type="text" name="notelpon" placeholder='Nomor Telpon' value={formData.notelpon} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />

                                <label htmlFor="" className='font-semibold h-fit'>Email</label>
                                <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />

                                

                                


                            <div className="w-[1100px] mx-auto">
                                <label htmlFor="" className='font-semibold h-fit'>Alamat</label>
                                <textarea name="alamat" placeholder='Alamat' value={formData.alamat} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[23.6px]' />
                            </div>
                                
                                <input type="file" name="foto" id="file-input" onChange={handleInputChange}
                                    className='p-2 h-8 rounded-[5px] w-full mt-2 mb-[30px]' style={{ display: 'none' }} />
                                <div className="mx-auto mt-2 w-fit">
                                    <button type="button"
                                        className="bg-unggu mx-auto text-white px-2 py-1 rounded-md mt-2 w-[500px]"
                                        onClick={() => document.getElementById('file-input').click()}
                                    >
                                        Tambah Foto Profile
                                    </button>
                                </div>
                                {imageFile && (
                                    <div className="w-fit mx-auto mt-3">
                                        <img src={imageFile} alt="Preview" style={{ maxWidth: '100%' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='w-[94%] mx-auto'>
                            <input type="submit" value="Kirim"
                                className='w-full h-[41px] rounded-xl font-semibold text-xl text-white bg-unggu mt-10' />
                        </div>
                        <div className="mt-5 w-full h-3"></div>
                    </form>
                </div>
                <div className="mt-10 w-full"></div>            
                </div>
        </div>
    );
};
