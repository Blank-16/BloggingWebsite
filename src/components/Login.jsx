import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'



function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm(); // {https://youtu.be/lfMyCuB6xfc?si=4DnKPZgJaOXOS1zu&t=1183}
    const [error, setError] = useState("")
    

    const login = async (data) => {

        setError("");
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(authLogin({ userData }));
                    navigate("/")
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }


    return (
        <div className='flex items-center justify-center w-full mt-4'>
            <div className={`mx-auto w-full max-w-lg bg-gray-800 rounded-xl p-10 border border-black/10`}>

                <div className="mb-2 justify-center flex items-center">
                    <span className='inline-block w-full max-w-[100px] '>
                        <Logo width='100%' />
                    </span>
                </div>

                <h2 className='text-center text-2xl font-bold leading-tight'>
                    Sign in to your account
                </h2>

                <p className='mt-2 text-center text-base text-white/60'>
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className='font-medium transition-all duration-200 hover:underline'
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>
                    {error}</p>}
                <form
                    onSubmit={handleSubmit(login)} // {handle submit is an event}
                    className='mt-8'
                >

                    <div className="space-y-5">
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', {
                                required: true,
                                validate: {
                                    matchPattern: (value) => {
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                                    }
                                }
                            })} // (...) is compulsory to not override the input in another place if used so spreading is compulsory everytime 
                        />

                        <Input
                            label="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />

                        <Button 
                            type='submit'
                            className='w-full'
                        >
                            Sign-In
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login