import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { UpdateAgentPipe } from '../lib/validatePipe/agent/updateAgentPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CreateAgentPipe } from '../lib/validatePipe/agent/createAgentPipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { ConvertArray } from '../lib/validatePipe/convertArrayPipe.class';
import { AgentInput } from './agent.dto';
import { AgentService } from './agent.service';
import { CheckStatusFilterPipe } from '../lib/validatePipe/agent/statusFilterPipe.class';

@Controller('agent')
@ApiTags('Agent')
@UseFilters(new HttpExceptionFilter())
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Get('')
  @ApiQuery({ name: 'searchValue', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'country', required: false, type: String, isArray: true })
  async getAllAgent(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('searchValue') searchValue: string,
    @Query('status', new ConvertArray(), new CheckStatusFilterPipe()) status: string[],
    @Query('country', new ConvertArray()) country: string[],
  ) {
    return await this.agentService.getAllAgent(page, limit, searchValue, status, country);
  }

  @Get('/:id')
  async getAgent(@Param('id', new CheckUUID()) id: string) {
    return await this.agentService.getAgent(id);
  }

  @Put('/:id')
  @ApiBody({ type: AgentInput })
  async updateAgent(
    @Param('id', new CheckUUID()) id: string,
    @Body(new UpdateAgentPipe()) updateCareerInput: AgentInput,
  ) {
    return await this.agentService.updateAgent(id, updateCareerInput);
  }

  @Delete('/:id')
  async deleteAgent(@Param('id', new CheckUUID()) id: string) {
    return await this.agentService.deleteAgent(id);
  }

  @Post('')
  @ApiBody({ type: AgentInput })
  async createAgent(@Body(new CreateAgentPipe()) createAgentInput: AgentInput) {
    return await this.agentService.createAgent(createAgentInput);
  }
}
