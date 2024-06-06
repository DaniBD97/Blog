import React from 'react'
import { useSelector } from 'react-redux'


export default function ThemeProvider({ children }) {
    const {theme} = useSelector((state) => state.theme)
    return (
        <div className={theme}>
            <div className='bg-white background dark:text-gray-200 dark:bg-[#0D0000]'>
            {children}
            </div>
           
        </div>
    )
}
