// /app/auth/google/callback/page.tsx
import { Suspense } from "react"
import GoogleCallback from "./GoogleCallback"

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <GoogleCallback />
        </Suspense>
    )
}
