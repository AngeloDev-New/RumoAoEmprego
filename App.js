import { Component } from "react";
import {View,ScrollView,StyleSheet} from 'react-native';

class App extends Component{
    render(){
        return(
            <View>
                <ScrollView>
                    <View style={styles.boxA}></View>
                    <View style={styles.boxB}></View>
                    <View style={styles.boxA}></View>
                    <View style={styles.boxB}></View>
                    <View style={styles.boxA}></View>
                    <View style={styles.boxB}></View>
                    <View style={styles.boxA}></View>
                    <View style={styles.boxB}></View>
                </ScrollView>
            </View>
        );
    }
}
styles = StyleSheet.create({
    boxA:{
        backgroundColor:'#b9b9b9ff',
        height:250
    },
    boxB:{
        backgroundColor:'#222',
        height:250
    }
});
export default App;