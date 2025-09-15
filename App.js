import React , {Component} from 'react';
import {
  View,//ds
  Text,
  StyleSheet,
  FlatList
} from 'react-native'
import Pessoa from './src/Pessoa'
class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      feed:[
        {id:1,nome:'Eduardo',idade:19,email:'eduardo@dominio.com'},
        {id:2,nome:'Camilly',idade:25,email:'camilly@dominio.com'},
        {id:3,nome:'Angelo',idade:18,email:'angelo@dominio.com'},
        {id:4,nome:'Frederico',idade:16,email:'frederico@dominio.com'},
        {id:5,nome:'Robsson',idade:24,email:'robsson@dominio.com'},
        {id:6,nome:'Fernanda',idade:62,email:'fernanda@dominio.com'},
        {id:7,nome:'Gabriel',idade:17,email:'gabriel@dominio.com'},
      ]
    }
  }
  render(){
    return(
      <View Style={styles.container}>
          <FlatList 
            data={this.state.feed}
            keyExtractor={(item)=> item.id} 
            renderItem={({item})=> <Pessoa data={item}/>}/>
      </View>
    );
  }
}
styles = StyleSheet.create({
  container:{
    flex:1,
  },  

});

export default App;

