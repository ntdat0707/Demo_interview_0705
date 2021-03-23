import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path = require('path');
import { Connection, Repository } from 'typeorm';
import { AgentEntity } from '../entities/agent.entity';
import { convertTv } from '../lib/utils';
import { AgentInput } from './agent.dto';
import * as ejs from 'ejs';
import { executeSendingEmail } from '../lib/emailer/config';
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
  }

  async createAgent(agentInput: AgentInput, isCMS: string) {
    this.logger.debug('create agent');
    let agent = new AgentEntity();
    agent.setAttributes(agentInput);
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existAgentCode = await this.agentRepository.findOne({ where: { code: randomCode } });
      if (!existAgentCode) {
        break;
      }
    }
    agent.code = randomCode;
    //console.log('isCMS:::', typeof isCMS);
    if (isCMS === 'false') {
      // console.log('isCMS is false');
      try {
        const SEND_TO = 'nguyentandat.email07@gmail.com';
        const pathFile = path.join(__dirname, '../../template/new_account.ejs');
        // console.log('PathFile::', pathFile);
        const dataEmail = {
          companyPhone: agentInput.companyPhone,
          companyName: agentInput.companyName,
          website: agentInput.website,
          companyEmail: agentInput.companyEmail,
          country: agentInput.country,
          city: agentInput.city,
          street: agentInput.street,
          contactName: agentInput.contactName,
          contactEmail: agentInput.contactEmail,
          contactPhone: agentInput.contactPhone,
          jobTitle: agentInput.jobTitle,
          description: agentInput.description,
          status: agentInput.status,
        };
        ejs.renderFile(pathFile, dataEmail, async (err, data) => {
          if (err) {
            //   console.log(err);
          } else {
            // console.log('OK Send mail::');
            await executeSendingEmail({
              receivers: SEND_TO,
              message: data,
              subject: '[Test] Kích hoạt tài khoản',
              type: 'html',
            });
          }
        });
      } catch (error) {
        //console.log(error);
      }
    }
    agent = await this.agentRepository.save(agent);
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

  async getAllAgent(
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    searchValue: string,
    status: string[],
    country: string[],
  ) {
    this.logger.debug('get all agent');
    const queryExc = this.agentRepository
      .createQueryBuilder('agent')
      .orderBy('created_at')
      .where('')
      .limit(limit)
      .offset((page - 1) * limit);
    if (searchValue) {
      searchValue = convertTv(searchValue.replace(/  +/g, '').trim());
      queryExc.andWhere(`lower(code) like :value OR lower(company_name) like :value`, {
        value: `%${searchValue}%`,
      });
    }
    if (status?.length > 0) {
      queryExc.andWhere(`status in (:...status)`, { status: status });
    }
    if (country?.length > 0) {
      queryExc.andWhere(`country in (:...country)`, { country: country });
    }
    this.connection.queryResultCache.clear();
    const countResult = await queryExc.cache(`agents_count_page${page}_limit${limit}`).getCount();
    const result = await queryExc.cache(`agents__page${page}_limit${limit}`).getMany();
    const pages = Math.ceil(Number(countResult) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: countResult,
      data: result,
    };
  }
}
