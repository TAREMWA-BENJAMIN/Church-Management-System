import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-6 sm:justify-center sm:pt-0 dark:bg-[#0F172A] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
            </div>

            <div className="w-full flex flex-col items-center justify-center relative z-10 px-4 sm:px-0">
                <div className="mb-8 flex flex-col items-center">
                    <Link href="/">
                        <ApplicationLogo className="h-16 w-auto fill-current text-purple-600 dark:text-purple-400 drop-shadow-sm" />
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                        Church ERP System
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                        Manage your diocese, institutions, and congregation with ease.
                    </p>
                </div>

                <div className="w-full overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl px-8 py-8 shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10 sm:max-w-md sm:rounded-2xl transition-all duration-300">
                    {children}
                </div>
            </div>
            
            {/* Footer text */}
            <div className="absolute bottom-6 text-center text-xs text-gray-500 dark:text-gray-500 w-full">
                &copy; {new Date().getFullYear()} Church Management System. All rights reserved.
            </div>
        </div>
    );
}
