# react-native-meteor

[![react-native-meteor](http://img.shields.io/npm/dm/react-native-meteor.svg)](https://www.npmjs.org/package/react-native-meteor) [![npm version](https://badge.fury.io/js/react-native-meteor.svg)](http://badge.fury.io/js/react-native-meteor)

Meteor-like methods for React Native.

## What is it for ?

The purpose of this library is :

- To set up and maintain a ddp connection with a ddp server, freeing the developer from having to do it on their own.
- Be fully compatible with react-native and help react-native developers.
- **To match with [Meteor documentation](http://docs.meteor.com/) used with React.**

## Install

```
yarn add pmogollons/react-native-meteor
```

and you also need to install peer dependencies

```
yarn add @react-native-community/netinfo @react-native-community/async-storage
```

[See detailed installation guide](https://github.com/pmogollons/react-native-meteor/blob/master/docs/Install.md)

## Compatibility notes

Since RN 0.60+ the original package was not compatible, this repo makes some changes to fix that and:

- Use netinfo and asyncstorage from its community packages
- Now call, loginWithPassword, logout and logoutOtherClients return promises
- Removed callbacks from call, loginWithPassword, logout, logoutOtherClients
- Added onLogout event
- Method.call promise has a configurable timeout and checks for connection before making the call. (This improved error handling in our apps)
- Removed FSCollection modules
- Removed MeteorListView, MeteorComplexListView, createContainer, composeWithTracker, ReactMixin
- Updated deps and removed unused ones
- Partially updated code to es6+
- Dont clear connections on reconnect.

## Future

- We dont intend to support this package in the long run, it will be supported for the time we keep using it.
- We might add the components and modules we use to handle grapher queries to this repo.

## Example usage

```javascript
import React, {Component} from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import {View, Text, Alert, FlatList, TouchableOpacity} from 'react-native';

Meteor.connect('ws://192.168.X.X:3000/websocket'); //do this only once

class App extends Component {
  state = {
    isLoading: false,
  };

  _callMethod = async () => {
    this.setState({isLoading: true});

    try {
      // Default timeout is 15,000 (15secs)
      await Meteor.call('methodName', params, {timeout: 5000});
    } catch (error) {
      Alert.alert('There was an error!', error.reason);
    } finally {
      this.setState({isLoading: false});
    }
  };

  _login = async () => {
    this.setState({isLoading: true});

    try {
      await Meteor.loginWithPassword(email, password);
    } catch (error) {
      Alert.alert('There was an error!', error.reason);
    } finally {
      this.setState({isLoading: false});
    }
  };

  _renderItem(todo) {
    return <Text>{todo.title}</Text>;
  }

  render() {
    const {settings, todosReady} = this.props;

    return (
      <View>
        <Text>{settings.title}</Text>

        <TouchableOpacity onPress={this._callMethod}>
          <Text>{this.state.isLoading ? 'Loading...' : 'Do something'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._login}>
          <Text>{this.state.isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

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

## Want to help ?

Pull Requests and issues reported are welcome! :)

## Authors

- Forked from [inProgress-team/react-native-meteor](https://github.com/inProgress-team/react-native-meteor)
- Original work from Théo Mathieu ([@Mokto](https://github.com/Mokto)) and Nicolas Charpentier ([@charpeni](https://github.com/charpeni))

## License

react-native-meteor is [MIT Licensed](LICENSE).
