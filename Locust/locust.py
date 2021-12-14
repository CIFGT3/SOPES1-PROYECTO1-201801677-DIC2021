import time

from locust import HttpUser, task

class Test(HttpUser):
    @task
    def prueba1(self):
        self.client.get("/memo")
    
    def prueba_home(self):
        self.client.get("/")