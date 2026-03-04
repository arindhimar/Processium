import jwt
import datetime
from django.conf import settings

def generate_tokens(user):
    """
    Generate an access token and a refresh token for the given user.
    """
    secret = getattr(settings, 'JWT_SECRET', settings.SECRET_KEY)
    algorithm = getattr(settings, 'JWT_ALGORITHM', 'HS256')
    access_ttl = getattr(settings, 'JWT_ACCESS_TTL', 900)
    refresh_ttl = getattr(settings, 'JWT_REFRESH_TTL', 604800)

    now = datetime.datetime.utcnow()

    access_payload = {
        'user_id': str(user.id),
        'exp': now + datetime.timedelta(seconds=access_ttl),
        'iat': now,
        'type': 'access'
    }

    refresh_payload = {
        'user_id': str(user.id),
        'exp': now + datetime.timedelta(seconds=refresh_ttl),
        'iat': now,
        'type': 'refresh'
    }

    access_token = jwt.encode(access_payload, secret, algorithm=algorithm)
    refresh_token = jwt.encode(refresh_payload, secret, algorithm=algorithm)

    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_in': access_ttl
    }

def decode_access_token(token):
    """
    Decode an access token and return the user_id if valid.
    Raises jwt exceptions if expired or invalid.
    """
    secret = getattr(settings, 'JWT_SECRET', settings.SECRET_KEY)
    algorithm = getattr(settings, 'JWT_ALGORITHM', 'HS256')
    payload = jwt.decode(token, secret, algorithms=[algorithm])
    
    if payload.get('type') != 'access':
        raise jwt.InvalidTokenError("Invalid token type")
        
    return payload.get('user_id')

def decode_refresh_token(token):
    """
    Decode a refresh token and return the user_id if valid.
    Raises jwt exceptions if expired or invalid.
    """
    secret = getattr(settings, 'JWT_SECRET', settings.SECRET_KEY)
    algorithm = getattr(settings, 'JWT_ALGORITHM', 'HS256')
    payload = jwt.decode(token, secret, algorithms=[algorithm])

    if payload.get('type') != 'refresh':
        raise jwt.InvalidTokenError("Invalid token type")
        
    return payload.get('user_id')
