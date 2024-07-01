import React from 'react';
import { Options } from 'csv-parse';
import { Formik, Form } from 'formik';
import Grid from '@commercetools-uikit/grid';
import ToggleInput from '@commercetools-uikit/toggle-input';
import NumberInput from '@commercetools-uikit/number-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import FieldLabel from '@commercetools-uikit/field-label';

type Props = {
  options: Options;
  type: string;
  onOptionsChange: (options: Options) => void;
};

const ParseOptions = ({ options = {}, onOptionsChange, type }: Props) => {
  return (
    <Formik initialValues={options} onSubmit={onOptionsChange}>
      {({ values, handleChange }) => (
        <Form>
          <Grid gridTemplateColumns="repeat(4, 1fr)">
            {type === 'text/csv' && (
              <Grid.Item gridColumn="span 1">
                <FieldLabel htmlFor="columns" title="Has header"></FieldLabel>
                <ToggleInput
                  name="columns"
                  isChecked={!!values.columns}
                  onChange={handleChange}
                />
              </Grid.Item>
            )}
            <Grid.Item gridColumn="span 1">
              <FieldLabel
                htmlFor="columns"
                title="Preview count rows"
              ></FieldLabel>
              <NumberInput
                name="to_line"
                value={values.to_line!}
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

export default ParseOptions;
