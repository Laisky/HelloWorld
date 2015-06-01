from django.db import models


class Demo(models.Model):
    name = models.CharField(max_length=30)
    address = models.CharField(max_length=50)

    class Meta:
        ordering = ["name"]
