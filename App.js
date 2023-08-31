import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {NativeBaseProvider, Text, Box} from "native-base";
import {LinearGradient} from 'expo-linear-gradient';
import {useFonts} from 'expo-font'

import VaniaRadioApp from './src/vania-radio-app.jsx';

export default () => {
    useFonts({
        'montserrat-regular': require('./src/res/fonts/Montserrat-Regular.ttf'),
        'montserrat-semiBold': require('./src/res/fonts/Montserrat-SemiBold.ttf'),
    })
    const config = {
        dependencies: {
            'linear-gradient': LinearGradient,
        }
    };
    return (
        <NativeBaseProvider config={config}>
            <VaniaRadioApp/>
            <StatusBar animated hidden/>
        </NativeBaseProvider>
    );
};
