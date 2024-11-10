"use client"
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Guard() {
    useEffect(() => {
        const accessDenied = localStorage.getItem('access_token')
        if (!accessDenied || accessDenied === undefined) {
            redirect(window.location.href.split('?')[1] ? `/login?${window.location.href.split('?')[1]}` : '/login',)
        }
    }, [window.location.href]);
    return (
        <></>
    )
}
