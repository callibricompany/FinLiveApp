import React, { Component } from 'react';
import { Text } from 'react-native';
import firebase from 'firebase';
import { FLButton, Card, CardSection, Input, Spinner } from '../commons';


class LoginScreen extends Component {
    state = { email: '', password: '', error: '', loading: false, loggedIn: false };
    
    componentWillMount() {
        firebase.initializeApp({
          apiKey: 'AIzaSyDY7vk5tEGQ3ZeI8iaEn2iAaD6DAhOHyb0',
          authDomain: 'auth-8722c.firebaseapp.com',
          databaseURL: 'https://auth-8722c.firebaseio.com',
          projectId: 'auth-8722c',
          storageBucket: 'auth-8722c.appspot.com',
          messagingSenderId: '452038208493'
        });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.setState({ loggedIn: true });
            } else {
              this.setState({ loggedIn: false });
            }
          });
    }

    onButtonPress() {
        const { email, password } = this.state;
        this.setState({ error: '', loading: true });
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(this.onLoginSuccess.bind(this))
            .catch(() => {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(this.onLoginSuccess.bind(this))
                    .catch(this.onLoginFail.bind(this));
            });
    }

    onLoginFail() {
        this.setState({ error: 'erreur mon pote !!!', loading: false });
      }
    
      onLoginSuccess() {
        this.setState({
          email: '',
          password: '',
          loading: false,
          error: ''
        });
      }

    renderButton() {
        if (this.state.loading) {
            return <Spinner />;
        }
        return (
        <FLButton onPress={this.onButtonPress.bind(this)}>
            C'est parti !!
        </FLButton>
        );
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Input 
                        placeholder="user@email.com"
                        value={this.state.email}
                        onChangeTextToto={email => this.setState({ email })}
                        label="Email"
                    />
                </CardSection>
                <CardSection>
                    <Input
                        secureTextEntry
                        placeholder="**********" 
                        value={this.state.password}
                        onChangeTextToto={password => this.setState({ password })}
                        label="Mot de passe"
                    />
                </CardSection>
                <Text style={styles.errorTextStyle}>{this.state.error}</Text>
                <CardSection>
                    {this.renderButton()}
                </CardSection>
            </Card>
        );
    }
}
const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
};

export default LoginScreen;
