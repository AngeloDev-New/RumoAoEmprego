import {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button
} from 'react-native';
class App extends Component{
    constructor(props){
        super(props);
        this.state={
            cronometro:'00:00:00',
            estado:'start',
            // timer:null,
            seconds:0
        }
        this.timer = null

    }
    format = (seconds)=>{
        let segundos = seconds % 60;
        segundos = segundos < 10? `0${segundos}`:segundos;
        let minutos = Math.floor(seconds/60) % 60
        minutos = minutos < 10? `0${minutos}`:minutos;
        let horas = Math.floor(seconds/(60*60))
        horas = horas < 10?`0${horas}`:horas;
        if (horas > 99){
            return 'Muito tempo conometrando'
        }
        return `${horas}:${minutos}:${segundos}`
    }
    render(){
        return (
            <View style={styles.container}>
                <Image source={require('./src/cronometro.png')} style={styles.img} />
                <Text style={styles.texto}>{this.state.cronometro}</Text>
                <View style={styles.buttonsView}>
                    <Button style={styles.butonStyle} title={'reset'} disabled={this.state.estado==='start'} onPress={()=>{
                        clearInterval(this.timer)
                        this.timer = null;
                        this.setState({
                            cronometro:'00:00:00',
                            estado:'start',
                            seconds:0
                        });
                    }}/>
                    
                    <Button style={styles.butonStyle} title={this.state.estado} onPress={()=>{
                        if(this.state.estado === 'start' || this.state.estado === 'continue'){
                            if(!this.timer){
                                this.timer = setInterval(()=>{
                                    if (this.state.estado=='pause'){
                                        this.setState(prevState =>({
                                            seconds:prevState.seconds+1,
                                            cronometro:this.format(prevState.seconds)
                                        }));

                                    }
                                },1000)
                                this.setState({
                                    estado:'pause'
                                })
                            }
                            this.setState({
                                estado:'pause'
                            })
                        }
                        if(this.state.estado==='pause'){
                            this.setState({
                                estado:'continue'
                            }
                            );
                        }

                    }}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#222',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
    },
    buttonsView:{
        flexDirection:'row'

    },
    butonStyle:{
        margin:30,
        
    },
    img:{
        // width:300,
        // height:400
    },
    texto:{
        color:'#e4e4e4ff',
        fontSize:40
    }

});
export default App;