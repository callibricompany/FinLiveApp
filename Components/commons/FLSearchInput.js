import React from 'react'
import { Button, Input, Icon, Item, Text } from 'native-base'

import { withUser } from '../../Context/UserProvider'



/*export default withUser(({ name, setName }) => (
  
      <Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>
    
  ));
  */



/*class toto extends React.Component {
    render() {

        return(
            <Button>
                <Icon name="close" />
            </Button>
        );
    }
}*/


class FLSearchInput extends React.Component {

constructor(props) {
    super(props)
    this.currentText="" 
    /*this.state = { 
        currentText: "Filtre tickets..." 
    };*/
    
    //this._signOutAsync = this._signOutAsync.bind(this)
    }
    eraseSearchedText = () => {
        this.typingSearchedText("");
    }


    typingSearchedText = (text) =>{
        this.currentText = text;
        this.props.setSearchInputText(text);
    }

    renderButton = () => {
        return(
           
                <Icon name="close-circle" onPress={() =>this.eraseSearchedText()} />
            
        );
    }

    render() {

        let myFLFilterInput;
    
        //myFLFilterInput = <Text/>;
        if (this.props.searchInputText === '') {
        myFLFilterInput = <Text />
        } else {
        myFLFilterInput = this.renderButton() ;
        }
        
        return(
                <Item searchBar rounded style={{ backgroundColor:'#fff',height:35}}>                         
                <Icon name="ios-search" />                        
                <Input 
                    //placeholder={this.props.searchInputText === "" ? "Filtre tickets..." :  this.props.searchInputText }
                    placeholder="Filtre tickets ..."
                    onChange={e => {this.typingSearchedText(e.nativeEvent.text)}}
                    value={this.currentText}
                />  
                {myFLFilterInput}               
            </Item>       
        );
    }
}


export default withUser(FLSearchInput)

//<Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>