import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../dto/ClienteDTO";
import Utilitario from "../../../utils/Utilitario";

function FormCliente() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ClienteDTO>({
        nome: "",
        cpf: ""
    });
    const [carregando, setCarregando] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "cpf") {
            const cpfFormatado = Utilitario.formatarCPF(value);
            setFormData(prev => ({ ...prev, [name]: cpfFormatado }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            alert("O nome é obrigatório.");
            return;
        }

        if (!Utilitario.validarCPF(formData.cpf)) {
            alert("O CPF deve conter 11 dígitos válidos.");
            return;
        }

        try {
            setCarregando(true);
            const sucesso = await ClienteRequests.cadastrarCliente({
                nome: formData.nome.trim(),
                cpf: formData.cpf.replace(/\D/g, "")
            });

            if (sucesso) {
                alert("Cliente cadastrado com sucesso!");
                navigate("/lista/clientes");
            } else {
                alert("Não foi possível cadastrar o cliente. Verifique se o CPF já existe.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
            alert("Erro ao enviar dados do cliente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <main className="bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-slate-800 mb-8 sm:mb-10">
                        Cadastro de Cliente
                    </h1>

                    <div className="space-y-6">
                        {/* Nome */}
                        <div>
                            <label htmlFor="nome" className="block text-sm font-semibold text-slate-700 mb-2">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                required
                                minLength={3}
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome completo do cliente"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* CPF */}
                        <div>
                            <label htmlFor="cpf" className="block text-sm font-semibold text-slate-700 mb-2">
                                CPF
                            </label>
                            <input
                                type="text"
                                name="cpf"
                                id="cpf"
                                required
                                maxLength={14}
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                            />
                            <p className="text-xs text-slate-500 mt-1">Apenas números ou formatado com pontos e traço.</p>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        <input
                            type="submit"
                            disabled={carregando}
                            value={carregando ? "CADASTRANDO..." : "CADASTRAR CLIENTE"}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-base sm:text-lg cursor-pointer hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => navigate("/lista/clientes")}
                            className="w-full bg-white border-2 border-slate-300 text-slate-600 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            VOLTAR PARA LISTAGEM
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default FormCliente;
