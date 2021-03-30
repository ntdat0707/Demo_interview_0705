import { HttpException, HttpStatus } from '@nestjs/common';

export async function checkStatusCategory(values: any[]) {
  let firstItem: string;
  const statusInput = values.map((item: any) => item.status);
  for (let i = 0; i < statusInput.length; i++) {
    if (i === 0) {
      firstItem = statusInput[i];
    }
    if (statusInput[i] !== firstItem) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'STATUSES_MUST_HAVE_SAME_VALUES',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
