import jwt
from rest_framework import authentication, exceptions
from django.conf import settings
from users.models.UserModel import User
from utils.jwt_utils import decode_access_token


class JWTAuthentication(authentication.BaseAuthentication):
    """
    Production-level DRF authentication backend.
    
    Extracts Bearer token from the Authorization header, decodes it,
    looks up the user, and validates the account is active.
    
    Returns (user, decoded_payload) on success.
    Returns None if no Authorization header is present (allows
    unauthenticated access for views with AllowAny).
    Raises AuthenticationFailed on invalid/expired tokens or inactive users.
    """

    AUTH_HEADER_PREFIX = 'Bearer'

    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header:
            return None

        parts = auth_header.split()

        if len(parts) != 2 or parts[0] != self.AUTH_HEADER_PREFIX:
            return None

        token = parts[1]

        if not token:
            return None

        return self._authenticate_token(token)

    def _authenticate_token(self, token):
        try:
            user_id = decode_access_token(token)
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token.')
        except Exception:
            raise exceptions.AuthenticationFailed('Token authentication failed.')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found.')

        if not user.is_active:
            raise exceptions.AuthenticationFailed('User account is deactivated.')

        return (user, {'user_id': str(user.id)})

    def authenticate_header(self, request):
        """
        Returns the WWW-Authenticate header value for 401 responses.
        """
        return 'Bearer realm="api"'
