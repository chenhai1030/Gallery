from django.conf.urls import url
from waterfall import views

urlpatterns = [
    url('imgs', views.image_list),
]