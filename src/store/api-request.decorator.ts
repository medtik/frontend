// method
export function apiRequest() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod: any = descriptor.value;
    descriptor.value = function(...args: any[]): any {
      const {commit, dispatch} = args[0];
      return dispatch('addWorker', null, {root: true}).then((current) => {
        return originalMethod.apply(this, args)
          .catch((error) => {
            console.error(error);
            commit('setError', error.message, {root: true});
          })
          .finally(() => dispatch('removeWorker', {current}, {root: true}));
      });
    };

    return descriptor;
  };
}
