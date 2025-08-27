import { Component } from "react";
import { View,Text ,Button} from "react-native";
class App extends Component{
  constructor(props){
    super(props);
    this.state={
      nome:''
    };
    this.entrar = this.entrar.bind(this);
  }
  entrar(nome){
    this.setState(
      {
        nome:nome
      }
    )
  }
  render(){
    return (
      <View style={{margin:50}}>
        <Button title="entrar" onPress={()=>this.entrar('Angelo')}/>
        <Text style={{
          fontSize:23,
          color:'red',
          textAlign:'center'
        }}>{this.state.nome}</Text>
      </View>
    );
  }
}
export default App

