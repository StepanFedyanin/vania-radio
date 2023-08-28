import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {NativeBaseProvider, Text, Box} from "native-base";
import {LinearGradient} from 'expo-linear-gradient';
import {useFonts} from 'expo-font'

import LRadioApp from './src/l-radio-app.jsx';
import AppLoading from 'expo-app-loading';

export default () => {
    let [fontsLoaded] = useFonts({
        'montserrat-regular': require('./src/res/fonts/Montserrat-Regular.ttf'),
        'montserrat-semiBold': require('./src/res/fonts/Montserrat-SemiBold.ttf'),
    })
    console.log(fontsLoaded)
    if (!fontsLoaded) {
        return (<AppLoading/>)
    }
    const config = {
        dependencies: {
            'linear-gradient': LinearGradient,
        }
    };
    return (
        <NativeBaseProvider config={config}>
            <LRadioApp/>
            <StatusBar animated hidden/>
        </NativeBaseProvider>
    );
};
