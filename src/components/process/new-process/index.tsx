import Grid from '@commercetools-uikit/grid';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import { ProcessDraft } from '../../../types/process/types';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import Text from '@commercetools-uikit/text';
import SelectInput from '@commercetools-uikit/select-input';
import { PROCESS_TYPES_OPTIONS } from '../../../types/process/process';

type Props = {
  onSubmit: (process: ProcessDraft) => Promise<void>;
  onCancel: () => void;
  process?: ProcessDraft;
};

const NewProcessForm = ({
  onSubmit,
  onCancel,
  process = {} as ProcessDraft,
}: Props) => {
  const handleValidation = (values: ProcessDraft) => {
    const errors: Record<keyof ProcessDraft, string> = {} as never;
    if (!values.name) {
      errors['name'] = 'Required';
    }
    if (!values.processType) {
      errors['processType'] = 'Required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={process}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, handleChange, submitForm }) => (
        <Form>
          <div style={{ paddingBottom: '16px' }}>
            <Spacings.Inline
              alignItems="center"
              justifyContent="flex-end"
              scale="m"
            >
              <SecondaryButton
                label="Cancel"
                onClick={onCancel}
                type="button"
              />
              <PrimaryButton label="Save" onClick={submitForm} type="button" />
            </Spacings.Inline>
          </div>
          <Grid
            gridGap="16px"
            gridTemplateColumns="repeat(2, 1fr)"
            gridAutoColumns="1fr"
          >
            <Grid.Item gridColumn="span 2">
              <Spacings.Inline alignItems="center">
                <FieldLabel title="Name" />
                <TextInput
                  value={values?.name}
                  name="name"
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {errors.name && (
                <Text.Caption tone="warning">{errors.name}</Text.Caption>
              )}
            </Grid.Item>
            <Grid.Item gridColumn="span 2">
              <Spacings.Inline alignItems="center">
                <FieldLabel title="Description" />
                <TextInput
                  value={values?.description}
                  name="description"
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {errors.description && (
                <Text.Caption tone="warning">{errors.description}</Text.Caption>
              )}
            </Grid.Item>
            <Grid.Item gridColumn="span 2">
              <Spacings.Inline alignItems="center">
                <FieldLabel title="Type" />
                <SelectInput
                  value={values?.processType}
                  name="processType"
                  options={PROCESS_TYPES_OPTIONS}
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {errors.processType && (
                <Text.Caption tone="warning">{errors.processType}</Text.Caption>
              )}
            </Grid.Item>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
export default NewProcessForm;
