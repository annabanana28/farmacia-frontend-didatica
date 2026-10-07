import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProdutoRequests from "../../../fetch/ProdutoRequests";
import type ProdutoDTO from "../../../dto/ProdutoDTO";
import Utilitario from "../../../utils/Utilitario";

function FormProduto() {
    const navigate = useNavigate();
    const { idProduto } = useParams<{ idProduto?: string }>();
    const isEdicao = Boolean(idProduto);

    const [formData, setFormData] = useState<ProdutoDTO>({
        descricao: "",
        preco: 0,
        qtdEstoque: 0,
        qtdMinEstoque: 0,
        validade: ""
    });
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (isEdicao && idProduto) {
            const carregarProduto = async () => {
                setCarregando(true);
                try {
                    const lista = await ProdutoRequests.obterListaDeProdutos();
                    const encontrado = lista.find(p => p.idProduto === Number(idProduto));
                    if (encontrado) {
                        setFormData({
                            descricao: encontrado.descricao || "",
                            preco: Number(encontrado.preco) || 0,
                            qtdEstoque: Number(encontrado.qtdEstoque) || 0,
                            qtdMinEstoque: Number(encontrado.qtdMinEstoque) || 0,
                            validade: encontrado.validade ? Utilitario.formatarDataParaInput(encontrado.validade) : ""
                        });
                    } else {
                        alert("Produto não encontrado.");
                        navigate("/lista/produtos");
                    }
                } catch (error) {
                    console.error("Erro ao carregar produto para edição:", error);
                } finally {
                    setCarregando(false);
                }
            };

            carregarProduto();
        }
    }, [idProduto, isEdicao, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === "number") {
            setFormData(prev => ({ ...prev, [name]: value === "" ? 0 : Number(value) }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.descricao.trim()) {
            alert("A descrição do produto é obrigatória.");
            return;
        }

        if (formData.preco < 0) {
            alert("O preço não pode ser negativo.");
            return;
        }

        if (formData.qtdEstoque < 0 || formData.qtdMinEstoque < 0) {
            alert("As quantidades de estoque não podem ser negativas.");
            return;
        }

        try {
            setCarregando(true);

            if (isEdicao && idProduto) {
                const sucesso = await ProdutoRequests.atualizarProduto(Number(idProduto), {
                    descricao: formData.descricao.trim().toUpperCase(),
                    preco: Number(formData.preco),
                    qtdEstoque: Number(formData.qtdEstoque),
                    qtdMinEstoque: Number(formData.qtdMinEstoque),
                    validade: formData.validade ? new Date(String(formData.validade)) : null
                });

                if (sucesso) {
                    alert("Produto atualizado com sucesso!");
                    navigate("/lista/produtos");
                } else {
                    alert("Erro ao atualizar produto.");
                }
            } else {
                const sucesso = await ProdutoRequests.cadastrarProduto({
                    descricao: formData.descricao.trim().toUpperCase(),
                    preco: Number(formData.preco),
                    qtdEstoque: Number(formData.qtdEstoque),
                    qtdMinEstoque: Number(formData.qtdMinEstoque),
                    validade: formData.validade ? new Date(String(formData.validade)) : null
                });

                if (sucesso) {
                    alert("Produto cadastrado com sucesso!");
                    navigate("/lista/produtos");
                } else {
                    alert("Erro ao cadastrar produto.");
                }
            }
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert("Erro ao processar requisição do produto.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <main className="bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-slate-800 mb-8 sm:mb-10">
                        {isEdicao ? "Atualizar Produto" : "Cadastro de Produto"}
                    </h1>

                    <div className="space-y-6">
                        {/* Descrição */}
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-semibold text-slate-700 mb-2">
                                Descrição do Produto
                            </label>
                            <input
                                type="text"
                                name="descricao"
                                id="descricao"
                                required
                                minLength={2}
                                value={formData.descricao}
                                onChange={handleChange}
                                placeholder="Ex: DIPIRONA 500MG COM 20 COMPRIMIDOS"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Linha 2: Preço e Validade */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="preco" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Preço Unitário (R$)
                                </label>
                                <input
                                    type="number"
                                    name="preco"
                                    id="preco"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={formData.preco}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="validade" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Data de Validade (opcional)
                                </label>
                                <input
                                    type="date"
                                    name="validade"
                                    id="validade"
                                    value={formData.validade ? String(formData.validade) : ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Linha 3: Estoque e Estoque Mínimo */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="qtdEstoque" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Quantidade em Estoque
                                </label>
                                <input
                                    type="number"
                                    name="qtdEstoque"
                                    id="qtdEstoque"
                                    min="0"
                                    required
                                    value={formData.qtdEstoque}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="qtdMinEstoque" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Quantidade Mínima (Alerta)
                                </label>
                                <input
                                    type="number"
                                    name="qtdMinEstoque"
                                    id="qtdMinEstoque"
                                    min="0"
                                    required
                                    value={formData.qtdMinEstoque}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-1">Dispara alerta quando o estoque for menor ou igual a este valor.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        <input
                            type="submit"
                            disabled={carregando}
                            value={carregando ? "SALVANDO..." : (isEdicao ? "ATUALIZAR PRODUTO" : "CADASTRAR PRODUTO")}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-base sm:text-lg cursor-pointer hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => navigate("/lista/produtos")}
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

export default FormProduto;
