import uuid
import json
from locust import SequentialTaskSet, task, constant, HttpUser
from faker import Faker


class CreateLoginAndApplySaving(SequentialTaskSet):
    host = "http://api:5000"
    wait_time = constant(1)

    def create_fake_user(self):
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

    @task
    def create(self):
        fake_user = self.create_fake_user()
        res = self.client.post('/users', json=fake_user)
        if not (200 <= res.status_code < 300):
            print('--------------------------------------')
            print('ERROR', json.dumps(json.loads(res.text), indent=4))
            print('--------------------------------------')
        self.login_data = {
            "email": fake_user["email"],
            "password": fake_user["password"]
        }

    @task
    def login(self):
        fake_user = self.login_data
        res = self.client.post('/auth/login', json=fake_user)

        if not (200 <= res.status_code < 300):
            print('--------------------------------------')
            print('ERROR', json.dumps(json.loads(res.text), indent=4))
            print('--------------------------------------')

        self.token = res.json()["token"]

    @task
    def apply(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        value = {
            "value": "10"
        }
        res = self.client.post("/savings", headers=headers, json=value)

        if not (200 <= res.status_code < 300):
            print('--------------------------------------')
            print('ERROR', json.dumps(json.loads(res.text), indent=4))
            print('--------------------------------------')


class MyHttpUser(HttpUser):
    host = "http://api:5000"
    wait_time = constant(1)
    tasks = [CreateLoginAndApplySaving]
