import Data from './Data';

export default function(eventName) {
  const args = Array.prototype.slice.call(arguments, 1);
  const id = Data.ddp.method(eventName, args);
  let callback;

  if (args.length && typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  } else {
    return new Promise((resolve, reject) => {
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
    });
  }

  Data.calls.push({ id: id, callback });
}
