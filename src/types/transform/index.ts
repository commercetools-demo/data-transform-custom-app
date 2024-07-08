export interface Transform {
    label?: string;
    value?: string;
    cb?: string | ((value: string) => string);
  }

  export interface CustomObject<T> {
    id: string;
    createdAt: string;
    key: string;
    value?: T;
  }