import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CustomerService {
  prisma = new PrismaClient();
  async create(createCustomerDto: CreateCustomerDto) {
    const isCustomerExist = await this.prisma.customer.findFirst({
      where: {
        email: createCustomerDto.email,
      },
    });

    if (isCustomerExist) {
      throw new NotFoundException('Customer with this email already exists');
    }

    const customer = await this.prisma.customer.create({
      data: createCustomerDto,
    });

    return customer;
  }

  async findAll(page?: number, keywords?: string) {
    const offset = (page - 1) * 5;

    let searchFilter = {};
    if (keywords) {
      searchFilter = {
        OR: [
          { firstName: { contains: keywords } },
          { lastName: { contains: keywords } },
          { email: { contains: keywords } },
          { phoneNumber: { contains: keywords } },
        ],
      };
    }

    const customers = await this.prisma.customer.findMany({
      skip: offset,
      take: 5,
      where: searchFilter,
    });

    const totalCustomers = await this.prisma.customer.count({
      where: searchFilter,
    });

    const totalPages = Math.ceil(totalCustomers / 5);
    return {
      customers,
      totalPages,
    };
  }

  async findOne(id: number) {
    return this.prisma.customer.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with id #${id} not found`);
    }

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });

    return updatedCustomer;
  }

  async remove(id: number) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with id #${id} not found`);
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    return `Customer with id #${id} has been removed`;
  }
}
