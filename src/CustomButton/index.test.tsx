import React from 'react';
import {Text} from 'react-native';
import {fireEvent, render} from '@testing-library/react-native';
import CustomButton from './index';

describe('CustomButton', () => {
  test('renders children correctly', () => {
    const {getByText} = render(
      <CustomButton onPress={() => {}}>
        <Text>Test Button</Text>
      </CustomButton>,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('handles onPress event', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <CustomButton onPress={onPressMock}>
        <Text>Test Button</Text>
      </CustomButton>,
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('displays a loader when loading', () => {
    const {getByTestId} = render(
      <CustomButton onPress={() => {}} loading>
        <Text>Test Button</Text>
      </CustomButton>,
    );
    expect(getByTestId('loader')).toBeTruthy();
  });

  test('is disabled when loading', () => {
    const onPressMock = jest.fn();
    const {queryByText, getByTestId} = render(
      <CustomButton loading onPress={onPressMock}>
        <Text>Test Button</Text>
      </CustomButton>,
    );

    // Check if the ActivityIndicator is present
    const activityIndicator = getByTestId('loader');
    expect(activityIndicator).toBeTruthy();

    // Check if the button text is not present
    const buttonText = queryByText('Test Button');
    expect(buttonText).toBeNull();

    // Since the button is in a loading state, the onPress should not be called
    if (buttonText) {
      fireEvent.press(buttonText);
    }
    expect(onPressMock).toHaveBeenCalledTimes(0);
  });

  test('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <CustomButton disabled onPress={onPressMock}>
        <Text>Test Button</Text>
      </CustomButton>,
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(0);
  });
});