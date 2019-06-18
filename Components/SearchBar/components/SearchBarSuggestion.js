import React from 'react';
import { FlatList , View, Text} from 'react-native';


export default class SeachBarSuggestion extends React.Component {
  state = {
    suggestion: [
      {id: 1, title: 'suggestion'},
      {id: 2, title: 'suggestion'},
      {id: 3, title: 'suggestion'}
    ]
  }

  render() {
    return (
      <FlatList
        data={this.state.suggestion}
        renderItem={({item}) => (
          <View 
            key={item.id}
          >
          <Text>
              {item.title}
          </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  }
} 