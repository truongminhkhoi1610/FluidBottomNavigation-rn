/*global require*/

import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Image,
  View
} from "react-native";
import PropTypes from "prop-types";
// import ViewOverflow from "react-native-view-overflow";

// const AnimatedViewOverflow = Animated.createAnimatedComponent(ViewOverflow);
const AnimatedView = Animated.createAnimatedComponent(View);

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.animatedItemValues = [];
    this.animatedBubbleValues = [];
    this.animatedMiniBubbleValues = [];
    this.animatedImageValues = [];
    this.props.navigation.state.routes.forEach((item, index) => {
      this.animatedItemValues[index] = new Animated.Value(0);
      this.animatedBubbleValues[index] = new Animated.Value(0);
      this.animatedImageValues[index] = new Animated.Value(0);
      this.animatedMiniBubbleValues[index] = new Animated.Value(0);
    });
  }

  static defaultProps = {
    tintColor: "rgb(76, 83, 221)"
  };

  state = {
    lastSelectedIndex: this.props.navigation.state.index,
  };

  _renderButtons = () => {
    const {
      renderIcon,
      getLabelText,
      activeTintColor,
      inactiveTintColor,
      onTabPress,
      onTabLongPress,
      getAccessibilityLabel,
      navigation
    } = this.props;

    // alert(JSON.stringify(Object.keys(this.props)));

    const { routes, index: activeRouteIndex } = navigation.state;

    return routes.map((route, index) => {
      const animatedItemStyle = {
        transform: [{ translateY: this.animatedItemValues[index] }]
      };

      const animatedBubbleScaleValues = this.animatedBubbleValues[
        index
      ].interpolate({
        inputRange: [0, 0.25, 0.4, 0.525, 0.8, 1],
        outputRange: [0.01, 3, 1.65, 1.65, 3.2, 3]
      });

      const animatedColorValues = this.animatedImageValues[index].interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.tintColor, "rgb(255, 255, 255)"]
      });

      const animatedBubbleStyle = {
        transform: [{ scale: animatedBubbleScaleValues }]
      };

      const animatedImageStyle = {
        tintColor: animatedColorValues
      };

      const animatedMiniBubbleTranslateValues = this.animatedMiniBubbleValues[
        index
      ].interpolate({
        inputRange: [0, 1],
        outputRange: [13, 0]
      });

      const animatedMiniBubbleHeightValues = this.animatedMiniBubbleValues[
        index
      ].interpolate({
        inputRange: [0, 0.01, 1],
        outputRange: [0, 1, 1]
      });

      const animatedMiniBubbleStyle = {
        opacity: animatedMiniBubbleHeightValues,
        transform: [{ translateY: animatedMiniBubbleTranslateValues }]
      };

      const animatedTitleValues = this.animatedBubbleValues[index].interpolate({
        inputRange: [0, 1],
        outputRange: [60, 60]
      });

      const animatedTitleStyle = {
        transform: [{ translateY: animatedTitleValues }]
      };

      const isRouteActive = index === activeRouteIndex;

      this.endAnimation(this.state.lastSelectedIndex);

      this.startAnimation(activeRouteIndex);

      this.state.lastSelectedIndex = activeRouteIndex;

      return (
        
        <TouchableWithoutFeedback
          key={index}
          onPress={() => {
            if (index === this.state.lastSelectedIndex) {
              onTabPress({ route });
              return;
            }

            // alert('tabPressed');
            
            onTabPress({ route });

            this.startAnimation(index);

            if (this.state.lastSelectedIndex !== null) {
              this.endAnimation(this.state.lastSelectedIndex);
            }

            this.setState({
              lastSelectedIndex: index
            });
            
            if(this.props.onPress) {
              this.props.onPress(index);
            }
          }}
        >
          <View>
          <AnimatedView style={[styles.mask, animatedItemStyle]}>
            <Image
              style={styles.itemMask}
              source={require("./assets/mask.png")}
            />
          </AnimatedView>
          <View style={styles.barMask}></View>
          <AnimatedView style={[styles.item, animatedItemStyle]}>
            <Animated.View
              style={[
                styles.bubble,
                { backgroundColor: this.props.tintColor },
                animatedBubbleStyle
              ]}
            />
            <Animated.View
              style={[
                styles.miniBubble,
                { backgroundColor: this.props.tintColor },
                animatedMiniBubbleStyle
              ]}
            />
            {renderIcon({ route, focused: isRouteActive, tintColor: "white" })}
            <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
              <Animated.Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                style={{
                  color: this.props.tintColor,
                  fontSize: 10
                }}
              >
                {getLabelText({ route })}
              </Animated.Text>
            </Animated.View>
          </AnimatedView>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  };

  startAnimation = index => {
    Animated.parallel([
      Animated.timing(this.animatedItemValues[index], {
        toValue: -30,
        duration: 250,
        delay: 20,
        easing: Easing.in(Easing.elastic(1.5)),
        useNativeDriver: true
      }),
      Animated.timing(this.animatedMiniBubbleValues[index], {
        toValue: 1,
        duration: 500,
        delay: 20,
        useNativeDriver: true
      }),
      Animated.timing(this.animatedBubbleValues[index], {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.out(Easing.ease)),
        useNativeDriver: true
      }),
      Animated.timing(this.animatedImageValues[index], {
        toValue: 1,
        duration: 400
      })
    ]).start();
  };

  endAnimation = index => {
    Animated.parallel([
      Animated.timing(this.animatedItemValues[index], {
        toValue: 0,
        duration: 400,
        delay: 175,
        useNativeDriver: true
      }),
      Animated.timing(this.animatedMiniBubbleValues[index], {
        toValue: 0,
        duration: 1,
        useNativeDriver: true
      }),
      Animated.timing(this.animatedBubbleValues[index], {
        toValue: 0,
        duration: 375,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(this.animatedImageValues[index], {
        toValue: 0,
        duration: 400,
        delay: 0
      })
    ]).start();
  };

  render() {
    return (
      <AnimatedView style={styles.container}>
        {this._renderButtons()}
      </AnimatedView>
    );
  }
}

TabBar.propTypes = {
  onPress: PropTypes.func,
  tintColor: PropTypes.string
};

const styles = {
  container: {
    flexDirection: "row",
    height: 60,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",

    
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#555',
    borderBottomWidth: 0,
  },
  barMask: {
    position: 'absolute',
    height: 60,
    width: 1000,
    marginLeft: -18,
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: '#0000',
    borderRadius: 30,
    height: 60,
    width: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  mask: {
    marginLeft: -22,
    marginTop: -1.3,
    position: 'absolute',
  },
  itemMask: {
    position: "absolute",
  },
  bubble: {
    position: "absolute",
    alignSelf: "center",
    height: 17,
    width: 17,
    backgroundColor: "#4C53DD",
    borderRadius: 8.5
  },
  miniBubble: {
    position: "absolute",
    alignSelf: "center",
    width: 22,
    height: 22,
    backgroundColor: "#4C53DD",
    borderRadius: 11
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
};

export default TabBar;
