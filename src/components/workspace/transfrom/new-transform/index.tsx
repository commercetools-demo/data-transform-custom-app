import React, { useState } from 'react';
import { Drawer } from '@commercetools-frontend/application-components';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import TextField from '@commercetools-uikit/text-field';
import { Form, Formik } from 'formik';
import { useTransforms } from '../../../../hooks/use-transforms';
type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const NewTransform = ({ isModalOpen, closeModal }: Props) => {

    const {createTransform} = useTransforms();
    const [formState, setFormState] = useState({
        name: '',
        cb: '(value) => { return number(value); }',
      })
  const handleSubmit = async () => {
    await createTransform({
        label: formState.name,
        value: formState.name,
        cb: formState.cb
    });

    closeModal();
  };
  const handleValidate = (values: any) => {
    setFormState(values);
  };
  return (
    <Drawer
      title="Lorem ipsum"
      isOpen={isModalOpen}
      onClose={closeModal}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={closeModal}

    >
      <Formik
        initialValues={formState}
        validateOnChange={true}
        validate={handleValidate}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange, submitForm }) => (
          <Form onSubmit={submitForm}>
            <TextInput
              value={values.name}
              onChange={handleChange}
              name="name"
            />
            <textarea
              value={values.cb}
              onChange={handleChange}
              name="cb"
            />
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};

export default NewTransform;
