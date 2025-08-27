import { Component } from "react";
import { View,Text ,Button,StyleSheet} from "react-native";
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
      <View style={styles.area}>
        <Button title="entrar" onPress={()=>this.entrar('Angelo')}/>
        <Text style={[styles.texto,styles.area]}>{this.state.nome}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  area:{
    marginTop:50
  },
  texto:{
    fontSize:23,
    color:'red',
    textAlign:'center'
  }
})
export default App

