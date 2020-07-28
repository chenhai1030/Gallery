from django.conf.urls import url
from waterfall import views
from waterfall import image_searchview

urlpatterns = [
    url('imgs', views.image_list),
    url('search', image_searchview.search_keywords),
]