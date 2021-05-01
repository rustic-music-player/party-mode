import { useMemo } from 'react';
import { defaultContainer } from './ioc-container';

export function useService<T>(type: Function & { prototype: T }): T {
  return useMemo(() => defaultContainer.get<T>(type), [type]);
}
