import React, { Component } from 'react';
import { Text } from 'react-native';
import firebase from 'firebase';
import { Button, Card, CardSection, Input, Spinner } from './common';


class LoginForm extends Component {
    state = { email: '', password: '', error: '', loading: false };
    
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
        <Button onPress={this.onButtonPress.bind(this)}>
            C'est parti !!
        </Button>
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

export default LoginForm;
