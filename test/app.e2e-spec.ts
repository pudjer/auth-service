import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as testRequest from 'supertest';
import { AppModule } from '../src/app/app.module';
import { UserCreateDTO, UserLoginDTO } from '../src/models/User';
import { bruteforceFunction } from '../src/helpers/bruteforce';


const goodPasswords = ['disshitisrealystrong69@FKJDS']
const badPasswords = ['qwerty123', 'aslkdfj']
const goodUserNames = ['dolboyob69']
const badUserNames = ['adfjls;kjadslfk;jasdlkfjals;jf;askfja;sdjf', '&$*'] 

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const agentPool: Record<string, testRequest.SuperAgentTest> = {}
  const agentHook = (index) => {
    if(index in agentPool) return agentPool[index]
    const agent = testRequest.agent(app.getHttpServer())
    agentPool[index] = agent
    return agent
  }


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    bruteforceFunction(async (username, password) => {
      const agent = agentHook(username + password)
      const result = await agent
        .delete('/me').send()
      expect(result.statusCode).toBe(200)
    })(goodUserNames, goodPasswords)
  })




  
  bruteforceFunction((username, password )=>{
    it(`/auth/register/ (POST): success username: ${username}, password: ${password}`, async () => {
      const agent = agentHook(username+password)
      const request: UserCreateDTO = {
          username,
          password,
        }
      const result = await agent
        .post('/auth/register')
        .send(request);
      const { date_registered, username: usernameres } = result.body
      expect(result.statusCode).toEqual(201);
      expect(typeof date_registered).toBe("string")
      expect(usernameres).toBe(username)
    });




    it(`/auth/login/ (POST): success username: ${username}, password: ${password}`, async () => {
      const agent = agentHook(username + password)
      const request: UserLoginDTO = {
          username,
          password,
        }
      const result = await agent
        .post('/auth/login')
        .send(request)
      const {access_token} = result.body
      expect(result.statusCode).toEqual(201);
      expect(typeof access_token).toBe('string')
    });


  })(goodUserNames, goodPasswords)
    



  bruteforceFunction((username, password) => {
    it(`/auth/register/ (POST): fail(username) username: ${username}, password: ${password}`, async () => {
      const agent = agentHook(username + password)
      const result_1 = await agent
        .post('/auth/register')
        .send({
          username,
          password
        });
      expect(result_1.status).toBe(400)
    });
  })(badUserNames, goodPasswords)

  bruteforceFunction((username, password) => {
    it(`/auth/register/ (POST): fail(password) username: ${username}, password: ${password}`, async () => {
      const agent = agentHook(username + password)
      const result_1 = await agent
        .post('/auth/register')
        .send({
          username,
          password
        });
      expect(result_1.status).toBe(400)
    });
  })(goodUserNames, badPasswords)

  
});
