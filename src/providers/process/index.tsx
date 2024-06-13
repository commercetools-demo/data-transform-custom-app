import React, { useContext, useEffect, useState } from 'react';
import { useProcess } from '../../hooks/use-process';
import { Process } from '../../types/process/types';
import { PagedQueryResponse } from '../../types';

interface AppStateContextReturn {
  processes?: PagedQueryResponse<Process>;
  refreshData?: () => void;
  isLoading?: boolean;
}

const initialData = {
  processes: {} as PagedQueryResponse<Process>,
  isLoading: false,
};

const AppStateContext = React.createContext<AppStateContextReturn>(initialData);

const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [processes, setProcesses] = useState<PagedQueryResponse<Process>>();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllProcesses } = useProcess();

  const getProcesses = async (limit?: number, page?: number) => {
    setIsLoading(true);
    const result = await fetchAllProcesses(limit, page);
    setProcesses(result);
    setIsLoading(false);
  };

  const refreshData = () => {
    getProcesses();
  };

  useEffect(() => {
    getProcesses();
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        processes,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export const useAppStateContext = () => useContext(AppStateContext);
