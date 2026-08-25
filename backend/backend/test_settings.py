from .settings import *

# Use the same database for tests (don't create test DB)
DATABASES['default']['TEST'] = {
    'NAME': DATABASES['default']['NAME'],
    'MIRROR': 'default',
}

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Faster password hashing for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Disable CORS for tests
CORS_ALLOW_ALL_ORIGINS = True
