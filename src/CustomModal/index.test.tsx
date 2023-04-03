import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import CustomModal, {RefModalObject} from './index';
import {Text} from 'react-native';

describe('CustomModal', () => {
  it('renders the modal content when opened', async () => {
    const modalRef = React.createRef<RefModalObject>();
    const {getByText, queryByText} = render(
      <CustomModal ref={modalRef}>
        <Text>Modal Content</Text>
      </CustomModal>,
    );

    expect(queryByText('Modal Content')).toBeNull();

    await act(async () => {
      modalRef.current?.open();
    });

    await waitFor(() => getByText('Modal Content'));
  });

  it('hides the modal content when closed', async () => {
    const modalRef = React.createRef<RefModalObject>();
    const {getByText, queryByText, getByTestId} = render(
      <CustomModal ref={modalRef}>
        <Text>Modal Content</Text>
      </CustomModal>,
    );

    await act(async () => {
      modalRef.current?.open();
    });

    await waitFor(() => getByText('Modal Content'));

    await act(async () => {
      modalRef.current?.close();
    });

    await waitFor(() => expect(queryByText('Modal Content')).toBeNull());
    await waitFor(
      () => {
        const customModal = getByTestId('customModal');
        return customModal.props.visible === false;
      },
      {timeout: 1000},
    );
  });

  it('closes the modal when clicked outside', async () => {
    const modalRef = React.createRef<RefModalObject>();
    const {getByText, getByTestId} = render(
      <CustomModal ref={modalRef}>
        <Text>Modal Content</Text>
      </CustomModal>,
    );

    await act(async () => {
      modalRef.current?.open();
    });

    await waitFor(() => getByText('Modal Content'));

    const outsidePressable = getByTestId('outsidePressable');
    if (outsidePressable) {
      fireEvent.press(outsidePressable);
    } else {
      throw new Error('outsidePressable is null');
    }

    await waitFor(
      () => {
        const customModal = getByTestId('customModal');
        return customModal.props.visible === false;
      },
      {timeout: 1000},
    );
  });

  it('does not close the modal when clicked outside with closeOutside set to false', async () => {
    const modalRef = React.createRef<RefModalObject>();
    const {getByText, getByTestId} = render(
      <CustomModal ref={modalRef} closeOutside={false}>
        <Text>Modal Content</Text>
      </CustomModal>,
    );

    await act(async () => {
      modalRef.current?.open();
    });

    await waitFor(() => getByText('Modal Content'), {timeout: 2000});

    const outsidePressable = getByTestId('outsidePressable');
    if (outsidePressable) {
      fireEvent.press(outsidePressable);
    } else {
      throw new Error('outsidePressable is null');
    }

    await waitFor(
      () => {
        const customModal = getByTestId('customModal');
        return customModal.props.visible === true;
      },
      {timeout: 2000},
    );

    expect(getByTestId('customModal').props.visible).toBe(true);
  });
});
