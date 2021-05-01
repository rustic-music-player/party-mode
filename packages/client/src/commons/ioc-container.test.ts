import { defaultContainer, Provide, Singleton } from './ioc-container';

describe('Ioc Container', function () {
  test('Provide annotation should bind to the default container', () => {
    const instance = defaultContainer.get(TestClass);

    expect(instance).toBeInstanceOf(TestClass);
  });

  test('container should return new instance for each request', () => {
    const instance1 = defaultContainer.get(TestClass);
    const instance2 = defaultContainer.get(TestClass);

    expect(instance1).not.toBe(instance2);
  });

  test('Singleton annotation should bind to the default container in singleton scope', () => {
    const instance1 = defaultContainer.get(TestSingleton);
    const instance2 = defaultContainer.get(TestSingleton);

    expect(instance1).toBe(instance2);
  });
});

@Provide()
class TestClass {}

@Singleton()
class TestSingleton {}
