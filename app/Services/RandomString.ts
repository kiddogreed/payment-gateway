
import randomstring from "randomstring"
/** 
 * Random String class
 *
 * @class RandomString
 * @constructor
 */
class RandomString {
  public generate(
    length:number,
    charset = "alphanumeric",
    capitalization = null
  ) {
    const randomString = randomstring.generate({
      length: length,
      charset: charset,
      capitalization: capitalization,
    });

    return randomString;
  }
}

export default new RandomString()
