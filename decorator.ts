export function autobind() {
  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    return {
      get: function () {
        const bound = descriptor.value.bind(this);
        Object.defineProperty(this, propertyKey, {value: bound});
        return bound;
      }
    };
  };
}

/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export function Enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    descriptor.enumerable = value;
    descriptor.configurable = true;
    Object.defineProperty(target, propertyKey, descriptor);
  };
}
