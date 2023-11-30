import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5";
import { MdAccessTimeFilled } from "react-icons/md";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { MdDriveFileRenameOutline, MdOutlineQuestionAnswer } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { IoIosHome } from "react-icons/io";
import { BsCalendarDate } from "react-icons/bs";
import { LiaCreativeCommonsNd } from "react-icons/lia";
import { useReactToPrint } from 'react-to-print';
import CsvDownloader from 'react-csv-downloader';





const PengaduanPage = () => {
    const [pengaduanData, setPengaduanData] = useState([]);
    const [selectedJenis_pengaduan, setSelectedJenis_pengaduan] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState({});
    const [tanggapanData, setTanggapanData] = useState([]);
    const [isTanggapanModalVisible, setIsTanggapanModalVisible] = useState(false);
    const [tanggapanInput, setTanggapanInput] = useState('');
    const [loadingTanggapan, setLoadingTanggapan] = useState(false);
    const [selectedPengaduanId, setSelectedPengaduanId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");


    const role = localStorage.getItem('role');
    const componentPdf = useRef()

    useEffect(() => {

        // Check if the role is either "Infrastruktur" or "Sosial"
        if (role === 'Infrastruktur' || role === 'Sosial') {
            const apiUrl = 'https://vdzgxgqr-4080.asse.devtunnels.ms/pengaduan/petugas/get';

            // Fetch data with authorization token
            fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    setPengaduanData(data);
                })
                .catch(error => {
                    console.error('Error fetching pengaduan data:', error);
                });
        } else {
            // Fetch data without authorization token
            fetch('https://vdzgxgqr-4080.asse.devtunnels.ms/pengaduan/all')
                .then(response => response.json())
                .then(data => {
                    setPengaduanData(data);
                })
                .catch(error => {
                    console.error('Error fetching pengaduan data:', error);
                });
        }
    }, []);

    const handleLihatDataPengaduan = (id) => {
        fetch(`https://vdzgxgqr-4080.asse.devtunnels.ms/pengaduan/getbyid/${id}`)
            .then(response => response.json())
            .then(data => {
                setSelectedComplaint(data.pengaduan);
                fetch(`https://vdzgxgqr-4080.asse.devtunnels.ms/tanggapan/pengaduan/${id}`, {})
                    .then(response => response.json())
                    .then(data => {
                        setTanggapanData(data.tanggapans);
                        setIsModalVisible(true);
                    })
                    .catch(error => {
                        console.error('Error fetching tanggapan data:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching complaint details:', error);
            });
    };

    const handleBeriTanggapan = (id) => {
        setSelectedPengaduanId(id);
        fetch(`https://vdzgxgqr-4080.asse.devtunnels.ms/pengaduan/getbyid/${id}`)
            .then(response => response.json())
            .then(data => {
                setSelectedComplaint(data.pengaduan);
                setIsTanggapanModalVisible(true);
            })
            .catch(error => {
                console.error('Error fetching pengaduan details:', error);
            });
    };

    const handleKirimTanggapan = () => {
        if (!tanggapanInput) {
            alert('Tanggapan cannot be empty.');
            return;
        }

        setLoadingTanggapan(true);

        const tanggapanPayload = {
            id_pengaduan: selectedPengaduanId,
            tanggapan: tanggapanInput,
        };

        fetch(`https://vdzgxgqr-4080.asse.devtunnels.ms/tanggapan/${selectedPengaduanId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(tanggapanPayload),
        })
            .then(response => response.json())
            .then(data => {
                // Handle success, e.g., close the modal, refresh the data, etc.
                console.log('Tanggapan sent successfully:', data);
                setLoadingTanggapan(false);
                setIsTanggapanModalVisible(false);
            })
            .catch(error => {
                console.error('Error sending tanggapan:', error);
                setLoadingTanggapan(false);
            });
    };

    const filteredPengaduanData = pengaduanData.filter(pengaduan => {
        return (
            (selectedJenis_pengaduan === "" || pengaduan.jenis_pengaduan === selectedJenis_pengaduan) &&
            (selectedStatus === "" || pengaduan.status === selectedStatus)
        );
    });


    const isAdmin = role === 'Admin';
    const canProvideResponse = !isAdmin;

    const generatePdf = useReactToPrint({
        content: () => componentPdf.current,
        documentTitle: "Data pengaduan",
        onAfterPrint: () => alert("Data pengaduan berhasil di cetak")
    });

    return (
        <div className='flex w-full bg-gray-100 h-fit font-Poppins'>
            <div className="w-[260px]"></div>

            <div className="w-[1260px]">
                <div className='h-[70px]'></div>

                <div className="w-[1200px] mx-auto mt-7">
                    <h2 className="text-2xl font-semibold mb-4">Daftar Pengaduan</h2>
                    {role === 'Admin' && (
                        <div className="flex space-x-2">
                            <select
                                name="jenis_pengaduanFilter"
                                value={selectedJenis_pengaduan}
                                onChange={(e) => setSelectedJenis_pengaduan(e.target.value)}
                                className='w-[200px] h-10 p-1 shadow-lg rounded-lg'
                            >
                                <option value="">Semua Jenis</option>
                                <option value="Infrastruktur">Infrastruktur</option>
                                <option value="Sosial">Sosial</option>
                            </select>

                            <select
                                name="statusFilter"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className='w-[200px] h-10 p-1 shadow-lg rounded-lg'
                            >
                                <option value="">Semua Status</option>
                                <option value="Belum Ditanggapi">Belum Ditanggapi</option>
                                <option value="Sudah Ditanggapi">Sudah Ditanggapi</option>
                            </select>
                            <div className='right-0'>
                                <button
                                    onClick={generatePdf}
                                    className='ml-[353px] w-[200px] px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none ml-5'
                                >
                                    Cetak PDF
                                </button>
                                <CsvDownloader
                                    datas={pengaduanData}
                                    text="Cetak Excel"
                                    filename={`Data pengaduan_` + new Date().toLocaleString()}
                                    extension=".csv"
                                    className='w-[200px] px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none ml-5'
                                />
                            </div>


                        </div>
                    )}




                    <div className="overflow-x-auto mt-7">
                        <div ref={componentPdf} style={{ width: '98%', margin: 'auto' }}>
                            <div className='text-center hidden print:block'>
                                <h2 className='font-bold text-xl mt-5 mb-2'>Data Pengaduan Masyarakat</h2>
                                <p className='mb-5'>Tanggal Cetak : {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <table className="min-w-full bg-white border border-gray-300 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 border border-gray-300">NIK</th>
                                        <th className="p-3 border border-gray-300">Nama</th>
                                        <th className="p-3 border border-gray-300">Tanggal Pengaduan</th>
                                        <th className="p-3 border border-gray-300">Jenis Pengaduan</th>
                                        <th className="p-3 border border-gray-300 w-[300px]">Isi Laporan</th>
                                        <th className="p-3 border border-gray-300">Status</th>
                                        <th className="p-3 border border-gray-300 print:hidden">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPengaduanData.map(pengaduan => (
                                        <tr key={pengaduan._id} className="hover:bg-gray-50 transition-all">
                                            <td className="p-3 border border-gray-300">{pengaduan.nik}</td>
                                            <td className="p-3 border border-gray-300">{pengaduan.nama}</td>
                                            <td className="p-3 border border-gray-300">{pengaduan.tanggal_pengaduan}</td>
                                            <td className="p-3 border border-gray-300">{pengaduan.jenis_pengaduan}</td>
                                            <td className="p-3 border border-gray-300">{pengaduan.isi_laporan}</td>
                                            <td className={`p-3 border border-gray-300 text-center ${pengaduan.status === 'Sudah Ditanggapi' ? 'text-green-500' : 'text-red-500'}`}>
                                                {pengaduan.status === 'Sudah Ditanggapi' ? (
                                                    <IoCheckmarkCircle className="text-2xl text-green-500 text-center" />
                                                ) : (
                                                    <HiQuestionMarkCircle className="text-2xl text-red-500 text-center" />
                                                )}
                                            </td>
                                            <td className="p-3 border border-gray-300 print:hidden">
                                                {pengaduan.status === 'Sudah Ditanggapi' ? (
                                                    <button
                                                        onClick={() => handleLihatDataPengaduan(pengaduan._id)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                                                    >
                                                        Lihat Pengaduan
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBeriTanggapan(pengaduan._id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                                                    >
                                                        Beri Tanggapan
                                                    </button>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {isModalVisible && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-white  rounded-lg w-[700px] max-h-[500px] overflow-y-auto flex flex-col relative">

                            <div className="w-full">
                                <div className="flex justify-between items-center mb-6 bg-white sticky top-0 z-100 p-5">
                                    <h2 className="text-3xl font-semibold text-gray-800">Detail Pengaduan</h2>
                                    <div className="close-button cursor-pointer" onClick={() => setIsModalVisible(false)}>
                                        <div className="w-[40px] h-[40px] flex items-center justify-center bg-purple-600 border p-1 rounded-full">
                                            <p className="text-white">X</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6 space-y-4 p-5">
                                    <p className="mb-2">
                                        <span className="font-semibold">NIK:</span> {selectedComplaint.nik}
                                    </p>
                                    <div className="flex items-center mb-2">
                                        <MdDriveFileRenameOutline className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.nama}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <LuPhone className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.notelpon}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <IoIosHome className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.alamat}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <BsCalendarDate className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.tanggal_pengaduan}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <LiaCreativeCommonsNd className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.jenis_pengaduan}
                                    </div>
                                    <p className="mb-2">
                                        <span className="font-semibold">Isi Laporan:</span> <br /> {selectedComplaint.isi_laporan}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full mt-4 border-t pt-4 p-5 ">
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Lampiran</h3>
                                <div className="flex space-x-4 overflow-x-auto">
                                    {selectedComplaint.files.map((file, index) => (
                                        <a
                                            key={index}
                                            href={`http://localhost:9000/pengaduan.laporan/${file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-shrink-0"
                                        >
                                            <img
                                                src={`http://localhost:9000/pengaduan.laporan/${file}`}
                                                alt={file}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full mt-4 border-t pt-4 p-5">
                                <h2 className="text-3xl font-semibold mb-4 text-gray-800">Detail Tanggapan</h2>
                                {tanggapanData.map((tanggapan, index) => (
                                    <div key={index} className="pt-4 mt-4">
                                        <p className="mb-2">
                                            <span className="font-semibold">Nama Petugas:</span> <br /> {tanggapan.nama}
                                        </p>
                                        <p className="mb-2">
                                            <span className="font-semibold">Tanggal Tanggapan:</span> <br /> {tanggapan.tanggal}
                                        </p>
                                        <p className="mb-2">
                                            <span className="font-semibold">Tanggapan:</span> <br /> {tanggapan.tanggapan}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}






                {isTanggapanModalVisible && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-white  rounded-lg w-[700px] max-h-[500px] overflow-y-auto flex flex-col relative">

                            <div className="w-full">
                                <div className="flex justify-between items-center mb-6 bg-white sticky top-0 z-100 p-5 w-full">
                                    <h2 className="text-3xl font-semibold text-gray-800">Detail Pengaduan</h2>
                                    <div className="close-button cursor-pointer" onClick={() => setIsTanggapanModalVisible(false)}>
                                        <div className="w-[40px] h-[40px] flex items-center justify-center bg-purple-600 border p-1 rounded-full">
                                            <p className="text-white">X</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6 space-y-4 p-5">
                                    <p className="mb-2">
                                        <span className="font-semibold">NIK:</span> {selectedComplaint.nik}
                                    </p>
                                    <div className="flex items-center mb-2">
                                        <MdDriveFileRenameOutline className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.nama}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <LuPhone className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.notelpon}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <IoIosHome className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.alamat}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <BsCalendarDate className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.tanggal_pengaduan}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <LiaCreativeCommonsNd className="mr-2 font-semibold text-2xl" />
                                        {selectedComplaint.jenis_pengaduan}
                                    </div>
                                    <p className="mb-2">
                                        <span className="font-semibold">Isi Laporan:</span> <br /> {selectedComplaint.isi_laporan}
                                    </p>
                                </div>
                                <h3 className="border-t text-2xl font-semibold mb-4 pt-2 text-gray-800 text-center">Lampiran</h3>

                                <ul className="flex space-x-4 overflow-x-auto p-5">

                                    {selectedComplaint.files.map((file, index) => (

                                        <li key={index}>
                                            <a
                                                href={`http://localhost:9000/pengaduan.laporan/${file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`http://localhost:9000/pengaduan.laporan/${file}`}
                                                    alt={file}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                {/* Render textarea and button based on role */}
                                {canProvideResponse && (
                                    <div className='p-5'>
                                        <label htmlFor="tanggapanInput" className="block mt-4">
                                            Tanggapan:
                                            <textarea
                                                id="tanggapanInput"
                                                value={tanggapanInput}
                                                onChange={(e) => setTanggapanInput(e.target.value)}
                                                className="w-full h-32 p-2 border border-gray-300 rounded-md"
                                            ></textarea>
                                        </label>

                                        <button
                                            onClick={handleKirimTanggapan}
                                            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                                            disabled={loadingTanggapan}
                                        >
                                            {loadingTanggapan ? 'Loading...' : 'Kirim Tanggapan'}
                                        </button>
                                    </div>
                                )}

                                {/* Render message for Admin */}
                                {isAdmin && (
                                    <p className="mt-4 text-red-500 p-5 text-center">Admin tidak dapat memberikan tanggapan</p>
                                )}

                            </div>
                        </div>

                        {/* <div className="close-button h-fit w-fit ml-auto mt-0 cursor-pointer" onClick={() => setIsTanggapanModalVisible(false)}>
                                <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]'>
                                    <p className='texe-black w-fit h-fit text-white m-auto'>X</p>
                                </div>
                            </div> */}
                    </div>

                )}


                <div className='h-[10px] mt-10'></div>
            </div>
        </div>
    );
};

export default PengaduanPage;