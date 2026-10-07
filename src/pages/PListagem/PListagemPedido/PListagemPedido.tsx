import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemPedidos from "../../../components/Listagens/ListagemPedidos/ListagemPedidos";
import Rodape from "../../../components/Rodape/Rodape";

function PListagemPedido(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <ListagemPedidos />
            <Rodape />
        </div>
    );
}

export default PListagemPedido;
