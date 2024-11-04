"use client"
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Guard() {
    useEffect(() => {
        const accessDenied = localStorage.getItem('access_token')
        if (!accessDenied) {
            redirect('/login',)
        }
    }, [true]);
    return (
        <></>
    )
}
