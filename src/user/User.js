import AsyncStorage from '@react-native-community/async-storage';

import call from '../Call';
import Data from '../Data';
import {hashPassword} from '../../lib/utils';

const TOKEN_KEY = 'reactnativemeteor_usertoken';

module.exports = {
  user() {
    if (!this._userIdSaved) return null;

    return this.collection('users').findOne(this._userIdSaved);
  },
  userId() {
    if (!this._userIdSaved) return null;

    const user = this.collection('users').findOne(this._userIdSaved);
    return user && user._id;
  },
  _isLoggingIn: true,
  loggingIn() {
    return this._isLoggingIn;
  },
  logout() {
    return new Promise((resolve, reject) => {
      call('logout', error => {
        if (error) {
          return reject(error);
        }

        this.handleLogout();
        this.connect();

        Data.notify('onLogout');

        resolve();
      });
    });
  },
  handleLogout() {
    AsyncStorage.removeItem(TOKEN_KEY);
    Data._tokenIdSaved = null;
    this._userIdSaved = null;
  },
  loginWithPassword(selector, password) {
    return new Promise((resolve, reject) => {
      if (typeof selector === 'string') {
        if (selector.indexOf('@') === -1) {
          selector = {username: selector};
        } else {
          selector = {email: selector};
        }
      }

      this._startLoggingIn();

      const params = {
        user: selector,
        password: hashPassword(password),
      };

      call('login', params, (error, result) => {
        this._endLoggingIn();
        this._handleLoginCallback(error, result);

        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  },
  logoutOtherClients() {
    return new Promise((resolve, reject) => {
      call('getNewToken', (error, res) => {
        if (error) {
          return reject(error);
        }

        this._handleLoginCallback(error, res);

        call('removeOtherTokens', error => {
          if (error) {
            return reject(error);
          }

          return resolve();
        });
      });
    });
  },
  _login(user, callback) {
    this._startLoggingIn();
    this.call('login', user, (err, result) => {
      this._endLoggingIn();

      this._handleLoginCallback(err, result);

      if (typeof callback == 'function') {
        callback(err);
      }
    });
  },
  _startLoggingIn() {
    this._isLoggingIn = true;
    Data.notify('loggingIn');
  },
  _endLoggingIn() {
    this._isLoggingIn = false;
    Data.notify('loggingIn');
  },
  _handleLoginCallback(err, result) {
    if (!err) {
      //save user id and token
      AsyncStorage.setItem(TOKEN_KEY, result.token);
      Data._tokenIdSaved = result.token;
      this._userIdSaved = result.id;
      Data.notify('onLogin');
    } else {
      Data.notify('onLoginFailure');
      this.handleLogout();
    }
    Data.notify('change');
  },
  _loginWithToken(value) {
    Data._tokenIdSaved = value;
    if (value !== null) {
      this._startLoggingIn();
      call('login', {resume: value}, (err, result) => {
        this._endLoggingIn();
        this._handleLoginCallback(err, result);
      });
    } else {
      this._endLoggingIn();
    }
  },
  getAuthToken() {
    return Data._tokenIdSaved;
  },
  async _loadInitialUser() {
    let value = null;

    try {
      value = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    } finally {
      this._loginWithToken(value);
    }
  },
};
