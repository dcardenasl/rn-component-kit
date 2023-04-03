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
} from 'react-native';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type ColorTypes = RGB | RGBA | HEX | string;

type CustomModalProps = {
  children?: ReactNode;
  closeOutside?: boolean;
  backgroundColor?: ColorTypes;
  slideDirection?: 'up' | 'left' | 'right' | 'down';
  customContentStyle?: ViewStyle;
};

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
 * @property {ViewStyle} [customContentStyle] - Custom styles to apply to the modal content.
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
    useImperativeHandle(ref, () => ({
      open,
      close,
    }));
    const {width, height} = useWindowDimensions();
    const [visible, setVisible] = useState<boolean>(false);
    const animation = useRef(new Animated.Value(0)).current;

    const open = () => {
      setVisible(true);
      handleAnimationAtOpenModal();
    };

    const close = () => {
      handleAnimationAtCloseModal();
    };

    const handleAnimationAtOpenModal = useCallback(() => {
      Animated.timing(animation, {
        toValue: 1,
        duration: durationAnimationsAtOpen[slideDirection],
        useNativeDriver: true,
      }).start();
    }, [animation]);

    const handleAnimationAtCloseModal = () => {
      Animated.timing(animation, {
        toValue: 0,
        duration: durationAnimationsAtClose[slideDirection],
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    };

    const durationAnimationsAtOpen = {
      left: 300,
      right: 300,
      down: 500,
      up: 500,
    };

    const durationAnimationsAtClose = {
      left: 200,
      right: 200,
      down: 360,
      up: 360,
    };

    const slideUp = {
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

    const slideDown = {
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

    const slideLeft = {
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

    const slideRight = {
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

    const bodyContentStyles = {
      flex: 1,
      marginHorizontal: 20,
      marginVertical: 50,
      padding: 20,
      backgroundColor: backgroundColor,
      borderRadius: 20,
      maxHeight: height,
    };

    const slideAnimations = {
      left: slideLeft,
      right: slideRight,
      down: slideDown,
      up: slideUp,
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
