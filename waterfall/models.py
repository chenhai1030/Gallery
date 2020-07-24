from django.db import models

# Create your models here.


class Waterfall(models.Model):
    img_name = models.CharField(verbose_name='名称', max_length=255, unique=True)
    src = models.CharField(max_length=1024)
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)
    style = models.CharField(max_length=10)
    type = models.CharField(max_length=10)

    class Meta:
        verbose_name = '图片瀑布'
        db_table = 'Waterfall_image'

    def __str__(self):
        return self.img_name
