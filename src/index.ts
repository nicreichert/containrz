import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Class } from 'utility-types';

const containersMap = new Map<Class<Container<any>>, Container<any>>();
const emittersMap = new Map<Container<any>, BehaviorSubject<any>>();

const findContainer = <C>(c: Class<Container<any>>): Container<C> => {
  if (!containersMap.has(c)) containersMap.set(c, new c());

  return containersMap.get(c)!;
};

const getEmitter = (container: Container<any>): BehaviorSubject<any> => {
  if (!emittersMap.has(container)) {
    const emitter = new BehaviorSubject(container);
    emittersMap.set(container, emitter);
    return emitter;
  }

  return emittersMap.get(container)!;
};

export const clearListeners = () => {
  containersMap.clear();
  emittersMap.clear();
};

const subscribeListener = (
  container: Container<any>,
  listener: () => void,
  deleteOnUnmount?: boolean
) => {
  const emitter = getEmitter(container);
  const sub = emitter.subscribe(listener);

  return () => {
    sub.unsubscribe();
    if (deleteOnUnmount) {
      emittersMap.delete(container);
    }
  };
};

export class Container<State = any> {
  public state!: State;
  public setState = (updater: Partial<State> | ((prevState: State) => Partial<State> | null)) => {
    const nextState = updater instanceof Function ? updater(this.state) : updater;
    if (nextState) {
      this.state =
        nextState instanceof Object ? Object.assign({}, this.state, nextState) : nextState;

      getEmitter(this).next(0);
    }
  };
}

export function getContainer<C extends Container>(container: C | Class<C>) {
  return container instanceof Container ? container : (findContainer(container) as C);
}

export function useContainer<C extends Container>(
  container: C | Class<C>,
  deleteOnUnmount?: boolean
): C {
  const [, forceUpdate] = useState(0);
  const instance = container instanceof Container ? container : (findContainer(container) as C);

  useEffect(() => subscribeListener(instance, () => forceUpdate(c => c + 1), deleteOnUnmount), [
    instance,
  ]);
  return instance;
}
