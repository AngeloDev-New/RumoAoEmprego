// classe responsavel por criar componentes
import {Component} from 'react';
// componentes padrao usados no app
import { View,Text,StyleSheet,TextInput } from 'react-native';
// criando componente prprio que herda do componente inportado do proprio react
class App extends Component{
    // criando construtor pra tabalhar com states
    constructor(props){
        // passando as props pra classe pai
        super(props);
        // definindo variaveis do state
        this.state = {
            // variavel nome definida
            nome:'Angelo'
        };
        // vinculando metodo a classe burocrassia do js ...da pra usar arrow
        this.pagaNome = this.pegaNome.bind(this);

    }
    // definindo funca
    pegaNome(texto){
        if (texto.length > 0){
            this.setState({nome:'Bem vindo: '+texto});

        }else{
            this.setState({nome:''})
        }
    }
    // funcao principal de renderizacao
    render(){
        return (
            
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder='Digite seu nome'
                    underlineColorAndroid='transparent'
                    onChangeText={this.pagaNome}
                />
                <Text style={styles.texto}>{this.state.nome}</Text>
            </View>
        );
    }

};
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    input:{
        height:45,
        borderWidth:1,
        borderColor:'#222',
        margin:10,
        fontSize:20,
        padding:10,
    },
    texto:{
        textAlign:'right',
        fontSize:25,

    }
});
export default App;