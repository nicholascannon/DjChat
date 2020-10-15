from django.urls import path

from . import views

urlpatterns = [
    path('<chat_uuid>/', views.ChatMessageListView.as_view()),
    path('<chat_uuid>/delete/', views.ChatDestroyView.as_view()),
    path('', views.ChatListCreateView.as_view())
]
