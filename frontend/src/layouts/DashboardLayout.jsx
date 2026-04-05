import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";

const DashbroadLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">
            {/* Top Navigation Bar */}
            <Navbar />
            
            {/* Main Dashboard Content */}
            <main className="flex-1 pt-24 pb-12 px-4 md:px-8 lg:px-10">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Global Footer */}
            <footer className="relative z-10 w-full mt-auto">
                <Footer />
            </footer>
        </div>
    )
}

export default DashbroadLayout;