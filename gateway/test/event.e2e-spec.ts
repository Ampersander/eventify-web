import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { AppModule } from '../src/app.module';
import { userSignupRequestSuccess } from './mocks/user-signup-request-success.mock';
import { eventCreateRequestSuccess } from './mocks/event-create-request-success.mock';
import { eventUpdateRequestSuccess } from './mocks/event-update-request-success.mock';

describe('Events (e2e)', () => {
  let app;
  let user;
  let eventId: string;
  let userToken: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DSN, { useNewUrlParser: true });
    await mongoose.connection.dropDatabase();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/ (POST) - should create a user for checking events api', (done) => {
    return request(app.getHttpServer())
      .post('/users/')
      .send(userSignupRequestSuccess)
      .expect(201)
      .end(done);
  });

  it('/users/login (POST) - should create a token for valid credentials', (done) => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send(userSignupRequestSuccess)
      .expect(201)
      .expect((res) => {
        userToken = res.body.data.token;
      })
      .end(done);
  });

  it('/events (GET) - should not return events without valid token', (done) => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(401)
      .expect({
        message: 'token_decode_unauthorized',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events (POST) - should not create a event without a valid token', (done) => {
    return request(app.getHttpServer())
      .post('/events')
      .expect(401)
      .expect({
        message: 'token_decode_unauthorized',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events (POST) - should not create a event with an invalid token', (done) => {
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', userToken + 1)
      .send(eventCreateRequestSuccess)
      .expect(401)
      .expect({
        message: 'token_decode_unauthorized',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events (POST) - should not create a event for an unconfirmed user with valid token', (done) => {
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', userToken)
      .send(eventCreateRequestSuccess)
      .expect(403)
      .expect({
        message: 'permission_check_forbidden',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events (GET) - should not retrieve events without a valid token', (done) => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(401)
      .expect({
        message: 'token_decode_unauthorized',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events (GET) - should not retrieve events with an valid token', (done) => {
    return request(app.getHttpServer())
      .get('/events')
      .set('Authorization', userToken + 1)
      .expect(401)
      .expect({
        message: 'token_decode_unauthorized',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events (POST) - should not retrieve events for an unconfirmed user with valid token', (done) => {
    return request(app.getHttpServer())
      .get('/events')
      .set('Authorization', userToken)
      .expect(403)
      .expect({
        message: 'permission_check_forbidden',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/users/confirm/:link (GET) - should confirm user', async () => {
    user = await mongoose.connection
      .collection('users')
      .find({
        email: userSignupRequestSuccess.email,
      })
      .toArray();
    const userConfirmation = await mongoose.connection
      .collection('user_links')
      .find({
        user_id: user[0]._id.toString(),
      })
      .toArray();

    return request(app.getHttpServer())
      .get(`/users/confirm/${userConfirmation[0].link}`)
      .send()
      .expect(200)
      .expect({
        message: 'user_confirm_success',
        errors: null,
        data: null,
      });
  });

  it('/events (POST) - should create a event for the user with a valid token', (done) => {
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', userToken)
      .send(eventCreateRequestSuccess)
      .expect(201)
      .expect((res) => {
        eventId = res.body.data.event.id;
        res.body.data.event.id = 'fake_value';
        res.body.data.event.created_at = 'fake_value';
        res.body.data.event.updated_at = 'fake_value';
      })
      .expect({
        message: 'event_create_success',
        data: {
          event: {
            notification_id: null,
            name: eventCreateRequestSuccess.name,
            description: eventCreateRequestSuccess.description,
            start_time: eventCreateRequestSuccess.start_time,
            duration: eventCreateRequestSuccess.duration,
            user_id: user[0]._id.toString(),
            is_solved: false,
            created_at: 'fake_value',
            updated_at: 'fake_value',
            id: 'fake_value',
          },
        },
        errors: null,
      })
      .end(done);
  });

  it('/events (POST) - should not create a event with invalid params', (done) => {
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', userToken)
      .send(null)
      .expect(412)
      .expect((res) => {
        res.body.errors.duration.properties = 'fake_properties';
        res.body.errors.start_time.properties = 'fake_properties';
        res.body.errors.name.properties = 'fake_properties';
      })
      .expect({
        message: 'event_create_precondition_failed',
        data: null,
        errors: {
          duration: {
            message: 'Duration can not be empty',
            name: 'ValidatorError',
            properties: 'fake_properties',
            kind: 'required',
            path: 'duration',
          },
          start_time: {
            message: 'Start time can not be empty',
            name: 'ValidatorError',
            properties: 'fake_properties',
            kind: 'required',
            path: 'start_time',
          },
          name: {
            message: 'Name can not be empty',
            name: 'ValidatorError',
            properties: 'fake_properties',
            kind: 'required',
            path: 'name',
          },
        },
      })
      .end(done);
  });

  it('/events (GET) - should retrieve events for a valid token', (done) => {
    return request(app.getHttpServer())
      .get('/events')
      .set('Authorization', userToken)
      .expect(200)
      .expect((res) => {
        res.body.data.events[0].created_at = 'fake_value';
        res.body.data.events[0].updated_at = 'fake_value';
      })
      .expect({
        message: 'event_search_by_user_id_success',
        data: {
          events: [
            {
              notification_id: null,
              name: eventCreateRequestSuccess.name,
              description: eventCreateRequestSuccess.description,
              start_time: eventCreateRequestSuccess.start_time,
              duration: eventCreateRequestSuccess.duration,
              created_at: 'fake_value',
              updated_at: 'fake_value',
              user_id: user[0]._id.toString(),
              is_solved: false,
              id: eventId,
            },
          ],
        },
        errors: null,
      })
      .end(done);
  });

  it('/events/{id} (PUT) - should not event with invalid token', (done) => {
    return request(app.getHttpServer())
      .put(`/events/${eventId}`)
      .send(eventUpdateRequestSuccess)
      .expect(401)
      .expect({
        message: 'token_decode_unauthorized',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events/{id} (PUT) - should not update event with user_id param', (done) => {
    return request(app.getHttpServer())
      .put(`/events/${eventId}`)
      .set('Authorization', userToken)
      .send({
        ...eventUpdateRequestSuccess,
        user_id: user[0]._id.toString() + 1,
      })
      .expect(412)
      .expect((res) => {
        res.body.errors.user_id.properties = 'fake_properties';
      })
      .expect({
        message: 'event_update_by_id_precondition_failed',
        data: null,
        errors: {
          user_id: {
            message: 'The field value can not be updated',
            name: 'ValidatorError',
            properties: 'fake_properties',
            kind: 'user defined',
            path: 'user_id',
          },
        },
      })
      .end(done);
  });

  it('/events/{id} (PUT) - should update event with valid params', (done) => {
    return request(app.getHttpServer())
      .put(`/events/${eventId}`)
      .set('Authorization', userToken)
      .send(eventUpdateRequestSuccess)
      .expect(200)
      .expect((res) => {
        res.body.data.event.created_at = 'fake_value';
        res.body.data.event.updated_at = 'fake_value';
      })
      .expect({
        message: 'event_update_by_id_success',
        data: {
          event: {
            notification_id: null,
            name: eventUpdateRequestSuccess.name,
            description: eventUpdateRequestSuccess.description,
            start_time: eventUpdateRequestSuccess.start_time,
            duration: eventUpdateRequestSuccess.duration,
            created_at: 'fake_value',
            updated_at: 'fake_value',
            user_id: user[0]._id.toString(),
            is_solved: eventUpdateRequestSuccess.is_solved,
            id: eventId,
          },
        },
        errors: null,
      })
      .end(done);
  });

  it('/events/{id} (DELETE) - should not delete event with invalid token', (done) => {
    return request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .send()
      .expect(401)
      .expect({
        message: 'token_decode_unauthorized',
        data: null,
        errors: null,
      })
      .end(done);
  });

  it('/events/{id} (DELETE) - should delete event with a valid token', (done) => {
    return request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .set('Authorization', userToken)
      .send()
      .expect(200)
      .expect({
        message: 'event_delete_by_id_success',
        data: null,
        errors: null,
      })
      .end(done);
  });
});
