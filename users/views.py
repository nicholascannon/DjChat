from rest_framework import status as s
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login, logout, authenticate

from .serializers import UserSerializer, LoginSerializer


@api_view(['POST'])
def register(request: Request) -> Response:
    if request.user.is_authenticated:
        return Response(status=s.HTTP_400_BAD_REQUEST)

    user = UserSerializer(data=request.data)
    if user.is_valid(raise_exception=True):
        user.save()
        return Response({'msg': 'Created User'}, status=s.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request: Request) -> Response:
    if request.user.is_authenticated:
        return Response(status=s.HTTP_400_BAD_REQUEST)

    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = authenticate(request, username=serializer.validated_data['username'],
                            password=serializer.validated_data['password'])

        if user:
            login(request, user)
            return Response()

        return Response({'msg': 'Invalid credentials'}, status=s.HTTP_403_FORBIDDEN)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request: Request) -> Response:
    logout(request)
    return Response()


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request: Request) -> Response:
    user = UserSerializer(instance=request.user,
                          data=request.data, partial=True)
    if user.is_valid(raise_exception=True):
        user.save()
        return Response()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def status(request: Request) -> Response:
    user = UserSerializer(instance=request.user)
    return Response(user.data)
