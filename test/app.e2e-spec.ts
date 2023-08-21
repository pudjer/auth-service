import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register/ (POST): success', async () => {
    const result_1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'test',
        password: 'test',
      });
    expect(result_1.statusCode).toEqual(201);
    expect(result_1.body).toEqual({
      _id: result_1.body._id,
      blocked: false,
      date_registered: new Date('2020-01-01').toISOString(),
      username: 'test',
    });
  });
  it('/auth/register/ (POST): fail', async () => {
    const result_1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'test',
      });
    expect(result_1.statusCode).toEqual(400);
    const result_2 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        password: 'test',
      });
    expect(result_2.statusCode).toEqual(400);
  });
});
