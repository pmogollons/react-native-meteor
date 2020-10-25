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

  let timeoutId;

  const callPromise = new Promise((resolve, reject) => {
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
            clearTimeout(timeoutId);

            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          },
        });
      })
      .catch((error) => {
        clearTimeout(timeoutId);

        reject(error);
      });
  });

  let timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);

      reject(
        new MeteorError(
          'TIMEOUT',
          'El servidor tomo mas de lo esperado en responder',
        ),
      );
    }, config.timeout || 90 * 1000);
  });

  return Promise.race([callPromise, timeoutPromise]);
}
