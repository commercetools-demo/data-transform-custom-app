import React from 'react';
import { Options } from 'csv-parse';
import { Formik, Form } from 'formik';
import Grid from '@commercetools-uikit/grid';
import NumberInput from '@commercetools-uikit/number-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import FieldLabel from '@commercetools-uikit/field-label';
import Spacings from '@commercetools-uikit/spacings';
import styled from 'styled-components';

export interface WorkspaceOptions {
  from?: number;
  to?: number;
}

type Props = {
  options: WorkspaceOptions;
  onOptionsChange: (options: WorkspaceOptions) => void;
};

const StyledDiv = styled.div`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
`;

const WorkspaceOptionsView = ({ options, onOptionsChange }: Props) => {
  return (
    <StyledDiv>
      <Formik initialValues={options} onSubmit={onOptionsChange}>
        {({ values, handleChange }) => (
          <Form>
            <Spacings.Stack scale="s">
              <Grid gridTemplateColumns="repeat(4, 1fr)" gridGap="0.5rem">
                <Grid.Item gridColumn="span 1">
                  <FieldLabel htmlFor="from" title="From record"></FieldLabel>
                  <NumberInput
                    name="from"
                    value={values.from!}
                    onChange={handleChange}
                  />
                </Grid.Item>
                <Grid.Item gridColumn="span 1">
                  <FieldLabel htmlFor="to" title="To record"></FieldLabel>
                  <NumberInput
                    name="to"
                    value={values.to}
                    onChange={handleChange}
                  />
                </Grid.Item>
              </Grid>
              <Spacings.Inline scale="s">
                <PrimaryButton type="submit" label="Apply"></PrimaryButton>
              </Spacings.Inline>
            </Spacings.Stack>
          </Form>
        )}
      </Formik>
    </StyledDiv>
  );
};

export default WorkspaceOptionsView;
