import React , {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,

}
from 'react-native'
class Pessoa extends Component{
  render(){
    return(
      <View style={styles.feedArea}>
        <Text style={styles.feed}>Nome:{this.props.data.nome}</Text>
        <Text style={styles.feed}>idade:{this.props.data.idade}</Text>
        <Text style={styles.feed}>Email:{this.props.data.email}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
feed:{
    color:'#fff',
    fontSize:20,
  },
feedArea:{
    backgroundColor : '#222',
    height:200,
    marginBottom:15
  }
}); 
export default Pessoa;