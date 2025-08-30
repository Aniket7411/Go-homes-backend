module.exports = {
  successResponse(res, data, message, HttpStatusCode, extras) {
    if (!res.headersSent) {
      const response = {
        data,
				message,
				extras: {},
      };
      if (extras) {
        Object.keys(extras).forEach((key) => {
          if ({}.hasOwnProperty.call(extras, key)) {
            response.extras[key] = extras[key];
          }
        });
      }
      return res.status(HttpStatusCode).send(response);
    }
  },
 
  errorResponse(res, message, HttpStatusCode) {
    if (!res.headersSent) {
      const response = {
        data: {},
				message,
      };
      return res.status(HttpStatusCode).send(response);
    }
  },
 
  validationErrorResponse(res, message) {
    if (!res.headersSent) {
      const response = {
        data: {},
				message,
      };
      return res.status(400).send(response);
    }
  },
};