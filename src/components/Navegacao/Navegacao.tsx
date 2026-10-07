import { useState, type JSX } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import appIcon from "../../assets/app-icon.svg";

function Navegacao(): JSX.Element {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const links = [
        { label: "Home", path: "/" },
        { label: "Clientes", path: "/lista/clientes" },
        { label: "Produtos", path: "/lista/produtos" },
        { label: "Pedidos", path: "/lista/pedidos" },
    ];

    return (
        <header className="bg-slate-700 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Marca */}
                    <div
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => handleNavigate("/")}
                    >
                        <img
                            alt="Farmácia Didática Logo"
                            src={appIcon}
                            className="h-10 w-auto object-contain"
                        />
                        <span className="text-white font-bold text-lg tracking-wide hidden sm:inline">
                            Farmácia Didática
                        </span>
                    </div>

                    {/* Links Desktop */}
                    <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <button
                                    key={link.path}
                                    onClick={() => handleNavigate(link.path)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-100 hover:bg-slate-600 hover:text-white"
                                    }`}
                                >
                                    {link.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Botão de Ação Rápida */}
                    <div className="hidden md:flex items-center">
                        <button
                            onClick={() => handleNavigate("/cadastro/pedido")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow cursor-pointer"
                        >
                            + Novo Pedido
                        </button>
                    </div>

                    {/* Botão Mobile Hamburguer */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white p-2 rounded-md hover:bg-slate-600 focus:outline-none cursor-pointer"
                            aria-label="Abrir menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-800 px-4 pt-2 pb-4 space-y-1 border-t border-slate-600 animate-slideInDown">
                    {links.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => handleNavigate(link.path)}
                            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                                location.pathname === link.path
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-200 hover:bg-slate-700 hover:text-white"
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                    <div className="pt-2">
                        <button
                            onClick={() => handleNavigate("/cadastro/pedido")}
                            className="w-full bg-emerald-600 text-white text-sm font-bold py-2 rounded-lg cursor-pointer"
                        >
                            + Novo Pedido
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navegacao;
