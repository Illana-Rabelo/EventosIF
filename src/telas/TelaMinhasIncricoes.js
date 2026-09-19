import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function TelaMinhasInscricoes() {
  const [inscricoes, setInscricoes] = useState([]);

  function cancelar(id) {
    setInscricoes(inscricoes.filter((i) => i.id !== id));
  }

  console.log("[render] TelaMinhasInscricoes");

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas inscrições ({inscricoes.length})</Text>
      <FlatList
        data={inscricoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <Text>{item.titulo}</Text>
            <Button title="Cancelar" onPress={() => cancelar(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
});
