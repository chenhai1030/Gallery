from django.db import models

# Create your models here.


class Waterfall(models.Model):
    imgName = models.CharField(verbose_name='名称', max_length=255, unique=True)
    imgUrl = models.CharField(max_length=1024)
    dimensions = models.CharField(max_length=10)
    size = models.CharField(max_length=10)
    createTime = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)
    style = models.CharField(max_length=10)
    type = models.CharField(max_length=10)

    class Meta:
        verbose_name = 'Gallery'
        db_table = 'Waterfall_image'

    def __str__(self):
        return self.imgName
