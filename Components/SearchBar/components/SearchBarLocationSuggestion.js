import React from 'react';
import { FlatList, View, Text} from 'react-native';


export default class SeachBarLocationSuggestion extends React.Component {
  state = {
    suggestion: [
      {id: 1, title: 'suggestion location'},
      {id: 2, title: 'suggestion location'},
      {id: 3, title: 'suggestion location'}
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