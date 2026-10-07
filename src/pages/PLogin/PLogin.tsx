import type { JSX } from "react";
import FormLogin from "../../components/Formularios/FormLogin/FormLogin";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";

function PLogin(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <FormLogin />
            <Rodape />
        </div>
    );
}

export default PLogin;
