import MainLayout from '@/components/MainLayout'
import { AiFillBook } from 'react-icons/ai'
import Guard from './guard'

export default function RootPrimary({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <MainLayout
            title='Sample Layout'
            menuItems={[
                {
                    icon: <AiFillBook />,
                    label: 'Home',
                    route: '/home'
                },
            ]}>
            <Guard />
            {children}
        </MainLayout>
    )
}
