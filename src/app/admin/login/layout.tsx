import { Suspense } from 'react';
import AdminLoginPage from './page';

export default function LoginLayout() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B4965] via-[#2D5A27] to-[#1E3D1A]">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <AdminLoginPage />
        </Suspense>
    );
}
