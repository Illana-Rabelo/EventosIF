import { createContext, useState } from "react";

export const AppContexto = createContext();
// R7: Criação de um contexto separado para isolar o domínio de inscrições
export const InscricoesContexto = createContext();

export function AppProvedor({ children }) {
  const [usuario, setUsuario] = useState({
    nome: "Visitante",
    matricula: null,
  });
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [ultimaBusca, setUltimaBusca] = useState("");

  // R6: Eleva o estado das inscrições para o contexto global
  const [inscricoes, setInscricoes] = useState([]);

  function inscrever(evento) {
    const jaInscrito = inscricoes.some((i) => i.id === evento.id);
    if (jaInscrito) {
      return;
    }
    setInscricoes((inscricoesAtuais) => [...inscricoesAtuais, evento]);
  }

  return { children };
}
