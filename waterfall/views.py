from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from waterfall.models import Waterfall
from waterfall.serializers import WaterfallSerializer

from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job

from PIL import Image

import os

try:
    # 实例化调度器
    scheduler = BackgroundScheduler()
    # 调度器使用DjangoJobStore()
    scheduler.add_jobstore(DjangoJobStore(), "default")

    # 设置定时任务，选择方式为interval，时间间隔为1s
    # 另一种方式为每天固定时间执行任务，对应代码为：
    # @register_job(scheduler, 'cron', day_of_week='mon-fri', hour='9', minute='30', second='10',id='task_time')
    @register_job(scheduler, "interval", seconds=10)
    def update_image_database():
        path = os.path.join(settings.MEDIA_ROOT, "img")
        for filename in os.listdir(path):
            # print(filename)
            filepath = os.path.join('media/img/', filename)
            im = Image.open(filepath)
            w, h = im.size
            filesize = os.path.getsize(filepath)
            waterfall = Waterfall(imgName=filename, imgUrl=filepath, size=formatSize(filesize),
                                  dimensions=str(w) + " X " + str(h))
            try:
                waterfall.save()
            except Exception as e:
                pass


    register_events(scheduler)
    scheduler.start()
except Exception as e:
    print(e)
    scheduler.shutdown()


# byte to kb\m\g
def formatSize(byte):
    try:
        byte = float(byte)
        kb = byte / 1024
    except Exception as e:
        print("Wrong format")
        print(e)
        return "Error"

    if kb >= 1024:
        M = kb / 1024
        if M >= 1024:
            G = M / 1024
            return "%dG" % G
        else:
            return "%dM" % M
    else:
        return "%dK" % kb


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


@csrf_exempt
def image_list(request):
    if request.method == 'GET':
        images = Waterfall.objects.all()
        serializer = WaterfallSerializer(images, many=True)
        return JSONResponse(serializer.data)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = WaterfallSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)
