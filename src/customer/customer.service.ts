import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { CreateCustomerInput, UpdateCustomerInput } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity) private customerRepository: Repository<CustomerEntity>,
    private connection: Connection,
  ) {}

  async createCustomer(createCustomerInput: CreateCustomerInput) {
    let existCustomer: CustomerEntity;
    if (createCustomerInput.email) {
      existCustomer = await this.customerRepository.findOne({
        where: {
          email: createCustomerInput.email,
        },
      });

      if (existCustomer) {
        throw new ConflictException(`Email ${createCustomerInput.email} existed`);
      }
    }

    let newCustomer = new CustomerEntity();
    newCustomer.setAttributes(createCustomerInput);
    let customerCode = '';
    while (true) {
      const random =
        Math.random()
          .toString(36)
          .substring(2, 4) +
        Math.random()
          .toString(36)
          .substring(2, 8);
      const randomCode = random.toUpperCase();
      customerCode = randomCode;
      const existCode = await this.customerRepository.findOne({
        where: {
          code: customerCode,
        },
      });
      if (!existCode) {
        break;
      }
    }
    newCustomer.code = customerCode;
    await this.connection.queryResultCache.clear();
    newCustomer = await this.customerRepository.save(newCustomer);
    return {
      data: newCustomer,
    };
  }

  async updateCustomer(customerId: string, updateCustomerInput: UpdateCustomerInput) {
    let existCustomer: CustomerEntity;
    existCustomer = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });
    existCustomer.setAttributes(updateCustomerInput);
    await this.customerRepository.save(existCustomer);
    await this.connection.queryResultCache.clear();
    return {
      data: existCustomer,
    };
  }

  async deleteCustomer(id: string) {
    const existCustomer: CustomerEntity = await this.customerRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existCustomer) {
      throw new NotFoundException(`Customer ${id} no found`);
    }
    const deletedAt: Date = new Date();
    existCustomer.deletedAt = deletedAt;

    await this.connection.queryResultCache.clear();
    await this.customerRepository.softRemove({ id: id });
    return {
      data: { status: true },
    };
  }

  async checkEmailExist(email: string) {
    const existCustomer: CustomerEntity = await this.customerRepository.findOne({
      where: {
        email: email,
        deletedAt: IsNull(),
      },
    });

    if (existCustomer) {
      throw new ConflictException(`Email ${email} already exists`);
    }
    return true;
  }
}
