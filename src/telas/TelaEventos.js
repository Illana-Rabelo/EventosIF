import { useContext, useEffect, useReducer } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CartaoEvento from "../componentes/CartaoEvento";
// R7: importação alterada para incluir o InscricoesContexto
import { AppContexto, InscricoesContexto } from "../contextos/AppContexto";

// Estado inicial único para o useReducer
const estadoInicial = {
  eventos: [],
  carregando: true,
  erro: null,
  enviado: false,
};

// Função Reducer que centraliza as transições de estado
function reducer(estado, acao) {
  switch (acao.type) {
    case "SUCESSO_FETCH":
      return {
        ...estado,
        eventos: acao.payload,
        carregando: false,
        erro: null,
      };
    case "ERRO_FETCH":
      return { ...estado, erro: acao.payload, carregando: false };
    case "CONFIRMAR_ENVIO":
      return { ...estado, enviado: true };
    default:
      return estado;
  }
}

export default function TelaEventos({ navigation }) {
  // R6: Consumindo as inscrições e a função global do contexto
  const { temaEscuro } = useContext(AppContexto);
  const { inscricoes, inscrever: inscreverGlobal } =
    useContext(InscricoesContexto);

  // R4: Substituindo múltiplos useState pelo useReducer unificado
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  const { eventos, carregando, erro, enviado } = state;

  const [busca, setBusca] = useState("");
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState(null);

  // R5: AbortController para cancelar o fetch se o componente for desmontado
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch("https://api.campus.iftm.edu.br/eventos", { signal })
      .then((resposta) => resposta.json())
      .then((dados) => {
        dispatch({ type: "SUCESSO_FETCH", payload: dados });
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          dispatch({ type: "ERRO_FETCH", payload: e.message });
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  // R1: Cálculo direto na renderização (sem useState e sem useEffect)
  const eventosFiltrados = eventos.filter((ev) =>
    ev.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  const totalInscricoes = inscricoes.length;

  // R2: Função de inscrição corrigida (sem mutação direta e prevenindo duplicatas)
  function inscrever(evento) {
    const jaInscrito = inscricoes.some((i) => i.id === evento.id);
    if (jaInscrito) {
      return; // Regra de negócio: evita inscrição duplicada no mesmo evento
    }

    setInscricoes((inscricoesAtuais) => [...inscricoesAtuais, evento]);
    setEventoSelecionadoId(evento.id);
    dispatch({ type: "CONFIRMAR_ENVIO" });
  }

  // R3: Busca o evento selecionado diretamente da lista usando o ID
  const eventoSelecionado = eventos.find((ev) => ev.id === eventoSelecionadoId);

  console.log("[render] TelaEventos");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: temaEscuro ? "#121212" : "#FFFFFF" },
      ]}
    >
      <Text style={styles.contador}>Inscrições: {totalInscricoes}</Text>
      <TextInput
        style={styles.campo}
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar evento"
      />
      {carregando && <ActivityIndicator size="large" />}
      {erro && <Text style={styles.erro}>Falha: {erro}</Text>}
      {enviado && eventoSelecionado && (
        <Text style={styles.aviso}>
          Inscrição confirmada em {eventoSelecionado.titulo}
        </Text>
      )}
      <FlatList
        data={eventosFiltrados}
        keyExtractor={(itemLista) => String(itemLista.id)}
        renderItem={({ item }) => (
          <CartaoEvento
            evento={item}
            aoInscrever={() => inscrever(item)}
            aoAbrir={() => navigation.navigate("Detalhe", { evento: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  contador: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  campo: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  erro: { color: "#B00020", marginBottom: 8 },
  aviso: { color: "#2E7D32", marginBottom: 8 },
});
