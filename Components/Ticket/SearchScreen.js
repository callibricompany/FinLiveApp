import React from 'react';
import { StyleSheet, Dimensions, Animated, View, Platform, StatusBar , Text} from 'react-native'; 
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { SearchBarProvider } from '../SearchBar/searchBarAnimation';


import SearchBar from '../SearchBar/components/SearchBar';
import Tab from '../SearchBar/tabs/Tabs';

import SearchBarSuggestion from '../SearchBar/components/SearchBarSuggestion';
import SearchBarLocationSuggestion from '../SearchBar/components/SearchBarLocationSuggestion';
import { SafeAreaView } from 'react-navigation';

const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      currentTab: 'tab1',
      routes: [
        { key: 'tab1', title: 'Tab 1' },
        { key: 'tab2', title: 'Tab 2' }
      ],
    }; 
  }
  static navigationOptions = {
    header: null
}
  _handleIndexChange = index => {
    this.setState({
      currentTab: this.state.routes[index].key,
      index
    });
  }
  _getLabelText = ({ route }) => route.title;
  _renderHeader = (animation, canJumpToTab) => props => (
    <SearchBar 
      animation={animation}
      changeInputFocus={suggestionFocus => {
        console.log("suggestionFocus : " +suggestionFocus);
        this.setState({suggestionFocus});
       }
      }
      renderTabBar={() => (
        <TabBar
          onTabPress={({route}) => {
            if(route.key != this.state.currentTab && canJumpToTab) {
              animation.onTabPress(route);
            }
          }}
          getLabelText={this._getLabelText}
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          labelStyle={styles.label}
          {...props}
        />
      )}
      /*renderTabBar={() => (
        <View><Text>djfhdjfh</Text></View>
      )

      }*/
    />
  );

  _renderScene = SceneMap({
    tab1: Tab,
    tab2: Tab
  });

  _renderSuggestion(animation) {
    let focus = this.state.suggestionFocus;
    if(focus) {
      let styleAnimation = animation.getStyleSuggestion();
      let Suggestion = (focus == 'location') ? 
                        SearchBarLocationSuggestion :
                        SearchBarSuggestion;

      return (
        <Animated.View style={[initialLayout, styles.suggestionWrap, styleAnimation]}>
          {/*<Suggestion />*/}
          <View><Text>Main</Text></View>
        </Animated.View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView>
      <SearchBarProvider currentTab={this.state.currentTab}>
        {(animation, { canJumpToTab }) => 
          <View style={initialLayout}>
            {Platform.OS === 'android' && 
               <StatusBar
                translucent={false}
                backgroundColor="transparent"
              />
            }
            <TabView
              style={styles.container}
              navigationState={this.state}
              renderScene={this._renderScene}
              renderTabBar={this._renderHeader(animation, canJumpToTab)}
              onIndexChange={this._handleIndexChange}
              initialLayout={initialLayout}
              swipeEnabled={true} // TODO ...
              canJumpToTab={() => canJumpToTab}
              useNativeDriver
            />

            {this._renderSuggestion(animation)}
          </View>
        }
      </SearchBarProvider>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edeef0'
  },
  tabbar: {
    backgroundColor: '#fff',
    elevation: 0
  },
  indicator: {
    backgroundColor: '#45688e'
  },
  label: {
    color: '#45688e',
    margin: 0,
    marginTop: 6,
    marginBottom: 6,
    fontWeight: '200'
  },
  suggestionWrap: {
    position: 'absolute',
    backgroundColor: '#fff',  
    zIndex: 3
  }
});