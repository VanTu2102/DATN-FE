"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import environment from "@/util/environment";
import { generateCodeChallenge, generateUUID, requestToken } from "@/functions/oauth2/func";
import { signin, register, findAccountByEmail } from "@/controllers/account";
import { useSearchParams } from 'next/navigation'
import * as jwt from "jsonwebtoken"
const codeVerifier = environment.CODE_VERIFY;

export default function BodyPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const searchParams = useSearchParams()
    const state = searchParams.get('state')
    const code = searchParams.get('code')

    useEffect(() => {
        if (state && code) {
            if (state === localStorage.getItem('state')) {
                requestToken({
                    code: code,
                    client_id: environment.GOOGLE_CLIENT_ID,
                    client_secret: environment.GOOGLE_CLIENT_SECRET,
                    redirect_uri: environment.REDIRECT_URL,
                    grant_type: 'authorization_code',
                    code_verifier: codeVerifier
                }).then(async (v: any) => {
                    const user: any = jwt.decode(v.id_token)!
                    const exist_acc = await findAccountByEmail(user!.email)
                    if (!exist_acc) {
                        await register(user.email, "", user.name, "google")
                    }
                    localStorage.setItem('access_token', v.access_token)
                    localStorage.setItem('expires_in', v.expires_in)
                    localStorage.setItem('id_token', v.id_token)
                    localStorage.setItem('refresh_token', v.refresh_token)
                    localStorage.setItem('token_type', v.token_type)
                    localStorage.setItem('email', user.email)
                    router.push('/home')
                })
            }
        }
    }, []);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const googleLogin = async () => {
        generateCodeChallenge(codeVerifier).then((v: any) => {
            const state = generateUUID()
            localStorage.setItem("code_challenge", v)
            localStorage.setItem("state", state)
            router.push(`https://accounts.google.com/o/oauth2/v2/auth?code_challenge_method=S256&scope=email%20profile&access_type=offline&response_type=code&client_id=${environment.GOOGLE_CLIENT_ID}&redirect_uri=${environment.REDIRECT_URL}&code_challenge=${v}&state=${state}`)
        })
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        if (!isValidEmail(email)) {
            setError("Email is invalid");
            toast.error("Email is invalid");
            return;
        }

        const result = await signin(email, password)
        if (!result) {
            setError('Tài khoản không hợp lệ')
        }
        else {
            localStorage.setItem('access_token', result)
            localStorage.setItem('email', jwt.decode(result)!.email)
            router.push('/home')
        }
    };
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="flex justify-center flex-col items-center">
                <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>



                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-3 block text-sm leading-6 text-gray-900"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm leading-6">
                                <Link
                                    href="#"
                                    className="text-black hover:text-gray-900"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="text-sm text-sky-500 font-semibold leading-6 w-full flex justify-center mt-2">
                        <Link
                            href="/signup"
                            className="hover:text-sky-600"
                        >
                            Bạn chưa có tài khoản? Tạo tài khoản mới
                        </Link>
                    </div>

                    <div>
                        <div className="relative mt-8">
                            <div
                                className="absolute inset-0 flex items-center"
                                aria-hidden="true"
                            >
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-white px-6 text-gray-900">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button
                                onClick={async () => {
                                    await googleLogin()
                                }}
                                className="flex w-full items-center border border-gray-300 justify-center gap-3 rounded-md bg-white px-3 py-1.5 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <FcGoogle />
                                <span className="text-sm font-semibold leading-6">
                                    Google
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                }}
                                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                            >
                                <svg
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm font-semibold leading-6">
                                    GitHub
                                </span>
                            </button>

                        </div>
                        <p className="text-red-600 text-center text-[16px] my-4">
                            {error && error}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
