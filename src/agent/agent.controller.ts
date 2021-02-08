import { Body, Controller, Delete, Get, Param, Put, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { UpdateAgentPipe } from '../lib/validatePipe/agent/updateAgentPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { AgentInput } from './agent.dto';
import { AgentService } from './agent.service';

@Controller('agent')
@ApiTags('Agent')
@UseFilters(new HttpExceptionFilter())
export class AgentController {
  constructor(private agentService: AgentService) {}

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
}
