import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CartaoEvento from "../componentes/CartaoEvento";
import { AppContexto } from "../contextos/AppContexto";

export default function TelaEventos({ navigation }) {
  const { temaEscuro } = useContext(AppContexto);

  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [enviado, setEnviado] = useState(false);

  const [busca, setBusca] = useState("");
  const [inscricoes, setInscricoes] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    fetch("https://api.campus.iftm.edu.br/eventos")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setEventos(dados);
        setCarregando(false);
      })
      .catch((e) => {
        setErro(e.message);
        setCarregando(false);
      });
  }, []);

  // R1: Cálculo direto na renderização (sem useState e sem useEffect órfãos)
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
    setEventoSelecionado(evento);
    setEnviado(true);
  }

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
