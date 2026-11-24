# Security Specification — MAISON LUMIÈRE

## 1. Data Invariants
1. **Admin-Only Catalog Control**: Only verified administrators (`sonukhajotiya01@gmail.com` with `email_verified == true` or `/admins/{uid}`) may create, update, or delete `/collections`, `/products`, or `/settings`.
2. **PII Isolation**: User emails, shipping addresses, and subscriber lists are never publicly readable. `/users/{uid}` is accessible only by the owner or an admin; `/newsletter` reads/lists are restricted strictly to admins.
3. **Owner-Scoped Shopping State**: `/users/{uid}/cart` and `/users/{uid}/wishlist` enforce `request.auth.uid == uid`, `email_verified == true`, and validated product references.
4. **Order Integrity & Terminal State Lock**: Users can only create orders with `userId == request.auth.uid` and `status == 'pending'`. Users cannot alter order status, `totalAmount`, or `userId`. Delivered/cancelled orders are locked except for admin remediation.
5. **Immutable Timestamps & Strict Keys**: Every write validates exact required/allowed keys (`hasAll` + `hasOnly`), string `.size()` bounds, ID regexes, and `createdAt == request.time` on creation.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Collection Write**: `POST /collections/summer-linen` without auth -> `PERMISSION_DENIED`.
2. **Non-Admin Product Price Tamper**: Authenticated customer updating `/products/prod-1` price to `1` -> `PERMISSION_DENIED`.
3. **Shadow Field Injection on User Profile**: Creating `/users/{uid}` with extra `{ isAdmin: true }` -> `PERMISSION_DENIED`.
4. **Cross-User Cart Read/Write**: User A attempting to read or write `/users/{userB}/cart/item1` -> `PERMISSION_DENIED`.
5. **Unverified Email Spoof**: User with `email: 'sonukhajotiya01@gmail.com'` and `email_verified: false` attempting admin mutation -> `PERMISSION_DENIED`.
6. **Oversized Document ID Poisoning**: Creating `/orders/<200-char-junk-id>` -> `PERMISSION_DENIED`.
7. **Order Status Shortcutting**: Customer updating `/orders/{orderId}` `{ status: 'delivered' }` -> `PERMISSION_DENIED`.
8. **Order Spoofing Another User**: User A creating `/orders/ord1` with `{ userId: userB }` -> `PERMISSION_DENIED`.
9. **Blanket Order List Scraping**: Non-admin listing `/orders` without `userId == request.auth.uid` filter -> `PERMISSION_DENIED`.
10. **Newsletter Subscriber Enumeration**: Non-admin listing `/newsletter` -> `PERMISSION_DENIED`.
11. **Oversized String DoS**: Creating `/newsletter/sub1` with 5,000-character email string -> `PERMISSION_DENIED`.
12. **Cart Quantity / Price Overflow**: Creating `/users/{uid}/cart/item1` with `{ quantity: 9999 }` or `{ price: -50 }` -> `PERMISSION_DENIED`.
