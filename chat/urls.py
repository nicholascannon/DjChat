from django.urls import path

from . import views

urlpatterns = [
    path('<chat_uuid>/', views.ChatMessageListView.as_view())
]
