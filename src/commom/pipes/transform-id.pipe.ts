import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class PipeNumericId implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const valueInt = Number(value);

    if (isNaN(valueInt)) {
      throw new BadRequestException('O ID deve ser uma string numerica');
    }

    if (valueInt < 0) {
      throw new BadRequestException('O valor precisa ser um numero positivo');
    }
  }
}
