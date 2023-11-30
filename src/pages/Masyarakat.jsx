import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Masyarakat = () => {
    const [masyarakatData, setMasyarakatData] = useState([]);
    const apiUrl = 'http://localhost:4080/profile/all'; // Ganti dengan URL API yang sesuai

    useEffect(() => {
        // Mengambil data dari API ketika komponen dimount
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                setMasyarakatData(response.data.profileData); // Sesuaikan dengan struktur data aktual
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
                    <h2 className="text-2xl font-semibold mb-4">Data Masyarakat</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="p-3 border border-gray-300">Foto</th>
                                    <th className="p-3 border border-gray-300">NIK</th>
                                    <th className="p-3 border border-gray-300">Nama</th>
                                    <th className="p-3 border border-gray-300">Nomor Telepon</th>
                                    <th className="p-3 border border-gray-300">Alamat</th>
                                    <th className="p-3 border border-gray-300">Tanggal Lahir</th>
                                    <th className="p-3 border border-gray-300">Email</th>
                                    <th className="p-3 border border-gray-300">Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {masyarakatData.map(masyarakat => (
                                    <tr key={masyarakat._id}>
                                        <td className="p-3 border border-gray-300">
                                            <img
                                                src={`http://localhost:9000/pengaduan.profile/${masyarakat.foto}`}
                                                alt={`Profil ${masyarakat.nama}`}
                                                className="w-16 h-16 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="p-3 border border-gray-300">{masyarakat.nik}</td>
                                        <td className="p-3 border border-gray-300">{masyarakat.nama}</td>
                                        <td className="p-3 border border-gray-300">{masyarakat.notelpon}</td>
                                        <td className="p-3 border border-gray-300">{masyarakat.alamat}</td>
                                        <td className="p-3 border border-gray-300">{masyarakat.tanggal_lahir}</td>
                                        <td className="p-3 border border-gray-300">{masyarakat.email}</td>
                                        <td className="p-3 border border-gray-300">{masyarakat.gender}</td>
                                        
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

export default Masyarakat;
