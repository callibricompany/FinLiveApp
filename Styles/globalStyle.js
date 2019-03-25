
import { StyleSheet} from 'react-native'

const globalStyle = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    defaultText: {
      fontSize: 20,
      paddingBottom: 10
    },
    loading_container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 100,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

export { globalStyle }