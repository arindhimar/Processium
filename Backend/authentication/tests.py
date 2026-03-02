import uuid
import datetime
import jwt
from django.conf import settings
from django.test import TestCase, RequestFactory
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from users.models.UserModel import User
from utils.jwt_utils import generate_tokens
from authentication.authentication import JWTAuthentication


# =============================================================================
# JWTAuthentication Backend Tests
# =============================================================================

class JWTAuthenticationBackendTests(TestCase):
    """Tests for the JWTAuthentication DRF backend itself."""

    def setUp(self):
        self.factory = RequestFactory()
        self.backend = JWTAuthentication()
        self.user = User.objects.create(
            full_name="Auth Test User",
            email="authtest@example.com",
            password_hash="password123",
        )
        self.tokens = generate_tokens(self.user)

    def _make_request(self, auth_header=None):
        kwargs = {}
        if auth_header is not None:
            kwargs['HTTP_AUTHORIZATION'] = auth_header
        return self.factory.get('/', **kwargs)

    def test_valid_token_returns_user(self):
        request = self._make_request(f"Bearer {self.tokens['access_token']}")
        user, auth_info = self.backend.authenticate(request)
        self.assertEqual(user.id, self.user.id)
        self.assertEqual(auth_info['user_id'], str(self.user.id))

    def test_no_auth_header_returns_none(self):
        request = self._make_request()
        result = self.backend.authenticate(request)
        self.assertIsNone(result)

    def test_wrong_prefix_returns_none(self):
        request = self._make_request(f"Token {self.tokens['access_token']}")
        result = self.backend.authenticate(request)
        self.assertIsNone(result)

    def test_empty_header_returns_none(self):
        request = self._make_request("")
        result = self.backend.authenticate(request)
        self.assertIsNone(result)

    def test_bearer_only_no_token_returns_none(self):
        request = self._make_request("Bearer")
        result = self.backend.authenticate(request)
        self.assertIsNone(result)

    def test_expired_token_raises_auth_failed(self):
        secret = settings.SECRET_KEY
        payload = {
            'user_id': str(self.user.id),
            'exp': datetime.datetime.utcnow() - datetime.timedelta(seconds=1),
            'iat': datetime.datetime.utcnow() - datetime.timedelta(minutes=16),
            'type': 'access'
        }
        expired_token = jwt.encode(payload, secret, algorithm='HS256')
        request = self._make_request(f"Bearer {expired_token}")
        with self.assertRaises(AuthenticationFailed) as ctx:
            self.backend.authenticate(request)
        self.assertIn('expired', str(ctx.exception.detail).lower())

    def test_malformed_token_raises_auth_failed(self):
        request = self._make_request("Bearer not.a.valid.jwt.at.all")
        with self.assertRaises(AuthenticationFailed):
            self.backend.authenticate(request)

    def test_refresh_token_used_as_access_raises_auth_failed(self):
        request = self._make_request(f"Bearer {self.tokens['refresh_token']}")
        with self.assertRaises(AuthenticationFailed):
            self.backend.authenticate(request)

    def test_token_for_deleted_user_raises_auth_failed(self):
        tokens = generate_tokens(self.user)
        self.user.delete()
        request = self._make_request(f"Bearer {tokens['access_token']}")
        with self.assertRaises(AuthenticationFailed) as ctx:
            self.backend.authenticate(request)
        self.assertIn('not found', str(ctx.exception.detail).lower())

    def test_token_for_inactive_user_raises_auth_failed(self):
        self.user.is_active = False
        self.user.save()
        request = self._make_request(f"Bearer {self.tokens['access_token']}")
        with self.assertRaises(AuthenticationFailed) as ctx:
            self.backend.authenticate(request)
        self.assertIn('deactivated', str(ctx.exception.detail).lower())

    def test_authenticate_header_returns_bearer(self):
        request = self._make_request()
        header = self.backend.authenticate_header(request)
        self.assertIn('Bearer', header)


# =============================================================================
# API Endpoint Tests
# =============================================================================

