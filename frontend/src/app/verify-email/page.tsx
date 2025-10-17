import { Suspense } from "react";
import VerifyEmailForm from "@/components/shared/forms/verifyEmailForm";

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <VerifyEmailForm />
        </Suspense>
    );
}
