import { StyleSheet, Text, View } from "react-native";

export default function TelaDetalheEvento({ route }) {
  const { evento } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{evento.titulo}</Text>
      <Text style={styles.texto}>{evento.descricao}</Text>
      <Text style={styles.texto}>Vagas restantes: {evento.vagas}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  texto: { fontSize: 16 },
});
