
const sendResponse = (res, status, data = null, validationMessage = null) => {
    res.status(status).json({
      status: status === 200 || status === 201 ? "success" : "error",
      data,
      validationMessage,
    });
  };
  
  module.exports = sendResponse;