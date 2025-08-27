import { Component } from "react";
import { View,Text ,Image} from "react-native";
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
      <Tigre largura={300} altura={300} message={'Trigri bolado'}/>
      <Text>Quase ia me esquecendo da imagem que aprendi a adicionar aqui tbm </Text>
      </View>

    )
  }
}
export default App

class Tigre extends Component{
  
  render(){
    let link = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMwz6gMfE5tld-6S4pYfs60t81RZQ7lJtaUI69S98Sz55XlMBIild_d7IrnjHjKsPzYFg&usqp=CAU'
    return(
      <View>
        <Image
        source={{uri:link}}
        style={{width:this.props.largura,height:this.props.altura}}
      />  
      <Text>{this.props.message}</Text>


      </View>
    )
  }
}