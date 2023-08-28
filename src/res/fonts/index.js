import * as Font from 'expo-font';
const fonts = async ()=> {
    await Font.loadAsync({
        'montserrat-regular': require('./Montserrat-Regular.ttf'),
        'montserrat-semiBold': require('./Montserrat-SemiBold.ttf'),
    });
}
export default fonts;