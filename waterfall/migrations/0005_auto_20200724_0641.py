# Generated by Django 3.0.8 on 2020-07-24 06:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('waterfall', '0004_auto_20200722_0556'),
    ]

    operations = [
        migrations.RenameField(
            model_name='waterfall',
            old_name='img_url',
            new_name='src',
        ),
    ]
