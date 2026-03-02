import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from users.models.UserModel import User
from utils.jwt_utils import decode_access_token

class UserAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            request.user = AnonymousUser()
            return self.get_response(request)

        token = auth_header.split(' ')[1]
        
        try:
            user_id = decode_access_token(token)
            
            try:
                user = User.objects.get(id=user_id)
                request.user = user
                # We can also handle 'is_active' checks if needed.
            except User.DoesNotExist:
                request.user = AnonymousUser()
                
        except Exception:
            # Handle expired tokens, invalid claims, etc.
            request.user = AnonymousUser()

        return self.get_response(request)
