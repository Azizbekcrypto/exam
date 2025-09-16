import { ISuccessRes } from 'src/common/interface';

export const successRes = (data: any, statusCode = 200): ISuccessRes => {
  return {
    statusCode,
    message: 'success',
    data,
  };
};
