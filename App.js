import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvedor } from "./src/contextos/AppContexto";
import TelaDetalheEvento from "./src/telas/TelaDetalheEvento";
import TelaEventos from "./src/telas/TelaEventos";
import TelaMinhasInscricoes from "./src/telas/TelaMinhasIncricoes";

const Abas = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvedor>
      <NavigationContainer>
        <Abas.Navigator>
          <Abas.Screen name="Eventos" component={TelaEventos} />
          <Abas.Screen name="Detalhe" component={TelaDetalheEvento} />
          <Abas.Screen name="Inscricoes" component={TelaMinhasInscricoes} />
        </Abas.Navigator>
      </NavigationContainer>
    </AppProvedor>
  );
}
