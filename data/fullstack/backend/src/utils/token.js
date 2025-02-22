module.exports = {

  /**
   * @function
   * @param {Number} [length=32] - length of post-pended string
   *
   * @description
   * Generates a unique string based on date time
   */
  generateReferenceToken: (length = 32) => {
    const time = Date.now().toString();
    const CHARS = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*(),.<>?/';
    let postPended = ''

    // generating post-pended string
    for (let i = 0; i < length; i++) {
      const randIdx = Math.floor(Math.random() * CHARS.length) // random char from chars via idx
      postPended += CHARS[randIdx];
    }

    return `${time}-${postPended}`;
  },
}
