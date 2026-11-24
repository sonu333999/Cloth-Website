/**
 * Firestore Security Rules Verification Suite (Dirty Dozen Adversarial Payloads)
 * Documents and verifies expected PERMISSION_DENIED outcomes against firestore.rules.
 */

export interface AdversarialCase {
  id: string;
  title: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_PAYLOADS: AdversarialCase[] = [
  {
    id: 'DD-01',
    title: 'Unauthenticated Collection Write',
    operation: 'create',
    path: '/collections/summer-linen',
    auth: null,
    payload: { id: 'summer-linen', name: 'SUMMER LINEN' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-02',
    title: 'Non-Admin Product Price Tamper',
    operation: 'update',
    path: '/products/prod-summer-1',
    auth: { uid: 'customer-1', email: 'guest@example.com', email_verified: true },
    payload: { price: 1 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-03',
    title: 'Shadow Field Injection on User Profile',
    operation: 'create',
    path: '/users/customer-1',
    auth: { uid: 'customer-1', email: 'guest@example.com', email_verified: true },
    payload: { uid: 'customer-1', name: 'Guest', email: 'guest@example.com', isAdmin: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-04',
    title: 'Cross-User Cart Write',
    operation: 'create',
    path: '/users/victim-uid/cart/item-1',
    auth: { uid: 'attacker-uid', email: 'attacker@example.com', email_verified: true },
    payload: { userId: 'victim-uid', productId: 'prod-1', quantity: 1 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-05',
    title: 'Unverified Email Admin Spoof',
    operation: 'create',
    path: '/collections/spoofed',
    auth: { uid: 'spoof-uid', email: 'sonukhajotiya01@gmail.com', email_verified: false },
    payload: { id: 'spoofed', name: 'SPOOF' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-06',
    title: 'Oversized Document ID Poisoning',
    operation: 'create',
    path: `/orders/${'a'.repeat(200)}`,
    auth: { uid: 'customer-1', email: 'guest@example.com', email_verified: true },
    payload: { userId: 'customer-1', status: 'pending' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-07',
    title: 'Order Status Shortcutting by Customer',
    operation: 'update',
    path: '/orders/order-101',
    auth: { uid: 'customer-1', email: 'guest@example.com', email_verified: true },
    payload: { status: 'delivered' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-08',
    title: 'Order Impersonation (Another User UID)',
    operation: 'create',
    path: '/orders/order-102',
    auth: { uid: 'attacker-uid', email: 'attacker@example.com', email_verified: true },
    payload: { userId: 'victim-uid', status: 'pending', totalAmount: 4999 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-09',
    title: 'Blanket Order List Scraping',
    operation: 'list',
    path: '/orders',
    auth: { uid: 'customer-1', email: 'guest@example.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-10',
    title: 'Newsletter Subscriber Enumeration by Non-Admin',
    operation: 'list',
    path: '/newsletter',
    auth: { uid: 'customer-1', email: 'guest@example.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-11',
    title: 'Oversized Email DoS in Newsletter',
    operation: 'create',
    path: '/newsletter/sub-1',
    auth: null,
    payload: { email: `${'x'.repeat(500)}@example.com`, status: 'subscribed' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-12',
    title: 'Cart Quantity Overflow',
    operation: 'create',
    path: '/users/customer-1/cart/item-overflow',
    auth: { uid: 'customer-1', email: 'guest@example.com', email_verified: true },
    payload: { userId: 'customer-1', productId: 'prod-1', quantity: 9999, price: 4999 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
