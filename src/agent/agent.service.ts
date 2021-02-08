import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AgentEntity } from '../entities/agent.entity';
import { AgentInput } from './agent.dto';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  constructor(
    @InjectRepository(AgentEntity) private agentRepository: Repository<AgentEntity>,
    private connection: Connection,
  ) {}

  async getAgent(agentId: string) {
    this.logger.debug('get-agent-by-id');
    const agent = await this.agentRepository.findOne({ where: { id: agentId } });
    return {
      data: agent,
    };
  }

  async updateAgent(agentId: string, agentInput: AgentInput) {
    this.logger.debug('update-agent-by-id');
    const agentUpdate = new AgentEntity();
    agentUpdate.setAttributes(agentInput);
    let agent = await this.agentRepository.findOne({ where: { id: agentId } });
    if (!agent) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Agent id ${agentId} is not exist `,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    agent = agentUpdate;
    await this.connection.queryResultCache.clear();
    await this.agentRepository.update({ id: agentId }, agent);
    return {
      data: agent,
    };
  }

  async deleteAgent(agentId: string) {
    this.logger.debug('delete-agent-by-id');
    const agent = await this.agentRepository.findOne({ where: { id: agentId } });
    if (!agent) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Agent id ${agentId} is not exist `,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.agentRepository.softRemove<AgentEntity>(agent);
  }
}
