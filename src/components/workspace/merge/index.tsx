import React, { useEffect, useState } from 'react';
import { ProcessRawFile } from '../../../types/process/process-raw-file';
import DataTable from '@commercetools-uikit/data-table';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import { Process } from '../../../types/process/types';
import { getColumnsFromJson } from '../../../utils/jsonUtils';
import { ProcessTransformFileObject } from '../../../types/process/process-transform-file';
type Props = {
  onNextStep: () => void;
  sampleData?: ProcessTransformFileObject[];
};

const Merge = ({ onNextStep, sampleData }: Props) => {

  const columns = getColumnsFromJson(sampleData?.[0]?.value?.json, {});
  return (
    <Spacings.Stack scale="l">
      {sampleData?.map((sampleFile) => (
        <DataTable<NonNullable<any>>
          isCondensed
          columns={columns}
          key={sampleFile.key}
          rows={sampleFile.value?.json}
          itemRenderer={(item, column) => {
            switch (column.key) {
              default:
                return item[column.key];
            }
          }}
        />
      ))}
    </Spacings.Stack>
  );
};

export default Merge;
