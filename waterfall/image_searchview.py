# encoding: utf-8
from __future__ import absolute_import, division, print_function, unicode_literals
import json
from django.conf import settings
from django.core.paginator import InvalidPage, Paginator
from django.http import Http404, HttpResponse
from haystack.forms import ModelSearchForm
from haystack.query import EmptySearchQuerySet

RESULTS_PER_PAGE = getattr(settings, 'HAYSTACK_SEARCH_RESULTS_PER_PAGE', 20)


# from haystack.forms import FacetedSearchForm,
# from django.shortcuts import render

def search_keywords(request, load_all=True, form_class=ModelSearchForm, searchqueryset=None, extra_context=None,
                    results_per_page=None):
    """
    A more traditional view that also demonstrate an alternative
    way to use Haystack.

    Useful as an example of for basing heavily custom views off of.

    Also has the benefit of thread-safety, which the ``SearchView`` class may
    not be.

    Template:: ``search/search.html``
    Context::
        * form
          An instance of the ``form_class``. (default: ``ModelSearchForm``)
        * page
          The current page of search results.
        * paginator
          A paginator instance for the results.
        * query
          The query received by the form.
    """
    query = ''
    results = EmptySearchQuerySet()
    if request.GET.get('q'):
        form = form_class(request.GET, searchqueryset=searchqueryset, load_all=load_all)

        if form.is_valid():
            query = form.cleaned_data['q']
            results = form.search()
    else:
        form = form_class(searchqueryset=searchqueryset, load_all=load_all)

    paginator = Paginator(results, results_per_page or RESULTS_PER_PAGE)

    try:
        page = paginator.page(int(request.GET.get('page', 1)))
    except InvalidPage:
        result = {"code": 404, "msg": 'No file found！', "data": []}
        return HttpResponse(json.dumps(result), content_type="application/json")

    context = {
        'form': form,
        'page': page,
        'paginator': paginator,
        'query': query,
        'suggestion': None,
    }
    if results.query.backend.include_spelling:
        context['suggestion'] = form.get_suggestion()

    if extra_context:
        context.update(extra_context)

    jsondata = []
    print(len(page.object_list))
    for result in page.object_list:
        data = {
            'img_name': result.object.img_name,
            'src': result.object.src,
            # 'create_time': result.object.create_time,
            'style': result.object.style,
            'type': result.object.type
        }
        print(data)
        jsondata.append(data)
    result = {"code": 200, "msg": 'Search successfully！', "data": jsondata}
    return HttpResponse(json.dumps(result), content_type="application/json")
