AUTHENTICATION ARCHITECTURE SUMMARY

This system uses a hybrid approach: JWT for stateless identity + server-side
sessions for control, security, and revocation.

CORE IDEAS
- JWT alone is not trusted.
- Every login creates a server-side session.
- JWT only carries userId + sessionId.
- Session is the source of truth.

TOKENS
1. Access Token
   - Short-lived (10–15 minutes)
   - Sent with every API request
   - Contains: userId, sessionId

2. Refresh Token
   - Long-lived (days)
   - Used only to get new access tokens
   - Hashed and stored in DB
   - Rotated on every use

SESSION
- Created on login
- Stored in MongoDB (persistent truth)
- Cached in Redis (fast access)
- Linked to:
  - userId
  - refreshToken hash
  - deviceId
  - ip
  - expiration
  - revoked flag

REDIS vs DATABASE
- Redis:
  - Fast lookup for active sessions
  - Used on every authenticated request
- MongoDB:
  - Permanent storage
  - Audit logs
  - Used if Redis misses or restarts

AUTH FLOW
1. Login
   - Validate credentials
   - Create session in DB
   - Cache session in Redis
   - Issue access + refresh tokens

2. Authenticated Request
   - Verify access token signature
   - Extract sessionId
   - Check session in Redis
   - If missing, check DB and re-cache
   - Reject if revoked/expired

3. Refresh Token
   - Validate refresh token
   - Match against stored hash
   - Rotate refresh token
   - Issue new access token

4. Logout
   - Revoke session in DB
   - Remove session from Redis
   - All tokens become useless

WHY THIS WORKS
- Supports logout and device-based sessions
- Prevents stolen token abuse
- Scales with Redis
- Keeps audit trail in DB

KEY RULE
JWT proves identity.
Session decides permission.
