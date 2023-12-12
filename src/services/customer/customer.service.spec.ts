import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    customer: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

describe('CustomerService', () => {
  let service: CustomerService;
  let prismaClientMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: PrismaClient, useValue: new PrismaClient() },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prismaClientMock = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test for create method
  describe('create', () => {
    it('should successfully create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      };
      prismaClientMock.customer.findFirst.mockResolvedValue(null);
      prismaClientMock.customer.create.mockResolvedValue(createCustomerDto);

      expect(await service.create(createCustomerDto)).toEqual(createCustomerDto);
    });

    it('should throw an exception if customer exists', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      };
      prismaClientMock.customer.findFirst.mockResolvedValue(createCustomerDto);

      await expect(service.create(createCustomerDto)).rejects.toThrow(NotFoundException);
  });

  // Test for findAll method
  describe('findAll', () => {
    it('should return an array of customers with pagination', async () => {
      const mockCustomers = [];
      prismaClientMock.customer.findMany.mockResolvedValue(mockCustomers);
      prismaClientMock.customer.count.mockResolvedValue(mockCustomers.length);
  
      const result = await service.findAll(1, 5);
      expect(result.customers).toEqual(mockCustomers);
      expect(result.totalPages).toEqual(Math.ceil(mockCustomers.length / 5));
  });

  // Test for findOne method
  describe('findOne', () => {
    it('should return a single customer', async () => {
      const mockCustomer = {  };
      prismaClientMock.customer.findFirst.mockResolvedValue(mockCustomer);
  
      expect(await service.findOne(1)).toEqual(mockCustomer);
    });
  
    it('should throw an exception if customer not found', async () => {
      prismaClientMock.customer.findFirst.mockResolvedValue(null);
  
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // Test for update method
  describe('update', () => {
    it('should update a customer\'s details', async () => {
      const mockCustomer = { };
      prismaClientMock.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaClientMock.customer.update.mockResolvedValue({ ...mockCustomer, })
  
      const updatedCustomer = await service.update(1, {  });
      expect(updatedCustomer).toEqual({ ...mockCustomer,  });
    });
  
    it('should throw an exception if customer does not exist', async () => {
      prismaClientMock.customer.findUnique.mockResolvedValue(null);
  
      await expect(service.update(999, {  })).rejects.toThrow(NotFoundException);
  });

  // Test for remove method
  describe('remove', () => {
    it('should remove a customer', async () => {
      prismaClientMock.customer.findUnique.mockResolvedValue({ });
      prismaClientMock.customer.delete.mockResolvedValue({ });
  
      expect(await service.remove(1)).toMatch('Customer with id #1 has been removed');
    });
  
    it('should throw an exception if customer does not exist', async () => {
      prismaClientMock.customer.findUnique.mockResolvedValue(null);
  
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
