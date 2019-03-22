import React from 'react'
import { Input,Form, Item, Label } from 'native-base'

import { withUser } from '../../Context/UserProvider'


/*export default withUser(({ name, setName }) => (
  
      <Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>
    
  ));
  */
class FLInput extends React.Component {

constructor(props) {
    super(props)

    //this._signOutAsync = this._signOutAsync.bind(this)
    }


 render() {
    return(
        <Form>
            <Item floatingLabel>
                <Label>Nom d'utilisateur</Label>

                <Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>
            </Item> 
        </Form>
            
    );
 }
}

export default withUser(FLInput)

//<Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>
//                <Input autoCorrect={false} onChange={e => {console.log(e.nativeEvent.text)}}/>