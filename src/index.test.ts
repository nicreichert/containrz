import { act, renderHook } from 'react-hooks-testing-library';
import { Container, useContainer } from '.';

/**
 *  Tests for simple container
 */
interface State {
  num: number;
}

class Num extends Container<State> {
  state = {
    num: 0,
  };

  public setNum = (num: number) => this.setState({ num });
}

/**
 *  Tests for complex state
 */
interface ObjectContainerState {
  name: string;
  age: number;
  items: Array<string>;
}

class ObjectContainer extends Container<ObjectContainerState> {
  public state = {
    name: '',
    age: 0,
    items: [] as string[],
  };

  public setName = (name: string) => this.setState({ name });

  public setAge = (age: number) => this.setState({ age });

  public addItem = (item: string) => this.setState(s => ({ items: [...s.items, item] }));
}

describe('`useContainer` tests', () => {
  it('Sets num', () => {
    const { result } = renderHook(() => useContainer(Num));
    const container = result.current;

    expect(container.state.num).toBe(0);

    act(() => container.setNum(12));
    expect(container.state.num).toBe(12);
  });

  it('Updates state with complex object', () => {
    const { result } = renderHook(() => useContainer(ObjectContainer));
    const container = result.current;

    act(() => container.setAge(12));
    expect(container.state.age).toBe(12);

    act(() => container.setName('Nic'));
    expect(container.state.name).toBe('Nic');

    act(() => container.addItem('Ball'));
    expect(container.state.items.length).toBe(1);
  });
});
