import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import FormCliente from "../../../components/Formularios/FormCliente/FormCliente";
import Rodape from "../../../components/Rodape/Rodape";

function PCadastroCliente(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <FormCliente />
            <Rodape />
        </div>
    );
}

export default PCadastroCliente;
