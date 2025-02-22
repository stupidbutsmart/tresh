/**
 *
 * @param {object} req - express req object
 * @param {object} schBody - body schema
 * @description
 * validates a request body against a schema
 * @returns {Array.<object> | Array.<null>} array of error Objects
 */
const validateBody = (req, schBody) => {
  const { body } = req,
    bodyErrors = [];
  if (Object.keys(body).length > Object.keys(schBody).length) {
    bodyErrors.push({
      err: "EXTRA PROPS",
      location: "body",
      msg: "extra props found",
      extraProps: Object.keys(body).filter(
        (x) => !Object.keys(schBody).includes(x)
      ),
    });
    return bodyErrors;
  }

  //looking through each prop
  for (let prop in schBody) {
    const NO_PROP_IN_BODY = !Object.hasOwn(body, prop);
    if (NO_PROP_IN_BODY)
      bodyErrors.push({
        err: "MISSING PROPS",
        location: "body",
        msg: `${prop} not found in body.`,
      });

    const EXPECTED_TYPE = schBody[prop];
    const BODY_VALUE = body[prop];
    const INCORRECT_TYPE = !body[prop] instanceof schBody[prop];
    if (INCORRECT_TYPE)
      bodyErrors.push({
        err: "BAD TYPES",
        location: "body",
        msg: `${prop} is expected to be of type ${EXPECTED_TYPE} , got ${BODY_VALUE} instead.`,
      });
  }

  return bodyErrors;
};

/**
 *
 * @param {object} req - express req object
 * @param {object} schParams - params schema
 * @description
 * validates a request params against a schema
 * @returns {Array.<object> | Array.<null>} array of error Objects
 */
const validateParams = (req, schParams) => {
  const { params } = req,
    paramsErrors = [];
  if (Object.keys(params).length > Object.keys(schParams).length) {
    paramsErrors.push({
      err: "EXTRA PROPS",
      location: "params",
      msg: "extra props found",
      extraProps: Object.keys(params).filter(
        (x) => !Object.keys(schParams).includes(x)
      ),
    });
    return paramsErrors;
  }

  //looking through each prop
  for (let prop in schParams) {
    const NO_PROP_IN_PARAMS = !Object.hasOwn(params, prop);
    if (NO_PROP_IN_PARAMS)
      paramsErrors.push({
        error: "MISSING PARAMS",
        location: "params",
        msg: `${prop} not found in params.`,
      });

    const EXPECTED_TYPE = schParams[prop];
    const PARAMS_VALUE = isNaN(params[prop])
      ? params[prop]
      : parseInt(params[prop]); //handles numbers

    const INCORRECT_TYPE = !params[prop] instanceof schParams[prop];
    if (INCORRECT_TYPE)
      paramResponse.push({
        error: "BAD TYPES",
        location: "params",
        msg: `${prop} is expected to be of type ${EXPECTED_TYPE} , got ${PARAMS_VALUE} instead.`,
      });
  }

  return paramsErrors;
};

/**
 *
 * @param {object} schema - validation schema
 * @description
 * Validates req body and parameters. Used as a middleware
 * Stores the errors , body and params in 'req.locals'
 * @example
 * const {Router} = require('express');
 * const app = Router()
 * const schema = {
 *  body : {
 *    username: validator.string,
 *    level: validator.int
 *  },
 *  params: validator.null; //expect nothing.
 * }
 *
 *
 * app.post('/' , createValidator(schema) , (req , res) => {
 *  //expect
 *  //{body:... , params:...}
 *  //or
 *  //{errors: [...]}
 *  res.send(req.locals)
 * })
 * @returns {Function} validation middleware
 */
module.exports = {
  createValidator: (schema) => {
    if (!schema) throw new Error("No schema found for createValidator");
    if (schema.body === undefined || schema.params === undefined)
      throw new Error(
        'Body or params not found in schema. If you wish to to validate the body or params, set them to "validator.null"'
      );
    //return a middleware that validates
    return (req, res, next) => {
      const errors = [];
      for (let location in schema) {
        if (schema[location] == null) continue; //not expecting
        //run different validators for diff locations
        if (location == "body") {
          const bodyResponse = validateBody(req, schema[location]);
          errors.push(...bodyResponse);
        } else if (location == "params") {
          const paramResponse = validateParams(req, schema[location]);
          errors.push(...paramResponse);
        }
      }
      req.locals = {
        errors: errors.length == 0 ? null : errors,
        body: req.body,
        params: req.params,
      };
      // console.log(`For route ${req.url}, ${req.locals} , ${schema}`);
      next();
    };

  },
  validator: {
    string: String,
    array: Array,
    int: Number,
    object: Object,
    boolean: Boolean,
    null: null,
  }
}
