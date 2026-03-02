import jwt
import datetime
from django.conf import settings

def generate_tokens(user):
    """
    Generate an access token and a refresh token for the given user.
    """
    secret = getattr(settings, 'SECRET_KEY', '')
    
    access_payload = {
        'user_id': str(user.id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        'iat': datetime.datetime.utcnow(),
        'type': 'access'
    }
    
    refresh_payload = {
        'user_id': str(user.id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'type': 'refresh'
    }
    
    access_token = jwt.encode(access_payload, secret, algorithm='HS256')
    refresh_token = jwt.encode(refresh_payload, secret, algorithm='HS256')
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_in': 900
    }

def decode_access_token(token):
    """
    Decode an access token and return the user_id if valid.
    Raises jwt exceptions if expired or invalid.
    """
    secret = getattr(settings, 'SECRET_KEY', '')
    payload = jwt.decode(token, secret, algorithms=['HS256'])
    
    if payload.get('type') != 'access':
        raise jwt.InvalidTokenError("Invalid token type")
        
    return payload.get('user_id')

def decode_refresh_token(token):
    """
    Decode a refresh token and return the user_id if valid.
    Raises jwt exceptions if expired or invalid.
    """
    secret = getattr(settings, 'SECRET_KEY', '')
    payload = jwt.decode(token, secret, algorithms=['HS256'])
    
    if payload.get('type') != 'refresh':
        raise jwt.InvalidTokenError("Invalid token type")
        
    return payload.get('user_id')
