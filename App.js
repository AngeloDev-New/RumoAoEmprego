// classe responsavel por criar componentes
import {Component} from 'react';
// componentes padrao usados no app
import { View,Text,StyleSheet,Image,TouchableOpacity } from 'react-native';
// criando componente prprio que herda do componente inportado do proprio react
const frasesBiscoito = [
    "",
    "Grandes oportunidades surgirão em breve.",
    "A felicidade está nas pequenas coisas do dia a dia.",
    "Confie no processo, tudo acontece na hora certa.",
    "Um novo amigo trará boas energias para sua vida.",
    "A sorte favorece os que persistem.",
    "Seu esforço logo será recompensado.",
    "Um encontro inesperado mudará sua semana.",
    "Você é mais forte do que imagina.",
    "Grandes conquistas começam com pequenos passos.",
    "Acredite em si mesmo e nada será impossível.",
    "Novas portas se abrirão quando você menos esperar.",
    "A sorte está do seu lado hoje.",
    "Seja gentil e o universo será gentil com você.",
    "Alguém pensa em você neste exato momento.",
    "Você terá uma surpresa agradável em breve.",
    "Tudo que você precisa já está dentro de você.",
    "Siga em frente, o melhor ainda está por vir.",
    "Um sorriso abrirá caminhos inesperados.",
    "A paciência é o segredo para grandes conquistas.",
    "Hoje é um bom dia para começar algo novo."
    ];
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const images={
    aberto:require('./src/biscoitoAberto.png'),
    fechado:require('./src/biscoito.png')
}
class App extends Component{

    constructor(props){
        super(props)
        this.state={
            randon_num:0,
            image:images.fechado,
            textButton:'Quebrar Biscoito',
            aberto:false,

        }
       
    }
    
    render(){
        return (

            <View style={styles.container}>
                <Image
                    source={this.state.image}
                    style = {styles.img}
                />
                <Text style={styles.textoFrase}>{frasesBiscoito[this.state.randon_num]}</Text>
                <TouchableOpacity style={styles.botao} onPress={()=>{
                    if (this.state.aberto){
                        this.setState({
                            randon_num:0,
                            image:images.fechado,
                            textButton:'Quebrar Biscoito', 
                            aberto:false 
                        })
                    }else{
                        this.setState({
                            randon_num:numeroAleatorio(0,frasesBiscoito.length),
                            image:images.aberto,
                            textButton : '🔄',
                            aberto:true
                            })

                    }
                    }}>
                    <View style={styles.btnArea
                    }>
                        <Text style={styles.btnTexto}>
                            {this.state.textButton}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

        );
    }

};
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',   
    },
    img:{
        width:250,
        height:250,
    },
    textoFrase:{
        fontSize:20,
        color:'#dd7b22',
        margin:30,
        fontStyle:'italic',
        textAlign:'center',
    },
    botao:{
        width:230,
        height:50,
        borderWidth:2,
        borderColor:'#dd7b22',
        borderRadius:25
    },
    btnArea:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center',

    },
    btnTexto:{
        fontSize:18,
        fontWeight:'bold',
        color:'#dd7b22'
    }
    
});
export default App;