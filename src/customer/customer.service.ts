import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { Brackets, Connection, getManager, IsNull, Repository } from 'typeorm';
import { convertTv } from '../lib/utils';
import {
  ActiveCustomerInput,
  ChangePasswordInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  UpdateProfileInput,
} from './customer.dto';

import * as bcrypt from 'bcryptjs';
import { executeSendingEmail } from '../lib/emailer/config';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private connection: Connection,
  ) {}
  async updateCustomerAvatar(customerId: string, avatar: any) {
    if (!avatar) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'AVATAR_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existCustomer: Customer = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });
    existCustomer.avatar = avatar.filename;
    await this.customerRepository.save(existCustomer);
    await this.connection.queryResultCache.clear();
    return {
      data: existCustomer,
    };
  }

  async filterCustomer(
    searchValue: string,
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
  ) {
    let cacheKey = 'search_customer';

    const customerQuery = this.connection
      .createQueryBuilder(Customer, 'customer')
      .limit(limit)
      .offset((page - 1) * limit);

    const countQuery = this.connection.createQueryBuilder(Customer, 'customer');

    let searchValueConvert = '';
    if (searchValue) {
      searchValueConvert = `%${convertTv(searchValue)}%`;
      cacheKey += '_searchValue' + searchValue;
      const bracket = new Brackets(qb => {
        qb.where(`"customer"."phoneNumber" like '${searchValueConvert}'`)
          .orWhere(`LOWER(convertTVkdau("customer"."fullName")) like '${searchValueConvert}'`)
          .orWhere(`"customer"."email" like '%${searchValue}%'`)
          .orWhere(`LOWER("customer"."code") like '%${searchValue}%'`);
      });
      customerQuery.where(bracket);
      countQuery.where(bracket);
    }
    const customerCount = await countQuery.cache(`${cacheKey}_count_page${page}_limit${limit}`).getCount();

    const pages = Math.ceil(Number(customerCount) / limit);
    const customers = await customerQuery.cache(`${cacheKey}_page${page}_limit${limit}`).getMany();

    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: customerCount,
      data: customers,
    };
  }

  async updateCustomer(customerId: string, updateCustomerInput: UpdateCustomerInput) {
    let existCustomer: Customer;
    if (updateCustomerInput.phoneNumber) {
      existCustomer = await this.customerRepository.findOne({
        where: {
          phoneNumber: updateCustomerInput.phoneNumber,
          deletedAt: IsNull(),
        },
      });

      if (existCustomer && existCustomer.id !== customerId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'PHONE_EXISTED',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

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
    const existCustomer: Customer = await this.customerRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existCustomer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'CUSTOMER_NOT_EXIST',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const deletedAt: Date = new Date();
    existCustomer.deletedAt = deletedAt;

    // const shippings: Shipping[] = await this.shippingRepository.find({
    //   where: {
    //     customerId: existCustomer.id,
    //   },
    // });
    // const arrCustomerShipping = [];
    // for (const shipping of shippings) {
    //   shipping.deletedAt = deletedAt;
    //   arrCustomerShipping.push(shipping);
    // }

    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save<Customer>(existCustomer);
      // await transactionalEntityManager.save<Shipping>(arrCustomerShipping);
    });

    return {
      data: { status: true },
    };
  }

  async checkEmailExist(email: string) {
    const existCustomer: Customer = await this.customerRepository.findOne({
      where: {
        email: email,
        deletedAt: IsNull(),
      },
    });

    if (existCustomer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'EMAIL_EXISTED',
        },
        HttpStatus.CONFLICT,
      );
    }
    return true;
  }

  async checkPhoneExist(phone: string) {
    const existCustomer: Customer = await this.customerRepository.findOne({
      where: {
        phoneNumber: phone,
        deletedAt: IsNull(),
      },
    });

    if (existCustomer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'PHONE_NUMBER_EXISTED',
        },
        HttpStatus.CONFLICT,
      );
    }
    return true;
  }

  async createCustomer(createCustomerInput: CreateCustomerInput) {
    let existCustomer: Customer;
    if (createCustomerInput.email) {
      existCustomer = await this.customerRepository.findOne({
        where: {
          email: createCustomerInput.email,
        },
      });

      if (existCustomer) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'EMAIL_EXISTED',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    if (createCustomerInput.phoneNumber) {
      existCustomer = await this.customerRepository.findOne({
        where: {
          phoneNumber: createCustomerInput.phoneNumber,
        },
      });

      if (existCustomer) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'PHONE_EXISTED',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    let newCustomer = new Customer();
    newCustomer.setAttributes(createCustomerInput);
    newCustomer.isActive = false;
    newCustomer.acceptEmailMkt = true;
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

  async activeCustomer(activeCustomerInput: ActiveCustomerInput) {
    const existCustomer = await this.customerRepository.findOne({
      where: {
        id: activeCustomerInput.customerId,
      },
    });

    if (!existCustomer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'CUSTOMER_NOT_EXIST',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (existCustomer.isActive) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'CUSTOMER_ACTIVATED',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!existCustomer.email) {
      if (!activeCustomerInput.email) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'EMAIL_REQUIRED',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        existCustomer.email = activeCustomerInput.email;
      }
    }

    existCustomer.isActive = true;
    existCustomer.password = await bcrypt.hash(
      Math.random()
        .toString(36)
        .substring(2, 4) +
        Math.random()
          .toString(36)
          .substring(2, 8),
      10,
    );

    existCustomer.setAttributes(activeCustomerInput);
    await this.customerRepository.save(existCustomer);
    const SEND_TO = existCustomer.email;
    await executeSendingEmail({
      receivers: SEND_TO,
      message: 'test 11111111111111111111111111111111111111111111',
      subject: `test`,
      type: 'text',
    });
    return {
      data: existCustomer,
    };
  }

  async updateProfile(customerId: string, updateProfileInput: UpdateProfileInput) {
    let existCustomer: Customer;
    if (updateProfileInput.phoneNumber) {
      existCustomer = await this.customerRepository.findOne({
        where: {
          phoneNumber: updateProfileInput.phoneNumber,
          deletedAt: IsNull(),
        },
      });

      if (existCustomer && existCustomer.id !== customerId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'PHONE_EXISTED',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    existCustomer = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (!existCustomer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'CUSTOMER_NOT_EXIST',
        },
        HttpStatus.CONFLICT,
      );
    }
    existCustomer.setAttributes(updateProfileInput);
    await this.customerRepository.save(existCustomer);
    await this.connection.queryResultCache.clear();
    return {
      data: existCustomer,
    };
  }

  async changePassword(customerId: string, changePasswordInput: ChangePasswordInput) {
    const existCustomer = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (!existCustomer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'CUSTOMER_NOT_EXIST',
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordIsValid = bcrypt.compareSync(changePasswordInput.currentPassword, existCustomer.password);
    if (!passwordIsValid) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'INCORRECT_CURRENT_PASSWORD',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const hashPassword: string = await bcrypt.hash(changePasswordInput.newPassword, 10);
    existCustomer.password = hashPassword;
    await this.customerRepository.save(existCustomer);
    await this.connection.queryResultCache.clear();
    return {
      data: existCustomer,
    };
  }

  async getCustomer(customerId: string) {
    const customer: any = await this.connection
      .createQueryBuilder(Customer, 'customer')
      .select([
        'customer.id',
        'customer.email',
        'customer.fullName',
        'customer.shippingDefaultId',
        'customer.avatar',
        'customer.birthDay',
        'customer.code',
        'customer.gender',
        'customer.isActive',
      ])
      .cache(`get_customer_${customerId}`)
      .where('customer.id =:customerId', { customerId: customerId })
      .getOne();

    if (!customer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'CUSTOMER_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: customer,
    };
  }
}
