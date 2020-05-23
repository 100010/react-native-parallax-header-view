import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  Animated,
  ImageBackground,
} from 'react-native';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;

export default class ParallaxView extends Component {
  constructor(props) {
    super(props);
    const scrollY = new Animated.Value(0);
    this.state = {
      scrollY,
      onScroll: Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}]),
    };
  }

  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }

  renderBackground() {
    const {windowHeight, backgroundSource, backgroundStyle, miniBlur, maxBlur} = this.props;
    if (!windowHeight || !backgroundSource) {
      return null;
    }

    return (
      <Animated.Image
        style={[
          getAnimateViewStyle(this.state.scrollY, windowHeight).background,
          backgroundStyle,
        ]}
        blurRadius={getImageBlur(this.state.scrollY, miniBlur || 0,maxBlur || 0)}
        source={backgroundSource}
      />
    );
  }

  renderHeader() {
    const {windowHeight, backgroundSource, headerStyle} = this.props;
    if (!windowHeight || !backgroundSource) {
      return null;
    }
    return (
      <Animated.View
        style={[
          getAnimateViewStyle(this.state.scrollY, windowHeight).header,
          headerStyle,
        ]}>
        {this.props.header}
      </Animated.View>
    );
  }

  onScrollEndDrag(e) {
    if(this.props.onScrollEndDrag) {
      this.props.onScrollEndDrag(e);
    }
    this._scrollView.scrollTo({y: 0});
  }

  render() {
    const {style} = this.props;
    const onScroll = this.props.onScroll
      ? e => {
          this.props.onScroll(e);
          this.state.onScroll(e);
        }
      : this.state.onScroll;
    return (
      <View style={[styles.container, style]}>
        {this.renderBackground()}
        <ScrollView
          ref={component => {
            this._scrollView = component;
          }}
          {...this.props}
          style={styles.scrollView}
          onScroll={onScroll}
          onScrollEndDrag={(e) => {this.onScrollEndDrag(e)}}
          scrollEventThrottle={16}>
          {this.renderHeader()}
          <View style={[styles.content, this.props.scrollableViewStyle]}>
            {this.props.children}
          </View>
        </ScrollView>
      </View>
    );
  }
}

ParallaxView.propTypes = {
  ...ScrollViewPropTypes,
  windowHeight: PropTypes.number,
  backgroundStyle: PropTypes.object,
  refreshControl: PropTypes.object,
  backgroundSource: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    PropTypes.number,
  ]),
  header: PropTypes.node,
  contentInset: PropTypes.object,
};

ParallaxView.defaultProps = {
  windowHeight: 300,
  contentInset: {top: screen.scale},
};

const getAnimateViewStyle = (scrollY, windowHeight) => {
  return {
    header: {
      position: 'relative',
      height: windowHeight,
      opacity: scrollY.interpolate({
        inputRange: [-windowHeight, 0, windowHeight / 1.2],
        outputRange: [1, 1, 0],
      }),
    },
    background: {
      position: 'absolute',
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [-windowHeight, 0, windowHeight],
            outputRange: [windowHeight / 2, 0, -windowHeight / 3],
          }),
        },
        {
          scale: scrollY.interpolate({
            inputRange: [-windowHeight, 0, windowHeight],
            outputRange: [2, 1, 1],
          }),
        },
      ],
    },
  };
};

const getImageBlur = (scrollY, miniBlur, maxBlur) => {
  return scrollY.interpolate({
    inputRange: [-miniBlur, 0, maxBlur],
    outputRange: [miniBlur, 0, -maxBlur],
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'transparent',
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    backgroundColor: '#2e2f31',
    width: screen.width,
    resizeMode: 'cover',
  },
  content: {
    shadowColor: '#222',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
  },
});
