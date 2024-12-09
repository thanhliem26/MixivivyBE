"use strict";

const STATUS_CODE = {
  OK: 200,
  CREATED: 200,
  UPDATED: 200,
  DELETED: 200,
};

const RESPON_STATUS_CODE = {
  OK: "Success",
  CREATED: "Created",
  UPDATED: "Updated",
  DELETED: "Deleted",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = STATUS_CODE.OK,
    reasonStatusCode = RESPON_STATUS_CODE.OK,
    metadata = {},
    options = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
    this.options = options;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    options,
    message,
    statusCode = STATUS_CODE.CREATED,
    reasonStatusCode = RESPON_STATUS_CODE.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

class UPDATED extends SuccessResponse {
  constructor({
    options,
    message,
    statusCode = STATUS_CODE.UPDATED,
    reasonStatusCode = RESPON_STATUS_CODE.UPDATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

class DELETED extends SuccessResponse {
  constructor({
    options,
    message,
    statusCode = STATUS_CODE.DELETED,
    reasonStatusCode = RESPON_STATUS_CODE.DELETED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  SuccessResponse,
  OK,
  CREATED,
  UPDATED,
  DELETED,
};
