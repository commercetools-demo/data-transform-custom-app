import { useEffect, useState } from 'react';
import { useTransforms } from '../../../../hooks/use-transforms';
import { Transform } from '../../../../types/transform';

const PREDEFINED_TRANSFORMS = [
  {
    label: 'None',
    value: 'none',
    cb: (value: string) => value,
  },
  {
    label: 'Upper Case',
    value: 'upperCase',
    cb: (value: string) => value.toUpperCase(),
  },
  {
    label: 'Lower Case',
    value: 'lowerCase',
    cb: (value: string) => value.toLowerCase(),
  },
];

export const useTransformsList = () => {
  const { fetchAllTransforms } = useTransforms();
  const [transforms, setTransforms] = useState<
    Transform[]
  >([]);
  const [isReady, setIsReady] = useState(false);
  const getTransformsList = async () => {
    const result = await fetchAllTransforms();
    const savedTransforms = result.results.map((t) => ({
      label: t.value?.label,
      value: t.value?.value,
      cb: t.value?.cb,
    }));
    setTransforms([...PREDEFINED_TRANSFORMS, ...savedTransforms]);
    setIsReady(true);
  };

  const refresh = () => {
    getTransformsList();
  };

  const transform = (transform: string, value: string) => {
    const transition = transforms.find((t) => t.value === transform);
    const response =  typeof transition?.cb === 'function' ? transition?.cb(value) : typeof transition?.cb === 'string' && eval(transition.cb)(value);
    
    return Array.isArray(response) ? response.join(', ') : response
  };

  useEffect(() => {
    getTransformsList()
  }, []);

  return { transforms, isReady, transform, refresh };
};
