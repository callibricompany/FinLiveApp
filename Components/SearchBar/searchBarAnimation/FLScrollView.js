//  Created by Artem Bogoslavskiy on 7/5/18.

import React from 'react';
import { ifIphoneX, isAndroid } from '../../../Utils';
import { ScrollView, Animated, View, Text } from 'react-native'; 
import { SearchBarContext } from './SearchBarContext';


const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

class FLScrollViewHelper extends React.PureComponent {
  componentDidMount() {
    let { tabRoute, animation, addHandlerScroll } = this.props;

    addHandlerScroll(tabRoute, this.scrollToOffset);

    setTimeout(() => { // Fix bug initialScroll set
      this.scrollToOffset(animation.initialScroll, false)
    }, 250);
  }

  scrollToOffset = (offset, animated = true) => {
    //this.scroll.getNode().scrollToOffset({offset, animated});
    //this.scroll.scrollToOffset({offset, animated});
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
  
      <AnimatedScrollView
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
          this.scroll = component; 
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

export default withSearchBarContext(FLScrollViewHelper);
