const bcrypt = require('bcrypt');

module.exports = {
  /**
   * @function
   * @param {Function} callback
   * @param {Error|null} callback.err
   * @param {Number|null} callback.salt - generated salt rounds
   * @param {Number} [length=500]- amount of time in ms allowed to generate the salt
   * @description 
   * Generates a salt based on amount of time provided
   *
   */
  dynamicSaltGenerator: async (callback, length = 500) => {
    let salt = 2;
    const startTime = Date.now();
    const testPin = 'testPassword123';

    // generate salt
    while (Date.now() - startTime < length) {
      try {
        await bcrypt.hash(testPin, salt);
        salt += 1
      } catch (error) {
        console.log(error);
        callback(err, null);
      }
    }
    callback(null, salt);
    return;
  }
}
