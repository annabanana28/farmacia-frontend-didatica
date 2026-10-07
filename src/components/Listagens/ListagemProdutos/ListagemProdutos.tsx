import { type JSX, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProdutoRequests from "../../../fetch/ProdutoRequests";
import type ProdutoDTO from "../../../dto/ProdutoDTO";
import Utilitario from "../../../utils/Utilitario";

function ListagemProdutos(): JSX.Element {
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [busca, setBusca] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [apenasAlerta, setApenasAlerta] = useState<boolean>(searchParams.get("alerta") === "true");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const lista = await ProdutoRequests.obterListaDeProdutos();
                setProdutos(lista);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                alert("Erro ao criar a listagem de produtos.");
            }
        };

        buscarProdutos();
    }, []);

    const toggleAlerta = () => {
        const novoValor = !apenasAlerta;
        setApenasAlerta(novoValor);
        setCurrentPage(1);
        if (novoValor) {
            setSearchParams({ alerta: "true" });
        } else {
            setSearchParams({});
        }
    };

    // Filtros
    const produtosFiltrados = produtos.filter((p) => {
        const termo = busca.toLowerCase();
        const matchDesc = p.descricao?.toLowerCase().includes(termo);
        const matchAlerta = apenasAlerta ? Boolean(p.emAlerta) : true;
        return matchDesc && matchAlerta;
    });

    // Lógica de Paginação
    const totalPages = Math.ceil(produtosFiltrados.length / rowsPerPage) || 1;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentProdutos = produtosFiltrados.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="bg-gray-200 flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8 flex-shrink-0">
                <h1 className="flex-1 text-xl sm:text-2xl md:text-3xl text-center sm:text-left font-bold text-slate-800">
                    Catálogo de Produtos
                </h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={toggleAlerta}
                        className={`px-4 py-2 md:py-3 text-xs sm:text-sm font-bold rounded-md transition-all cursor-pointer border ${
                            apenasAlerta
                                ? "bg-amber-600 text-white border-amber-600 shadow"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                        {apenasAlerta ? "⚠️ Mostrando Apenas Alertas" : "Filtrar Estoque Baixo"}
                    </button>
                    <button
                        onClick={() => navigate("/cadastro/produto")}
                        className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-slate-700 rounded-md text-white font-bold hover:bg-slate-600 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                    >
                        + Novo Produto
                    </button>
                </div>
            </div>

            {/* Input de busca */}
            <input
                type="text"
                name="busca-produto"
                id="busca-produto"
                value={busca}
                onChange={(e) => {
                    setBusca(e.target.value);
                    setCurrentPage(1);
                }}
                placeholder="Buscar produto pela descrição..."
                className="w-full max-w-7xl mx-auto p-3 mb-4 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-slate-500"
            />

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
                <div className="flex-1 overflow-auto overscroll-none">
                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">
                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left hidden sm:table-cell w-20">ID</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Descrição</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-right">Preço</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center">Estoque</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center hidden md:table-cell">Mínimo</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center hidden lg:table-cell">Validade</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center">Status</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentProdutos.length > 0 ? (
                                currentProdutos.map((produto) => (
                                    <tr
                                        className="transition-colors hover:bg-slate-50 group"
                                        key={produto.idProduto}
                                    >
                                        <td className="p-3 md:p-4 text-slate-500 hidden sm:table-cell font-medium">
                                            {produto.idProduto}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-800 font-semibold">
                                            {produto.descricao}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-700 font-medium text-right">
                                            {Utilitario.formatarParaReal(produto.preco)}
                                        </td>
                                        <td className="p-3 md:p-4 text-center font-bold">
                                            <span
                                                className={`px-2 py-0.5 rounded ${
                                                    produto.emAlerta
                                                        ? "text-red-700 bg-red-100"
                                                        : "text-slate-800"
                                                }`}
                                            >
                                                {produto.qtdEstoque}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4 text-center text-slate-500 hidden md:table-cell">
                                            {produto.qtdMinEstoque}
                                        </td>
                                        <td className="p-3 md:p-4 text-center text-slate-600 hidden lg:table-cell">
                                            {Utilitario.formatarData(produto.validade)}
                                        </td>
                                        <td className="p-3 md:p-4 text-center">
                                            {produto.emAlerta ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                                    ⚠️ Alerta
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                    Normal
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2 md:p-4 text-center">
                                            <button
                                                onClick={() => navigate(`/cadastro/produto/${produto.idProduto}`)}
                                                className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center p-10 text-slate-500 italic">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between flex-shrink-0">
                    <div className="text-xs sm:text-sm text-slate-600">
                        Mostrando <span className="font-semibold">{currentProdutos.length}</span> de{" "}
                        <span className="font-semibold">{produtosFiltrados.length}</span> produtos
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 border border-slate-300 text-xs sm:text-sm rounded-md bg-white text-slate-700 hover:bg-slate-100 ${
                                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                        >
                            Anterior
                        </button>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 border border-slate-300 text-xs sm:text-sm rounded-md bg-white text-slate-700 hover:bg-slate-100 ${
                                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ListagemProdutos;
