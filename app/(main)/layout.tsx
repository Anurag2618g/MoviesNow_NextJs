import Navbar from '@/components/layout/Navbar';

/**
 * Layout for all main (authenticated) pages.
 * Wraps every page with the Navbar.
 * The (main) folder name with parentheses is a Next.js Route Group —
 * it groups routes without affecting the URL path.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#141414]">
            <Navbar />
            <main>{children}</main>
        </div>
    );
}
