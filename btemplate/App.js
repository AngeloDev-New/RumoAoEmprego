import { Component } from "react";
import { View} from "react-native";
class App extends Component{
  render(){
    return (
      <View style={{flex:1,backgroundColor:'#1f1111ff',
        flexDirection:'row', //column por padrao
        justifyContent:'space-between', //flex-end,flex-start
        alignItems:'center'
      }}>
        <View style={{height:65,width:65,backgroundColor:'#222'}}></View>
        <View style={{height:65,width:65,backgroundColor:'#777171ff'}}></View>
        <View style={{height:65,width:65,backgroundColor:'#292020ff'}}></View>
      
      </View>
    );
  }
}

export default App

