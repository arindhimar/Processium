from django.test import TestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser
from unittest.mock import patch, MagicMock
from users.models.UserModel import User
from users.middleware import UserAuthenticationMiddleware
import uuid

class UserAuthenticationMiddlewareTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.get_response = MagicMock()
        self.middleware = UserAuthenticationMiddleware(self.get_response)
        
        # Create a test user
        self.user_uuid = uuid.uuid4()
        self.user = User.objects.create(
            id=self.user_uuid,
            full_name="Test User",
            email="test@example.com",
            password_hash="hashed_password",
        )

    def test_no_authorization_header(self):
        request = self.factory.get('/')
        self.middleware(request)
        
        self.assertIsInstance(request.user, AnonymousUser)
        self.get_response.assert_called_once_with(request)

    @patch('users.middleware.decode_access_token')
    def test_invalid_authorization_header(self, mock_decode_access_token):
        # Mock decode to raise an error
        mock_decode_access_token.side_effect = Exception("Invalid token")
        
        request = self.factory.get('/', HTTP_AUTHORIZATION='Bearer invalid_token')
        self.middleware(request)
        
        self.assertIsInstance(request.user, AnonymousUser)
        self.get_response.assert_called_once_with(request)

    @patch('users.middleware.decode_access_token')
    def test_valid_authorization_header_user_exists(self, mock_decode_access_token):
        # Mock successful decode
        mock_decode_access_token.return_value = str(self.user_uuid)
        
        request = self.factory.get('/', HTTP_AUTHORIZATION='Bearer valid_token')
        self.middleware(request)
        
        self.assertEqual(request.user, self.user)
        self.get_response.assert_called_once_with(request)

    @patch('users.middleware.decode_access_token')
    def test_valid_authorization_header_user_does_not_exist(self, mock_decode_access_token):
        non_existent_uuid = str(uuid.uuid4())
        mock_decode_access_token.return_value = non_existent_uuid
        
        request = self.factory.get('/', HTTP_AUTHORIZATION='Bearer valid_token')
        self.middleware(request)
        
        self.assertIsInstance(request.user, AnonymousUser)
        self.get_response.assert_called_once_with(request)