class RegisterAPITests(APITestCase):
    """Tests for POST /api/auth/register"""

    def setUp(self):
        self.url = '/api/auth/register'
        self.valid_data = {
            'full_name': 'Arin Dhimar',
            'email': 'arin@example.com',
            'password': 'strongpassword123'
        }

    def test_register_success(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'User registered successfully')
        self.assertEqual(response.data['user']['email'], self.valid_data['email'])
        self.assertFalse(User.objects.get(email=self.valid_data['email']).is_admin)

    def test_register_duplicate_email(self):
        self.client.post(self.url, self.valid_data, format='json')
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email already exists.')

    def test_register_missing_full_name(self):
        data = {'email': 'a@b.com', 'password': 'pass123'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('full_name', response.data)

    def test_register_missing_password(self):
        data = {'full_name': 'Test', 'email': 'a@b.com'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_register_empty_body(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_invalid_email_format(self):
        data = {'full_name': 'Test', 'email': 'not-an-email', 'password': 'pass123'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


class LoginAPITests(APITestCase):
    """Tests for POST /api/auth/login"""

    def setUp(self):
        self.url = '/api/auth/login'
        self.user = User.objects.create(
            full_name='Test User',
            email='test@example.com',
            password_hash='correctpassword',
        )

    def test_login_success(self):
        data = {'email': 'test@example.com', 'password': 'correctpassword'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)
        self.assertIn('refresh_token', response.data)
        self.assertIn('user', response.data)

    def test_login_wrong_password(self):
        data = {'email': 'test@example.com', 'password': 'wrongpassword'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid email or password.')

    def test_login_non_existent_email(self):
        data = {'email': 'ghost@example.com', 'password': 'password123'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid email or password.')

    def test_login_inactive_user(self):
        self.user.is_active = False
        self.user.save()
        data = {'email': 'test@example.com', 'password': 'correctpassword'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], 'Account is deactivated.')

    def test_login_missing_password(self):
        data = {'email': 'test@example.com'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_empty_body(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RefreshTokenAPITests(APITestCase):
    """Tests for POST /api/auth/refresh"""

    def setUp(self):
        self.url = '/api/auth/refresh'
        self.user = User.objects.create(
            full_name='Test User',
            email='test@example.com',
            password_hash='password123',
        )
        self.tokens = generate_tokens(self.user)

    def test_refresh_success(self):
        data = {'refresh_token': self.tokens['refresh_token']}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)

    def test_refresh_invalid_token(self):
        data = {'refresh_token': 'garbage.token.here'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid or expired refresh token.')

    def test_refresh_missing_token(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh_token', response.data)

    def test_refresh_with_access_token_instead(self):
        data = {'refresh_token': self.tokens['access_token']}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid or expired refresh token.')


class LogoutAPITests(APITestCase):
    """Tests for POST /api/auth/logout"""

    def setUp(self):
        self.url = '/api/auth/logout'
        self.user = User.objects.create(
            full_name='Test User',
            email='test@example.com',
            password_hash='password123',
        )
        self.tokens = generate_tokens(self.user)

    def test_logout_success(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.tokens['access_token']}")
        data = {'refresh_token': self.tokens['refresh_token']}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logged out successfully.')

    def test_logout_unauthenticated(self):
        data = {'refresh_token': self.tokens['refresh_token']}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_missing_refresh_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.tokens['access_token']}")
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CurrentUserAPITests(APITestCase):
    """Tests for GET /api/auth/me"""

    def setUp(self):
        self.url = '/api/auth/me'
        self.user = User.objects.create(
            full_name='Test User',
            email='test@example.com',
            password_hash='password123',
        )
        self.tokens = generate_tokens(self.user)

    def test_me_success(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.tokens['access_token']}")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_me_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_with_expired_token(self):
        secret = settings.SECRET_KEY
        payload = {
            'user_id': str(self.user.id),
            'exp': datetime.datetime.utcnow() - datetime.timedelta(seconds=1),
            'iat': datetime.datetime.utcnow() - datetime.timedelta(minutes=16),
            'type': 'access'
        }
        expired_token = jwt.encode(payload, secret, algorithm='HS256')
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {expired_token}")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
