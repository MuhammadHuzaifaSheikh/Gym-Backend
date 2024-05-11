
function createError(status, message) {
  const error = new Error();
  error.message = message;
  error.status = status;
  return error;
}

module.exports = {
  createError: createError
};



// export const createError = (status, message) => {
//   const err = new Error();
//   err.status = status;
//   err.message = message;
//   return err;
// };