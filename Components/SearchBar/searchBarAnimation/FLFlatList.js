//  Created by Artem Bogoslavskiy on 7/5/18.

import React from 'react';
import { ifIphoneX, isAndroid } from '../../../Utils';
import { FlatList, Animated, View, Text } from 'react-native'; 
import { SearchBarContext } from './SearchBarContext';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class FLFlatListHelper extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

 
    };
  }

  componentDidMount() {
    let { tabRoute, animation, addHandlerScroll } = this.props;

    addHandlerScroll(tabRoute, this.scrollToOffset);

    setTimeout(() => { // Fix bug initialScroll set
      this.scrollToOffset(animation.initialScroll, false)
    }, 250);
  }

  UNSAFE_componentWillReceiveProps(props) {
    //console.log("PROPS margin  : "+props.scrollTo);
    if (props.scrollTo !== 9999) {
      this.scrollToOffset(props.scrollTo);
    }
  }


  scrollToOffset = (offset, animated = true) => {
    this.flatList.getNode().scrollToOffset({offset, animated});
  };

  _onMomentumScrollBegin = () =>  this.props._canJumpToTab(false);  
  _onMomentumScrollEnd = () => this.props._canJumpToTab(true);
  _onScrollEndDrag = e => {
    let velocity = e.nativeEvent.velocity.y;
    if(velocity == 0 || (isAndroid() && Math.abs(Math.round(velocity)) <= 2)) {
      this.props.animation.handleIntermediateState(this.scrollToOffset);
    }
  };

  render() {
    let { scrollY, fullHeight } = this.props.animation;
    let { contentContainerStyle } = this.props;
    
    return (
  
      <AnimatedFlatList
        {...this.props}
        scrollEventThrottle={1}  
        onScrollEndDrag={this._onScrollEndDrag}
        onMomentumScrollBegin={this._onMomentumScrollBegin}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        contentContainerStyle={[
          {paddingTop: fullHeight + ifIphoneX(15, 0)}, 
          contentContainerStyle
        ]}
        ref={component => { 
          this.flatList = component; 
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
    );
  }
}

// HOC
const withSearchBarContext = Comp => props => (
  <SearchBarContext.Consumer>
    {(context) => 
      <Comp
        {...context}
        {...props} 
      />
    }
  </SearchBarContext.Consumer>
);

export default withSearchBarContext(FLFlatListHelper);
