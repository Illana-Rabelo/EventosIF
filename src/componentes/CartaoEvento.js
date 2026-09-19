import { Button, StyleSheet, Text, View } from "react-native";

export default function CartaoEvento({ evento, aoInscrever, aoAbrir }) {
  console.log("[render] CartaoEvento", evento.id);

  return (
    <View style={styles.cartao}>
      <Text style={styles.titulo} onPress={aoAbrir}>
        {evento.titulo}
      </Text>
      <Text style={styles.local}>
        {evento.local} — {evento.data}
      </Text>
      <Button title="Inscrever" onPress={aoInscrever} />
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    gap: 4,
  },
  titulo: { fontSize: 17, fontWeight: "bold" },
  local: { fontSize: 13, color: "#666666" },
});
