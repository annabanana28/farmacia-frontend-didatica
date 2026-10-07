import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import FormPedido from "../../../components/Formularios/FormPedido/FormPedido";
import Rodape from "../../../components/Rodape/Rodape";

function PCadastroPedido(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <FormPedido />
            <Rodape />
        </div>
    );
}

export default PCadastroPedido;
