import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { useHistory } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';
import DataTable from '@commercetools-uikit/data-table';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import { Switch, useRouteMatch } from 'react-router';
import { useAppStateContext } from '../../../providers/process';
import { Process } from '../../../types/process/types';
import ProcessSetup from '../setup';
import { PROCESS_STATUSES } from '../../../types/process/process';

type Props = {};

const columns = [
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
  { key: 'type', label: 'Type' },
];

const ProcessList = (props: Props) => {
  const { processes, isLoading } = useAppStateContext();
  const { push } = useHistory();
  const match = useRouteMatch();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const handleRowClick = (row: NonNullable<Process>) => {
    if (row.value?.processStatus === PROCESS_STATUSES.RAW_FILES) {
      push(`${match.url}/process/${row.key}/workspace`);
    } else {
      push(`${match.url}/process/${row.key}/setup`);
    }
  };

  return (
    <Constraints.Horizontal max={'scale'}>
      <Spacings.Stack scale="xl">
        {isLoading && <LoadingSpinner />}

        {!isLoading && processes ? (
          <Spacings.Stack scale="l">
            <DataTable<NonNullable<Process>>
              isCondensed
              columns={columns}
              rows={processes.results}
              itemRenderer={(item, column) => {
                switch (column.key) {
                  case 'key':
                    return item.key;
                  case 'name':
                    return item.value?.name;
                  case 'description':
                    return item.value?.description;
                  case 'status':
                    return item.value?.processStatus;
                  case 'type':
                    return item.value?.processType;
                  default:
                    return null;
                }
              }}
              sortedBy={tableSorting.value.key}
              sortDirection={tableSorting.value.order}
              onSortChange={tableSorting.onChange}
              onRowClick={handleRowClick}
            />
            <Pagination
              page={page.value}
              onPageChange={page.onChange}
              perPage={perPage.value}
              onPerPageChange={perPage.onChange}
              totalItems={processes.total ?? 0}
            />
          </Spacings.Stack>
        ) : null}
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};

export default ProcessList;
