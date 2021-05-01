import { Container, injectable } from 'inversify';

export const defaultContainer = new Container();

export function Provide() {
  return (target) => {
    defaultContainer.bind(target).toSelf();
    return injectable()(target);
  };
}

export function Singleton() {
  return (target) => {
    defaultContainer.bind(target).toSelf().inSingletonScope();
    return injectable()(target);
  };
}
