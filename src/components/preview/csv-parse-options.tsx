import React from 'react';
import { Options } from 'csv-parse';
import { Formik, Form } from 'formik';
import Grid from '@commercetools-uikit/grid';
import ToggleInput from '@commercetools-uikit/toggle-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import FieldLabel from '@commercetools-uikit/field-label';

type Props = {
  options: Options;
  onOptionsChange: (options: Options) => void;
};

const CSVParseOptions = ({ options = {}, onOptionsChange }: Props) => {
  return (
    <Formik initialValues={options} onSubmit={onOptionsChange}>
      {({ values, handleChange }) => (
        <Form>
          <Grid gridTemplateColumns="3fr">
            <Grid.Item gridColumn="span 1">
              <FieldLabel htmlFor="columns" title="Has header"></FieldLabel>
              <ToggleInput
                name="columns"
                isChecked={!!values.columns}
                onChange={handleChange}
              />
            </Grid.Item>
          </Grid>
          <PrimaryButton type="submit" label="Apply"></PrimaryButton>
        </Form>
      )}
    </Formik>
  );
};

export default CSVParseOptions;
