import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Petugas = () => {
    const [PetugasData, setPetugasData] = useState([]);
    const apiUrl = 'http://localhost:4080/profilepetugas/all'; // Ganti dengan URL API yang sesuai

    useEffect(() => {
        // Mengambil data dari API ketika komponen dimount
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                setPetugasData(response.data.profileData); // Sesuaikan dengan struktur data aktual
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [apiUrl]);

    return (
        <div className='flex w-full bg-gray-100 h-fit font-Poppins'>
            <div className="w-[260px]"></div>

            <div className="w-[1260px]">
                <div className='h-[70px]'></div>

                <div className="w-[1200px] mx-auto mt-5">
                    <h2 className="text-2xl font-semibold mb-4">Data Petugas</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="p-3 border border-gray-300">Foto</th>
                                    <th className="p-3 border border-gray-300">Nama Badan</th>
                                    <th className="p-3 border border-gray-300">Nama</th>
                                    <th className="p-3 border border-gray-300">Nomor Telepon</th>
                                    <th className="p-3 border border-gray-300">Email</th>
                                    <th className="p-3 border border-gray-300">Alamat</th>
                                    <th className="p-3 border border-gray-300">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PetugasData.map(petugas => (
                                    <tr key={petugas._id}>
                                        <td className="p-3 border border-gray-300">
                                            <img
                                                src={`http://localhost:9000/pengaduan.profile/${petugas.foto}`}
                                                alt={`Profil ${petugas.nama}`}
                                                className="w-16 h-16 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="p-3 border border-gray-300">{petugas.namabadan}</td>
                                        <td className="p-3 border border-gray-300">{petugas.nama}</td>
                                        <td className="p-3 border border-gray-300">{petugas.notelpon}</td>
                                        <td className="p-3 border border-gray-300">{petugas.email}</td>
                                        <td className="p-3 border border-gray-300">{petugas.alamat}</td>
                                        <td className="p-3 border border-gray-300">{petugas.role}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='h-[10px] mt-10'></div>
            </div>
        </div>
    );
};

export default Petugas;
