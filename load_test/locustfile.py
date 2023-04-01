import uuid
import json
from locust import SequentialTaskSet, task, between, HttpUser
from faker import Faker


class UserFactory:
    @staticmethod
    def create_fake_user():
        fake = Faker()
        type1_uuid = str(uuid.uuid1())
        user = {
            "username": fake.name(),
            "email": type1_uuid + '@email.com',
            "birth_date": str(fake.date_of_birth(minimum_age=18)),
            "password": "U$er321",
            "passwordConfirm": "U$er321"
        }
        return user


class ResponseChecker:
    @staticmethod
    def check_response_status(res, data):
        if not (200 <= res.status_code < 300):
            print('--------------------------------------')
            print('ERROR', res.json())
            print('DATA', data)
            print('--------------------------------------')


class CreateLoginAndApplySaving(SequentialTaskSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.login_data = None

    @task
    def create(self):
        fake_user = UserFactory.create_fake_user()
        res = self.client.post('/users', json=fake_user)
        ResponseChecker.check_response_status(res, fake_user)
        self.login_data = {
            "email": fake_user["email"],
            "password": fake_user["password"]
        }

    @task
    def login(self):
        res = self.client.post('/auth/login', json=self.login_data)
        ResponseChecker.check_response_status(res, self.login_data)
        while True:
            try:
                token = res.json().get("token")
                if token is not None:
                    self.user.jwt_one = token
                    break
            except (KeyError, json.JSONDecodeError):
                print('ERROR: ', res.json())
                self.wait(1)

    @task
    def apply(self):
        headers = {"Authorization": f"Bearer {self.user.jwt_one}"}
        value = {"value": "10"}
        res = self.client.post("/savings", headers=headers, json=value)
        ResponseChecker.check_response_status(res, self.user.jwt_one)


class CreateTwoUserLoginTransfer(SequentialTaskSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.debit_user_login_data = None
        self.credit_user_id = None

    @task
    def create(self):
        fake_user_one = UserFactory.create_fake_user()
        fake_user_two = UserFactory.create_fake_user()
        res_one = self.client.post('/users', json=fake_user_one)
        res_two = self.client.post('/users', json=fake_user_two)

        ResponseChecker.check_response_status(res_one, fake_user_one)
        ResponseChecker.check_response_status(res_two, fake_user_two)

        while True:
            self.user.debit_user_login_data = {
                "email": fake_user_one["email"],
                "password": fake_user_one["password"]
            }
            id = res_two.json().get("id")
            if id is not None:
                self.user.credit_user_id = id
                break

    @task
    def login(self):
        res = self.client.post(
            '/auth/login', json=self.user.debit_user_login_data)
        ResponseChecker.check_response_status(
            res, self.user.debit_user_login_data)

        while True:
            token = res.json().get("token")
            if token is not None:
                self.user.jwt_two = token
                break

    @task
    def transfer(self):
        headers = {"Authorization": f"Bearer {self.user.jwt_two}"}
        transaction = {
            "credited_user_id": self.user.credit_user_id,
            "value": "10"
        }
        res = self.client.post(
            "/transactions", headers=headers, json=transaction)
        ResponseChecker.check_response_status(res, transaction)


class MyHttpUser(HttpUser):
    host = "http://api:5000"
    jwt_one = None
    jwt_two = None
    wait_time = between(1, 3)
    tasks = [CreateLoginAndApplySaving, CreateTwoUserLoginTransfer]
