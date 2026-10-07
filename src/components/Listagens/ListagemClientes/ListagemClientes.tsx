import { type JSX, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../dto/ClienteDTO";
import Utilitario from "../../../utils/Utilitario";

function ListagemClientes(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [busca, setBusca] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const buscarClientes = async () => {
            try {
                const lista = await ClienteRequests.obterListaDeClientes();
                setClientes(lista);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
                alert("Erro ao carregar a listagem de clientes.");
            }
        };

        buscarClientes();
    }, []);

    // Filtro de busca
    const clientesFiltrados = clientes.filter((c) => {
        const termo = busca.toLowerCase();
        const nomeMatch = c.nome?.toLowerCase().includes(termo);
        const cpfMatch = c.cpf?.includes(termo);
        return nomeMatch || cpfMatch;
    });

    // Lógica de Paginação
    const totalPages = Math.ceil(clientesFiltrados.length / rowsPerPage) || 1;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentClientes = clientesFiltrados.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="bg-gray-200 flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8 flex-shrink-0">
                <h1 className="flex-1 text-xl sm:text-2xl md:text-3xl text-center sm:text-left font-bold text-slate-800">
                    Clientes
                </h1>
                <button
                    onClick={() => navigate("/cadastro/cliente")}
                    className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-slate-700 rounded-md text-center text-white font-bold flex items-center justify-center hover:cursor-pointer hover:bg-slate-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    + Novo Cliente
                </button>
            </div>

            {/* Input de busca */}
            <input
                type="text"
                name="busca-cliente"
                id="busca-cliente"
                value={busca}
                onChange={(e) => {
                    setBusca(e.target.value);
                    setCurrentPage(1);
                }}
                placeholder="Buscar por nome ou CPF..."
                className="w-full max-w-7xl mx-auto p-3 mb-4 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-slate-500"
            />

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
                <div className="flex-1 overflow-auto overscroll-none">
                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">
                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left w-24">ID</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Nome</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">CPF</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentClientes.length > 0 ? (
                                currentClientes.map((cliente) => (
                                    <tr
                                        className="transition-colors hover:bg-slate-50 group"
                                        key={cliente.idCliente || cliente.cpf}
                                    >
                                        <td className="p-3 md:p-4 text-slate-500 font-medium">
                                            {cliente.idCliente || "-"}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-800 font-semibold">
                                            {cliente.nome}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-600">
                                            {Utilitario.formatarCPF(cliente.cpf)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-10 text-slate-500 italic">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between flex-shrink-0">
                    <div className="text-xs sm:text-sm text-slate-600">
                        Mostrando <span className="font-semibold">{currentClientes.length}</span> de{" "}
                        <span className="font-semibold">{clientesFiltrados.length}</span> clientes
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

export default ListagemClientes;
