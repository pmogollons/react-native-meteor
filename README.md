# react-native-meteor

[![react-native-meteor](http://img.shields.io/npm/dm/react-native-meteor.svg)](https://www.npmjs.org/package/react-native-meteor) [![npm version](https://badge.fury.io/js/react-native-meteor.svg)](http://badge.fury.io/js/react-native-meteor) [![Dependency Status](https://david-dm.org/inProgress-team/react-native-meteor.svg)](https://david-dm.org/inProgress-team/react-native-meteor)

Meteor-like methods for React Native.

## What is it for ?

The purpose of this library is :

- To set up and maintain a ddp connection with a ddp server, freeing the developer from having to do it on their own.
- Be fully compatible with react-native and help react-native developers.
- **To match with [Meteor documentation](http://docs.meteor.com/) used with React.**

## Install

```
yarn add react-native-meteor
```

or

```
npm i --save react-native-meteor
```

[!! See detailed installation guide](https://github.com/inProgress-team/react-native-meteor/blob/master/docs/Install.md)

## Compatibility notes

Since RN 0.60+ the original package was not compatible, this repo makes some changes to fix that and remove some unused modules.

- Use netinfo and asyncstorage from its community packages
- Removed FSCollection modules
- Removed MeteorListView, MeteorComplexListView, createContainer, composeWithTracker, ReactMixin
- Now Call, loginWithPassword and logout support promises
- Added onLogout event
- Updated deps and removed unused ones
- Partially updated code to es6+
- Method.call promise has a configurable timeout and checks for connection before making the call. (This improved error handling in our apps)
- Dont clear connections on reconnect.

## Future

- We dont intend to support this package in the long run, it will be supported in the time we keep using it.
- We might add the components and modules we use to handle grapher queries to this repo.

## Example usage

```javascript
import React, {Component} from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import {View, Text, FlatList} from 'react-native';

Meteor.connect('ws://192.168.X.X:3000/websocket'); //do this only once

class App extends Component {
  _renderItem(todo) {
    return <Text>{todo.title}</Text>;
  }

  render() {
    const {settings, todosReady} = this.props;

    return (
      <View>
        <Text>{settings.title}</Text>

        {!todosReady && <Text>Not ready</Text>}

        <FlatList
          data={this.props.data}
          renderItem={this._renderItem}
          keyExtractor={item => item._id}
        />
      </View>
    );
  }
}

export default withTracker(params => {
  const handle = Meteor.subscribe('todos');
  Meteor.subscribe('settings');

  return {
    todosReady: handle.ready(),
    settings: Meteor.collection('settings').findOne(),
  };
})(App);
```

## Documentation

- Learn how to getting started from [connecting your components](docs/connect-your-components.md).
- The [API reference](docs/api.md) lists all public APIs.
- Visit the [How To ?](docs/how-to.md) section for further information.

## Author

- Théo Mathieu ([@Mokto](https://github.com/Mokto)) from [inProgress](https://in-progress.io)
- Nicolas Charpentier ([@charpeni](https://github.com/charpeni))

![image](https://user-images.githubusercontent.com/7189823/40546483-68c5e734-5ffd-11e8-8dd4-bdd11d9fbc93.png)

## Want to help ?

Pull Requests and issues reported are welcome! :)

## License

react-native-meteor is [MIT Licensed](LICENSE).
