"use client"
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Guard() {
    const searchParams = useSearchParams()
    useEffect(() => {
        const accessDenied = localStorage.getItem('access_token')
        if (!accessDenied) {
            console.log(window.location.href)
            console.log(searchParams.get('state'));
            redirect('/login',)
        }
    }, [window.location.href]);
    return (
        <></>
    )
}
