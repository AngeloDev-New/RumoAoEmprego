import React , {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { Switch } from 'react-native-switch';
import Slider from '@react-native-community/slider';
export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      name:'',
      idade:'',
      sexo:0,
      generos:[
        {key:0,genero:'Selecione o Genero'},
        {key:1,genero:'Masculino'},
        {key:2,genero:'Feminino'},
        {key:3,genero:'Hermafrodita'},
      ],
      limitValue:5000,
      isStudent:true,
    }
  }
  render(){
    let generos = this.state.generos.map((v,k)=>{
      return(
        <Picker.Item key={v.key} value={v.key} label = {v.genero}/>
      );
    })
    return(
      <View style={styles.container}>
        <View style={styles.subcontainer}>

        <Text style={styles.text}>Banco React</Text>
        <Text style={styles.text}>Nome:</Text><TextInput
          onChangeText={input=>this.setState({name:input})}
         />
        <Text style={styles.text}>Idade:</Text><TextInput
          onChangeText={input=>this.setState({idade:input})}
         />
         <Picker
          selectedValue={this.state.sexo}
          onValueChange={(itenvalue,itenindex)=>this.setState({sexo:itenvalue})}
         >
          {generos}
         </Picker>
         <Slider
          minimumValue={0}
          maximumValue={5000}
          onValueChange={(v)=>this.setState({limitValue:v})}
         />
         <Text style={styles.Text}>Valor:{this.state.limitValue.toFixed(2)}</Text>
         <Text style={styles.text}>{this.state.isStudent ? 'Sou ':'Nao sou '}estudante</Text>
         <Switch
          value={this.state.isStudent}
          onValueChange={(v)=>this.setState({isStudent:v})}
         />
          <Button
            title='Confirmar'
            onPress={()=>{
              if(!(
                (!this.state.sexo) ||   
                (!this.state.name) ||   
                (!this.state.idade))  
              ){
                Alert.alert(`Ola ${this.state.name} do genero ${this.state.generos[this.state.sexo].genero} voce tem ${this.state.idade} anos. Voce realmente deseja adquirir um limite de R\$${this.state.limitValue.toFixed(2)} no seu cartao de credito?`)
              }else{
                Alert.alert('Preencha todos os campos')
              }
            }}
          />
        </View>

      </View>

    );
  }

}
const colors = {
  a:'#32556B',
  b:'#3A5D73',
  c:'#488FC8',
  d:'#6CCB17',
  e:'#FFC605'
};
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:colors.a
  },
  text:{
    backgroundColor:colors.d,
    color:colors.a,
    fontSize:25

  }
});