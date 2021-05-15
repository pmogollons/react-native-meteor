import NetInfo from '@react-native-community/netinfo';

import Data from './Data';
import MeteorError from '../lib/MeteorError';

export default function(eventName, props, config = {}) {
  const args = Array.prototype.slice.call(arguments, 1);

  if (args.length && typeof args[args.length - 1] === 'function') {
    const id = Data.ddp.method(eventName, args);
    const callback = args.pop();

    return Data.calls.push({ id: id, callback });
  }

  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((netStatus) => {
        if (!netStatus.isConnected) {
          return reject(
            new MeteorError('NO_CONNECTION', 'No estas conectado a internet'),
          );
        }

        const id = Data.ddp.method(eventName, args);

        Data.calls.push({
          id: id,
          callback(error, response) {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          },
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
