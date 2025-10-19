import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, Settings, Newspaper, LogOut, Trophy, Presentation, MessageCircleWarning, User, Book } from "lucide-react";

export default function Layout() {
    const navigate = useNavigate();

    const navItems = [
        { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { path: "/contest", label: "Contests", icon: <Trophy size={20} /> },
        { path: "/webinar", label: "Webinars", icon: <Presentation size={20} /> },
        { path: "/course", label: "Course", icon: <Book size={20} /> },
        { path: "/report", label: "Reports", icon: <MessageCircleWarning size={20} /> },
        { path: "/user-management", label: "User Management", icon: <User size={20} /> },
    ];

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8000/auth/logout", {
                method: "GET",
                credentials: "include",
            });
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-68 bg-orange-500 text-white flex flex-col justify-between p-5 shadow-lg">
                <div>
                    {/* Logo / App Name */}
                    <h2 className="text-3xl my-8 text-center tracking-wide">
                        Discover<b>You</b>
                    </h2>

                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${active
                                            ? "bg-white text-orange-600 font-semibold shadow-md"
                                            : "hover:bg-orange-400/70"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 transition-all text-white font-medium"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
