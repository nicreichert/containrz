# use-container

`use-container` is a simpe hook to help you manage your global and local states without any need for configuration and no dependency on context.

## How to use it

In order to use `use-container`, you need to create a class that extends `Container`, provided on the package.

```js
import { Container } from 'use-container'

interface User {
  name: string
  email: string
  phoneNumber: string
}

export class UserContainer extends Contaner<User> {
  public state = {
    name: '',
    email: '',
    phoneNumber: '',
  }

  public setUser = (user: User) => this.setState(user)

  public setName = (name) => this.setState({ name })

  public setEmail = (email) => this.setState({ email })

  // ...
}
```

Once you have your container, you can now start sharing its state:

```js
import * as React from 'react'
import { useContainer } from 'use-container'
import { UserContainer } from './UserContainer'

export const App = () => {
  const user = useContainer(UserContainer)

  React.useEffect(() => {
    fetch('/user')
      .then(response => response.json)
      .then(data => user.setUser(data));
  }, [])

  return <input value={user.state.name} onChange={e => user.setName(e.target.value)} />
}
```

## Share globally and locally

If your intention is to share the state globally, you can then use simply the reference to the class inside the `useContainer` call. However, you can create local states by creating instances of those classes.

```js
export const App = () => {
  // uses the global state for UserContainer
  const user = useContainer(UserContainer);

  return (
    // ...
  )
}

export const App = () => {
  // creates a local state for UserContainer
  const[localUser] = React.useState(new UserContainer())
  const user = useContainer(localUser);

  return (
    // ...
  )
}

```
