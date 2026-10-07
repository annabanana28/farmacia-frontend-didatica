import { type JSX } from "react";
import { useParams } from "react-router-dom";
import Navegacao from "../../../components/Navegacao/Navegacao";
import DetalhesPedido from "../../../components/Listagens/DetalhesPedido/DetalhesPedido";
import Rodape from "../../../components/Rodape/Rodape";

function PDetalhesPedido(): JSX.Element {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <DetalhesPedido idPedido={Number(id)} />
            <Rodape />
        </div>
    );
}

export default PDetalhesPedido;
