"use client"
import { redirect } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

export default function Guard({ children }: { children: ReactNode }) {
    const [accessValid, setAccessValid] = useState(false)
    useEffect(() => {
        const accessDenied = localStorage.getItem('access_token')
        if (!accessDenied || accessDenied === undefined) {
            setAccessValid(false)
            redirect(window.location.href.split('?')[1] ? `/login?${window.location.href.split('?')[1]}` : '/login',)
        }
        else {
            setAccessValid(true)
        }
    }, [window.location.href, accessValid]);
    if(!accessValid){
        return <></>
    }
    return <div>
        {children}
    </div>
}
