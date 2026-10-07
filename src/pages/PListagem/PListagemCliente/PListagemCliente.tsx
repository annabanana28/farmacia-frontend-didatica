import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemClientes from "../../../components/Listagens/ListagemClientes/ListagemClientes";
import Rodape from "../../../components/Rodape/Rodape";

function PListagemCliente(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <ListagemClientes />
            <Rodape />
        </div>
    );
}

export default PListagemCliente;
