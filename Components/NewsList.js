import React from 'react'
import { View, Button, Text } from 'react-native'
import { FLButton } from './commons';
  
import { globalStyle } from '../Styles/globalStyle'
import NewsDetail2 from './NewsDetail2';



class NewsList extends React.Component {
    static navigationOptions = {
      title: 'Actualités'
    }

    constructor(props) {
      super(props)

      //this._signOutAsync = this._signOutAsync.bind(this)
    }

    _NavToNewDetail = () => {
      console.log(this.props);
      this.props.navigation.navigate('NewsDetail');
    };

    onButtonPress(idNew, textNew) {
 /*     const { email, password } = this.state;
      this.setState({ error: '', loading: true });
      firebase.auth().signInWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch(() => {
              firebase.auth().createUserWithEmailAndPassword(email, password)
                  .then(this.onLoginSuccess.bind(this))
                  .catch(this.onLoginFail.bind(this));
          });*/
          console.log("APPUI BOUTON" + idNew + textNew)
          this.props.navigation.navigate('NewsDetail', {
            id: idNew,
            text: textNew,
          });
 //         this.props.navigation.navigate('NewDetail');
  }

  
    render() {
      news1 = 'Une appli revolutionnaire va bouleverser la finance'
      news2 = 'Macron et les gilets jaunes'
      news3 = 'Dette des pays du sud'
      return(
        <View style={globalStyle.container}>
          <Text style={globalStyle.defaultText}>Toutes les actualités</Text>
          <FLButton onPress={this.onButtonPress.bind(this, 1, news1)}>{news1}</FLButton>
          <FLButton onPress={this.onButtonPress.bind(this, 2, news2)}>{news2}</FLButton>
          <FLButton onPress={this.onButtonPress.bind(this, 3, news3)}>{news3}</FLButton>
          <Button title="Test" onPress={this._NavToNewDetail} />
          <NewsDetail2 text={news1}/>
        </View>
      );
      }
}

export default NewsList