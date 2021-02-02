import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabelEntity } from '../entities/label.entity';
import { LabelInput } from './label.dto';

@Injectable()
export class LabelService {
  private readonly logger = new Logger(LabelService.name);
  constructor(
    @InjectRepository(LabelEntity)
    private labelRepository: Repository<LabelEntity>,
  ) {}

  async createLabel(labelInput: LabelInput) {
    this.logger.debug('Create label');
    const newLabel = new LabelEntity();
    newLabel.setAttributes(labelInput);
    await this.labelRepository.save(newLabel);
    return {
      data: {
        label: newLabel,
      },
    };
  }
}
