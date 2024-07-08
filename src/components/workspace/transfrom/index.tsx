import React, { useEffect, useState } from 'react';
import DataTable from '@commercetools-uikit/data-table';
import Spacings from '@commercetools-uikit/spacings';
import { getColumnsFromJson } from '../../../utils/jsonUtils';
import { ProcessTransformFileObject } from '../../../types/process/process-transform-file';
import CreatableSelectInput from '@commercetools-uikit/creatable-select-input';
import { FieldArray, Form, Formik } from 'formik';
import { useTransformsList } from './hooks/use-transforms-list';
import { useModalState } from '@commercetools-frontend/application-components';
import NewTransform from './new-transform';
type Props = {
  onNextStep: () => void;
  sampleData?: ProcessTransformFileObject[];
};

type TransFormDataTableRow = {
  id: string;
  key: string;
  value: string;
  transform: {
    label: string;
    value: string;
    cb: (value: string) => string;
  };
  newField: string;
  index: number;
};

const columns = [
  { key: 'key', label: 'Key' },
  { key: 'value', label: 'Value' },
  { key: 'transform', label: 'Transform' },
  { key: 'newValue', label: 'New Value' },
  { key: 'newField', label: 'New field' },
];

const Transform = ({ onNextStep, sampleData }: Props) => {
  const [tFiles, setTFiles] = useState<
    {
      name?: string;
      rows: TransFormDataTableRow[];
    }[]
  >([]);
  const { transforms, refresh, transform, isReady } = useTransformsList();
  const { openModal, closeModal, isModalOpen } = useModalState();
  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleValidation = (values) => {
    console.log('validation', values);
  };

  useEffect(() => {
    if (!sampleData || sampleData.length === 0) {
      return;
    }

    const tempRows = sampleData.map((rawFile) => {
      const jsonColumns = getColumnsFromJson(rawFile.value?.json, {});
      return {
        name: rawFile.value?.name,
        rows: jsonColumns.map((column, index) => {
          return {
            index,
            id: column.key,
            key: column.key,
            value: rawFile.value?.json[0][column.key],
            transform: {
              value: undefined,
              cb: undefined,
            },
            newField: '',
          };
        }),
      };
    });

    setTFiles(tempRows);
  }, [sampleData]);
  return (
    <Spacings.Stack scale="l">
      {tFiles?.map((tfile) => (
        <Formik
          key={tfile.name}
          initialValues={tfile}
          onSubmit={handleSubmit}
          validateOnBlur
          validate={handleValidation}
        >
          {({ values, errors, handleChange, submitForm }) => (
            <Form>
              <FieldArray name="rows">
                {(arrayHelpers) => (
                  <DataTable<NonNullable<TransFormDataTableRow>>
                    isCondensed
                    columns={columns}
                    rows={values.rows}
                    itemRenderer={(item, column) => {
                      switch (column.key) {
                        case 'key':
                          return item.key;
                        case 'value':
                          return item.value;
                        case 'transform':
                          return (
                            <>
                              {isReady && (
                                <CreatableSelectInput
                                  name={`rows.${item.index}.transform`}
                                  value={item.transform}
                                  menuPortalTarget={document.body}
                                  options={transforms}
                                  onChange={handleChange}
                                  onCreateOption={openModal}
                                />
                              )}
                            </>
                          );
                        case 'newValue':
                          return item.transform
                            ? transform(item.transform.value, item.value)
                            : '';
                        case 'newField':
                          return item.newField;
                        default:
                          return null;
                      }
                    }}
                  />
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      ))}
      <NewTransform
        isModalOpen={isModalOpen}
        closeModal={() => {
          closeModal();
          refresh();
        }}
      />
    </Spacings.Stack>
  );
};

export default Transform;
