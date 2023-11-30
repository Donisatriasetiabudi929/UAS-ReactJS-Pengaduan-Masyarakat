import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import fotoBG from './../assets/logo.jpg';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { BsInstagram } from 'react-icons/bs';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [formData, setFormData] = useState({
        name: '',
        password: '',
    });

    // Use useNavigate instead of useHistory
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://vdzgxgqr-4080.asse.devtunnels.ms/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Response from server (success):', responseData);
    
                if (responseData.token) {
                    localStorage.setItem('token', responseData.token);
    
                    try {
                        const decodedToken = jwtDecode(responseData.token);
                        console.log('Decoded Token:', decodedToken);
    
                        const userId = decodedToken.id;
    
                        const responseUserData = await axios.get(`https://vdzgxgqr-4080.asse.devtunnels.ms/auth/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${responseData.token}`,
                            },
                        });
    
                        if (responseUserData.status === 200) {
                            const userData = responseUserData.data;
                            console.log('User Data:', userData);
                            
                            // Check the user's role
                            if (userData.user.role === "Masyarakat") {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Access Denied',
                                    text: 'You do not have access!',
                                });
                            } else {
                                localStorage.setItem('role', userData.user.role);
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Login Successful',
                                    text: 'Successfully logged in!',
                                });
    
                                // Redirect based on user role or navigate to the desired page
                                if (userData.user.role === "tets") {
                                    navigate('/halamanBarang');
                                } else {
                                    // navigate('/Pengaduan');
                                    window.location.href = '/pengaduan'; // Gantilah dengan URL yang sesuai

                                }
                            }
                        } else {
                            console.error('Failed to fetch user data');
                        }
                    } catch (decodeError) {
                        console.error('Error decoding token:', decodeError);
                    }
                } else {
                    console.error('Token not found in response');
                }
            } else {
                console.error('Login failed');
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid username or password!',
                });
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    
            
    };

    const pageStyle = {
        backgroundImage: `url(${fotoBG})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
    };

    return (
        <div style={pageStyle}>
            <div className='relative w-full flex h-[707px]'>
                <div className="w-[450px] h-[707px] bg-black opacity-80 ml-auto my-auto"></div>
                <div className="w-[450px] h-[707px] absolute z-10 flex right-0">
                    <div className="w-full my-auto">
                        <h1 className='font-semibold text-3xl text-white w-fit h-fit mx-auto mb-[50px] '>LOGIN</h1>

                        <div className="w-[300px] mx-auto">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder='Username'
                                    autoFocus
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className='p-2 h-8 rounded-[15px] w-full mb-[30px]'
                                />

                                <div className='relative w-full h-fit mb-[30px]'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder='Password'
                                        autoFocus
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className='p-2 h-8 rounded-[15px] w-full '
                                    />
                                    <div onClick={toggleShowPassword} className=' right-1 hover:text-unggu absolute top-1'>
                                        {showPassword ? <AiFillEyeInvisible size={'25px'} /> : <AiFillEye size={'25px'} />}
                                    </div>
                                </div>

                                <input
                                    type="submit"
                                    value="Login"
                                    className='rounded-xl w-full h-10 z-50 bg-unggu font-Inter font-semibold text-white'
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
