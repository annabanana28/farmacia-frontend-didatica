import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthRequests from "../../../fetch/AuthRequests";
import Utilitario from "../../../utils/Utilitario";

function FormLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!Utilitario.validarEmail(email)) {
            alert("Por favor, informe um e-mail válido.");
            return;
        }

        if (!senha) {
            alert("A senha é obrigatória.");
            return;
        }

        try {
            setCarregando(true);
            const sucesso = await AuthRequests.login({ email, senha });

            if (sucesso) {
                alert("Login efetuado com sucesso!");
                navigate("/");
            } else {
                alert("Credenciais inválidas.");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro ao realizar login.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <main className="bg-gray-100 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800">Acesso ao Sistema</h1>
                    <p className="text-sm text-slate-500 mt-2">Farmácia Didática</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seuemail@farmacia.com"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="senha" className="block text-sm font-semibold text-slate-700 mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold text-base hover:bg-slate-700 shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        >
                            {carregando ? "ENTRANDO..." : "ENTRAR"}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-sm text-slate-600 hover:underline cursor-pointer"
                        >
                            Voltar para o Início
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default FormLogin;
