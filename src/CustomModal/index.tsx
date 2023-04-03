import React, {
  useRef,
  useImperativeHandle,
  useCallback,
  ReactNode,
  useState,
} from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ViewStyle,
  useWindowDimensions,
  StyleProp,
  ColorValue,
} from 'react-native';

type CustomModalProps = {
  children?: ReactNode;
  closeOutside?: boolean;
  backgroundColor?: ColorValue;
  slideDirection?: 'up' | 'top' | 'left' | 'right' | 'down';
  customContentStyle?: StyleProp<ViewStyle>;
};
type directionsDurationTypes = {
  left: number;
  right: number;
  down: number;
  up: number;
  top: number;
};

interface SlideAnimationsTypes {
  left: Animated.WithAnimatedValue<ViewStyle>;
  right: Animated.WithAnimatedValue<ViewStyle>;
  up: Animated.WithAnimatedValue<ViewStyle>;
  down: Animated.WithAnimatedValue<ViewStyle>;
  top: Animated.WithAnimatedValue<ViewStyle>;
}

export type RefModalObject = {
  open: () => void;
  close: () => void;
};

/**
 * A customizable modal component for React Native.
 * @typedef {object} CustomModalProps
 * @property {ReactNode} [children] - The content to be rendered inside the modal.
 * @property {boolean} [closeOutside=true] - Whether the modal should close when the user clicks outside of it.
 * @property {ColorTypes} [backgroundColor='white'] - The background color of the modal.
 * @property {'up' | 'left'} [slideDirection='up'] - The direction from which the modal should slide in.
 * @property {StyleProp<ViewStyle>} [customContentStyle] - Custom styles to apply to the modal content.
 *
 * @typedef {object} RefModalObject
 * @property {() => void} open - A function that opens the modal.
 * @property {() => void} close - A function that closes the modal.
 *
 * @param {Ref<RefModalObject>} ref - The ref object that can be used to access the modal's open and close functions.
 * @param {CustomModalProps} props - The props that configure the behavior and appearance of the modal.
 * @returns {JSX.Element} - The modal component.
 */

const CustomModal = React.forwardRef<RefModalObject, CustomModalProps>(
  (
    {
      children,
      closeOutside = true,
      backgroundColor = 'white',
      slideDirection = 'up',
      customContentStyle,
    },
    ref,
  ) => {
    const {width, height} = useWindowDimensions();
    const [visible, setVisible] = useState<boolean>(false);
    const animation = useRef(new Animated.Value(0)).current;

    const handleAnimationAtOpenModal = useCallback(() => {
      Animated.timing(animation, {
        toValue: 1,
        duration: durationAnimationsAtOpen[slideDirection],
        useNativeDriver: true,
      }).start();
    }, [animation]);

    const handleAnimationAtCloseModal = useCallback(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: durationAnimationsAtClose[slideDirection],
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }, [animation, slideDirection]);

    const open = useCallback(() => {
      setVisible(true);
      handleAnimationAtOpenModal();
    }, [handleAnimationAtOpenModal]);

    const close = useCallback(() => {
      handleAnimationAtCloseModal();
    }, [handleAnimationAtCloseModal]);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const durationAnimationsAtOpen: directionsDurationTypes = {
      left: 300,
      right: 300,
      down: 500,
      up: 500,
      top: 500,
    };

    const durationAnimationsAtClose: directionsDurationTypes = {
      left: 200,
      right: 200,
      down: 360,
      up: 360,
      top: 360,
    };

    const slideUp: Animated.WithAnimatedValue<ViewStyle> = {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0.01, 1],
            outputRange: [height, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    const slideDown: Animated.WithAnimatedValue<ViewStyle> = {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0.01, 1],
            outputRange: [-height, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    const slideLeft: Animated.WithAnimatedValue<ViewStyle> = {
      transform: [
        {
          translateX: animation.interpolate({
            inputRange: [0.01, 1],
            outputRange: [width, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    const slideRight: Animated.WithAnimatedValue<ViewStyle> = {
      transform: [
        {
          translateX: animation.interpolate({
            inputRange: [0.01, 1],
            outputRange: [-width, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    const bodyContentStyles: StyleProp<ViewStyle> = {
      flex: 1,
      marginHorizontal: 20,
      marginVertical: 50,
      padding: 20,
      backgroundColor: backgroundColor,
      borderRadius: 20,
      maxHeight: height,
    };

    const slideAnimations: SlideAnimationsTypes = {
      left: slideLeft,
      right: slideRight,
      down: slideDown,
      up: slideUp,
      top: slideUp,
    };

    return (
      <Modal
        testID="customModal"
        animationType="fade"
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={visible}
        onRequestClose={close}
        style={[stylesCustomModal.contentModal]}>
        <TouchableOpacity
          activeOpacity={1}
          style={stylesCustomModal.outsidePressable}
          disabled={!closeOutside}
          onPressOut={close}
          testID="outsidePressable">
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                slideAnimations[slideDirection],
                bodyContentStyles,
                customContentStyle,
              ]}
              testID="animatedView">
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  },
);

const stylesCustomModal = StyleSheet.create({
  contentModal: {
    flex: 1,
  },
  outsidePressable: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
});

export default CustomModal;
