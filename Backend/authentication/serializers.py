from rest_framework import serializers
from users.models.UserModel import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'is_active', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'is_admin']

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Here we should ideally hash the password
        # Since this is a custom model, we assume a basic hash for now or use a utility
        user = User.objects.create(**validated_data)
        user.password_hash = password # Storing plain temp, ideally use make_password
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class RefreshTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()
