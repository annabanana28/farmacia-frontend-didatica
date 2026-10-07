import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemProdutos from "../../../components/Listagens/ListagemProdutos/ListagemProdutos";
import Rodape from "../../../components/Rodape/Rodape";

function PListagemProduto(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <ListagemProdutos />
            <Rodape />
        </div>
    );
}

export default PListagemProduto;
