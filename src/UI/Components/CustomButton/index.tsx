import React, {FC, ReactNode} from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {ColorTypes} from '../CustomModal';

// CustomButtonProps interface defines the prop types for the CustomButton component
interface CustomButtonProps {
  children: ReactNode; // ReactNode to render inside the button
  onPress?: () => void; // Function to execute when the button is pressed
  disabled?: boolean; // Optional boolean to disable the button
  style?: ViewStyle | TextStyle; // Optional custom styles for the button container
  loading?: boolean; // Optional boolean to show the loading state of the button
  backgroundColor?: ColorTypes;
}

const CustomButton: FC<CustomButtonProps> = ({
  children,
  style,
  disabled,
  loading,
  backgroundColor,
  onPress = () => {},
}) => {
  // Define the button style based on the provided props
  const btnStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: disabled ? 'grey' : backgroundColor,
  };

  // Loader component to show when the button is in loading state
  const Loader = () => (
    <ActivityIndicator
      testID="loader"
      animating={loading}
      size="large"
      color={'white'}
    />
  );

  return (
    // TouchableOpacity component to handle button interactions
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
