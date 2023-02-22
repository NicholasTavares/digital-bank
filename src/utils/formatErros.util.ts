import { ValidationError } from '@nestjs/common';

export const FormatErrors = (messages: ValidationError[]) => {
  const formatedMessages = messages.map((msg) => ({
    value: msg.value,
    field: msg.property,
    error_msg: Object.values(msg.constraints)[0],
  }));

  return formatedMessages;
};
