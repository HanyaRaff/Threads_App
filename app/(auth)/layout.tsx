import React from 'react'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs"

import '../globals.css'

export const metadata = {
    title : "Threads_Clone",
    decription: "Thread Clone Using Next.js" 
}

const inter = Inter({subsets : ["latin"]})

const RootLayout = ({ children }: {
    children : React.ReactNode
}) => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}

export default RootLayout