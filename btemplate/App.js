import { Component } from "react";
import { View,Text } from "react-native";
class App extends Component{

  render(){
    return(
      <View>
        <Text>Ola mundo</Text>
        <Text>Entendendo um poucoi sobre propriedades</Text>
        <Text style={
          {
            color:'#ff0000',
            fontSize:30
          }
        }>este texto ficara vermelho e grande 'lembrar de sempre usar aspas so pra strings'</Text>
      </View>
    )
  }
}
export default App