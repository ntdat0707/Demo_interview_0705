import { HttpException, HttpStatus } from '@nestjs/common';

export async function checkStatusCategory(values: any[]) {
  const statusInput = values.map((item: any) => item.status);
  for (let i = 0; i < statusInput.length; i++) {
    if (statusInput[i] !== statusInput[i + 1]) {
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
