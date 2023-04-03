import React, {FC, ReactNode} from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ColorValue,
} from 'react-native';

interface CustomButtonProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | TextStyle;
  loading?: boolean;
  backgroundColor?: ColorValue;
}

/**
 * Props for the CustomButton component.
 *
 * @typedef {object} CustomButtonProps
 * @property {ReactNode} children - The content to render inside the button.
 * @property {() => void} [onPress] - Function to execute when the button is pressed.
 * @property {boolean} [disabled] - Whether the button should be disabled.
 * @property {ViewStyle | TextStyle} [style] - Optional custom styles for the button container.
 * @property {boolean} [loading] - Whether the button is in a loading state.
 * @property {ColorTypes} [backgroundColor] - Optional color for the button background.
 */

const CustomButton: FC<CustomButtonProps> = ({
  children,
  style,
  disabled,
  loading,
  backgroundColor,
  onPress = () => {},
}) => {
  const btnStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: disabled ? 'grey' : backgroundColor,
  };

  const Loader = () => (
    <ActivityIndicator
      testID="loader"
      animating={loading}
      size="large"
      color={'white'}
    />
  );

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled || loading}
      style={[btnStyle, style]}
      onPress={onPress}>
      {loading ? <Loader /> : children}
    </TouchableOpacity>
  );
};

export default CustomButton;
