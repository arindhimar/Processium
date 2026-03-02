from rest_framework import authentication
from rest_framework import exceptions

class MiddlewareAuthentication(authentication.BaseAuthentication):
    """
    A custom DRF authentication class that simply relies on the `request.user` 
    already populated by our custom UserAuthenticationMiddleware.
    """
    def authenticate(self, request):
        django_request = request._request
        if not hasattr(django_request, 'user') or getattr(django_request.user, 'is_anonymous', True):
            return None
        return (django_request.user, None)
