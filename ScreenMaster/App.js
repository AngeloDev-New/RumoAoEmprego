import React , {Component} from 'react';
import {
  View,//ds
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity
  // Share futuro
} from 'react-native'
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import { Button } from 'react-native/types_generated/index';
class StartupScreen extends Component{
    
    pan = Gesture.Pan()
    .activeOffsetX([-10, 10]) // ignora movimentos pequenos no eixo X
    .failOffsetY([-5, 5])     // se mover no eixo Y, deixa o scroll da lista passar
    .onEnd((e) => {
      if (e.translationX > 50) {
        this.setState({ screen: 'StartupScreen'});
      } else if (e.translationX < -50) {
        
        this.setState({ screen: 'RecordingList' });
      }
    });
  constructor(props){
    super(props);
    this.state = {
      screen : 'RecordingList',
      buttonStyle : styles.centralButtonStart,
      InformationText:'Tap to start'
    }
  }
  render(){
    if (this.state.screen == 'StartupScreen'){
      return (
        <GestureHandlerRootView>
        <GestureDetector gesture={this.pan}>
        <View style={styles.container}>
        <View collapsable={false} style={styles.centeredButton}>
          <TouchableOpacity onPressOut={()=>{
            if (this.state.screen == 'RecordingList'){return;}
            else{Alert.alert("Zoon")}
          }}>
            <View style={this.state.buttonStyle} >
              <Text style={styles.centralButtonText}>{this.state.InformationText}</Text>
            </View>
          </TouchableOpacity>
        </View>
        </View> 
        </GestureDetector>
        </GestureHandlerRootView>
      );
    }else {
      if (this.state.screen == 'RecordingList'){
        return(
        <GestureHandlerRootView>
        <GestureDetector gesture={this.pan}>
            <View collapsable={false} style={styles.container}>
              <RecordingList/>
            </View>
        </GestureDetector>
        </GestureHandlerRootView>);
      } 
    }
  }
}

class RecordingList extends Component{
  constructor(props){
    super(props);
    this.state = {
      feed:[
        {id:1,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:2,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:3,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:4,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:5,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:6,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:7,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:8,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:9,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:10,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:11,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:12,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:13,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:14,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:15,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:16,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:17,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},
        {id:19,nome:'testeImage001',size:19,created:'2024-09-11 | 11:40pm'},

      ]
    }
  }
  render(){
    return(
      <View style={styles.galleryContainer}>
          <FlatList 
            numColumns={2} 
            data={this.state.feed}
            keyExtractor={(item)=> item.id.toString()} 
            renderItem={({item})=> <CardList data={item}/>}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    flex: 1,
  },
centralButtonStart: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [
    { translateX: -50 }, // metade do width
    { translateY: -50 }  // metade do height
  ],
  height: 100,
  width: 100,
  backgroundColor: '#ff0000', // vermelho
  borderRadius: 50,           // metade da largura
  borderWidth: 5,
  borderColor: '#fff',        // borda branca
  justifyContent: 'center',
  alignItems: 'center',
},

centralButtonText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
  textAlign: 'center',
},
  galleryContainer: {
    backgroundColor: '#333', // Cor diferente para distinguir
    flex: 1,
    padding: 10, // Adicionar um pouco de padding
  },
  fullTouchArea: {
  },
  centeredButton: {
    // backgroundColor:'#222',
    position:'absolute',
    
    top:'50%',
    flex: 1,
    height: '100%',
    width:'100%',

  },
  recText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },  
  feed:{
    color:'#222222ff',
    fontSize:20,    
    
  },

  feedArea: {
  height: 300,
  margin: 4,
  borderWidth: 1,
  flex: 1,
  overflow: 'hidden', 
  borderRadius: 10
},
  feedAreaExtern: {

  flex: 1,

},
tinyLogo: {
  width: '100%',      // ocupa toda a largura do feedArea
  height: '100%',     // ocupa toda a altura do feedArea
  resizeMode: 'cover' // mantém proporção e corta o excesso
},
feedSize: {
  position: 'absolute',    // faz o texto flutuar sobre a imagem
  top: 5,                  // distância do topo
  left: 5,                 // distância da esquerda
  backgroundColor: '#22222262', // fundo semi-transparente
  color: '#fff',           // cor do texto
  padding: 3,
  borderRadius: 5,
  zIndex: 10,
  fontSize:15

},
feedOptions:{
  position: 'absolute',    // faz o texto flutuar sobre a imagem
  top: 5,                  // distância do topo
  right: 5,                 // distância da esquerda
  backgroundColor: '#22222262', // fundo semi-transparente
  color: '#fff',           // cor do texto
  padding: 3,
  borderRadius: 20,
  zIndex: 10,
  fontSize:21
},
feedName:{
  color:'#fff',
  fontSize:15,
  fontWeight: 'bold'
},
feedCreated:{
  color:'#fff',
  fontSize:15,
}

});


class CardList extends Component{
  render(){
    return(
      <View style={styles.feedAreaExtern}>
        <View style={styles.feedArea}>
          <Text style={styles.feedSize}>{this.props.data.size}Mb</Text>
          <Text style={styles.feedOptions} onPress={()=>{Alert.alert(`Você clicou no option do componete ${this.props.data.id}! criar `)}}>  ⋮  </Text>
          <Image
          style={styles.tinyLogo}
          source={{ uri: 'https://th.bing.com/th/id/OIG3.a12MEqsVpd1xwcZrqeB8' }}
        />

          {/* <Text style={styles.feed}>Email:{this.props.data.email}</Text> */}
        </View>
        <View>
          <Text style={styles.feedName}>{this.props.data.nome}</Text>
          <Text style={styles.feedCreated}>{this.props.data.created}</Text>
        </View>
      </View>
    );
  }
}
export default StartupScreen;


