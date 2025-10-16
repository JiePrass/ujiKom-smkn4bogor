"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loginWithGoogle } from "@/lib/api/auth"

export default function GoogleCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get("code")

    useEffect(() => {
        if (!code) return

        const handleLogin = async () => {
            try {
                const { token, user } = await loginWithGoogle(code)
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                router.push("/")
            } catch {
                router.push("/login?error=google_failed")
            }
        }

        handleLogin()
    }, [code, router])

    return <p>Loading...</p>
}
