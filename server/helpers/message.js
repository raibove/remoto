
export const messager_custom = function (res, code, message, return_object) {
    return_object.status_code = code;
    return_object.message = message;
    res.status(code).json(return_object);
  };
  