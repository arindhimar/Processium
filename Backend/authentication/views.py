from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.models.UserModel import User
from authentication.serializers import RegisterSerializer, LoginSerializer, RefreshTokenSerializer, UserSerializer
from utils.jwt_utils import generate_tokens, decode_refresh_token
from authentication.authentication import MiddlewareAuthentication

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
            
        if 'email' in serializer.errors and any('already exists' in str(err).lower() for err in serializer.errors['email']):
             return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
             
        if 'email' in serializer.errors and any(err.code == 'unique' for err in serializer.errors['email']):
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
                if user.password_hash != password:
                    return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
                
                if not user.is_active:
                    return Response({"error": "Account is deactivated."}, status=status.HTTP_403_FORBIDDEN)
                
                tokens = generate_tokens(user)
                return Response({
                    "access_token": tokens['access_token'],
                    "refresh_token": tokens['refresh_token'],
                    "expires_in": tokens['expires_in'],
                    "user": UserSerializer(user).data
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)
        if serializer.is_valid():
            refresh_token = serializer.validated_data['refresh_token']
            try:
                user_id = decode_refresh_token(refresh_token)
                user = User.objects.get(id=user_id)
                tokens = generate_tokens(user)
                
                return Response({
                    "access_token": tokens['access_token'],
                    "expires_in": tokens['expires_in']
                }, status=status.HTTP_200_OK)
            except Exception:
                return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [MiddlewareAuthentication]

    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [MiddlewareAuthentication]

    def get(self, request):
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
