import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactNative from 'react-native';
const {Dimensions, StyleSheet, View, ScrollView, Animated} = ReactNative;
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
    const {windowHeight, backgroundSource} = this.props;
    if (!windowHeight || !backgroundSource) {
      return null;
    }
    return (
      <Animated.Image
        style={getAnimateViewStyle(this.state.scrollY, windowHeight).background}
        source={backgroundSource}
      />
    );
  }

  renderHeader() {
    const {windowHeight, backgroundSource} = this.props;
    if (!windowHeight || !backgroundSource) {
      return null;
    }
    return (
      <Animated.View style={getAnimateViewStyle(this.state.scrollY, windowHeight).header}>
        {this.props.header}
      </Animated.View>
    );
  }

  render() {
    const {style} = this.props;
    const onScroll = this.props.onScroll
      ? (e) => {
          this.props.onScroll(e);
          this.state.onScroll(e);
        }
      : this.state.onScroll;
    return (
      <View style={[styles.container, style]}>
        {this.renderBackground()}
        <ScrollView
          ref={(component) => {
            this._scrollView = component;
          }}
          {...this.props}
          style={styles.scrollView}
          onScroll={onScroll}
          scrollEventThrottle={16}>
          {this.renderHeader()}
          <View style={[styles.content, this.props.scrollableViewStyle]}>{this.props.children}</View>
        </ScrollView>
      </View>
    );
  }
}

ParallaxView.propTypes = {
  ...ScrollViewPropTypes,
  windowHeight: PropTypes.number,
  backgroundSource: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    PropTypes.number,
  ]),
  header: PropTypes.node,
  blur: PropTypes.string,
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
      backgroundColor: '#2e2f31',
      width: screen.width,
      resizeMode: 'cover',
      height: windowHeight,
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
  blur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
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
