import { Suspense } from "react";
import ResetPasswordForm from "@/components/shared/forms/resetPasswordForm";

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
