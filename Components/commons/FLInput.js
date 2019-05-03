import React from 'react'
import { Input,Form, Item, Label } from 'native-base'

import { withUserTest } from '../../Session/UserProvider'


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

export default withUserTest(FLInput)

//<Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>
//                <Input autoCorrect={false} onChange={e => {console.log(e.nativeEvent.text)}}/>