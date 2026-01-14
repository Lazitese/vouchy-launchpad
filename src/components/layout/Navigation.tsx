import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { TbMenu2, TbX } from "react-icons/tb";

const Navigation = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "How it Works", id: "how-it-works" },
        { label: "Features", id: "features" },
        { label: "Design Library", path: "/templates" },
        { label: "Pricing", id: "pricing" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-4 inset-x-0 w-[95%] max-w-7xl mx-auto z-50 transition-all duration-300 rounded-2xl border ${scrolled
                    ? "bg-white/80 border-zinc-200/50 backdrop-blur-md shadow-sm py-3"
                    : "bg-transparent border-transparent py-5"
                    }`}
            >
                <div className="container mx-auto px-6 relative z-10 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-1.5 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <img
                                src="/Vouchy (64 x 64 px).svg"
                                alt="Vouchy"
                                className="w-8 h-8 object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold text-zinc-900 tracking-tight hidden sm:block">Vouchy</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 bg-zinc-100/50 p-1 rounded-full border border-zinc-200/50 backdrop-blur-sm">
                        <Link
                            to="/"
                            className="relative px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                            onMouseEnter={() => setHoveredNav('home')}
                            onMouseLeave={() => setHoveredNav(null)}
                        >
                            <span className="relative z-10">Home</span>
                            {hoveredNav === 'home' && (
                                <motion.div
                                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-zinc-100"
                                    layoutId="nav-hover"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                        {navItems.map((item) => (
                            item.path ? (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className="relative px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                                    onMouseEnter={() => setHoveredNav(item.label)}
                                    onMouseLeave={() => setHoveredNav(null)}
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    {hoveredNav === item.label && (
                                        <motion.div
                                            className="absolute inset-0 bg-white rounded-full shadow-sm border border-zinc-100"
                                            layoutId="nav-hover"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            ) : (
                                <a
                                    key={item.label}
                                    href={`#${item.id}`}
                                    className="relative px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                                    onMouseEnter={() => setHoveredNav(item.id!)}
                                    onMouseLeave={() => setHoveredNav(null)}
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    {hoveredNav === item.id && (
                                        <motion.div
                                            className="absolute inset-0 bg-white rounded-full shadow-sm border border-zinc-100"
                                            layoutId="nav-hover"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </a>
                            )
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate("/auth", { state: { mode: "login" } })}
                            className="text-zinc-600 hover:text-zinc-900 text-sm font-bold transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/auth", { state: { mode: "signup" } })}
                            className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-zinc-900 hover:text-zinc-700 p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <TbX size={24} /> : <TbMenu2 size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-primary pt-24 px-6 md:hidden"
                    >
                        {/* Background Texture for Mobile too */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="url(#nav-grid-pattern)" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col gap-4">
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-bold text-white py-2 border-b border-white/10"
                            >
                                Home
                            </Link>
                            {navItems.map((item) => (
                                item.path ? (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-bold text-white/90 hover:text-white py-2 border-b border-white/10"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a
                                        key={item.label}
                                        href={`#${item.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-bold text-white/90 hover:text-white py-2 border-b border-white/10"
                                    >
                                        {item.label}
                                    </a>
                                )
                            ))}
                            <div className="mt-8 flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        navigate("/auth", { state: { mode: "login" } });
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-4 rounded-xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/auth", { state: { mode: "signup" } });
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-4 rounded-xl bg-white text-primary font-bold text-lg hover:bg-zinc-50 transition-colors shadow-xl"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
