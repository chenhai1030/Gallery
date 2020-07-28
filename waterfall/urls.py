from django.conf.urls import url
from waterfall import views
from waterfall import searchview

urlpatterns = [
    url('imgs', views.image_list),
    url('search', searchview.search_keywords),
]