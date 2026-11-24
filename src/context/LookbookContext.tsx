import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleAuthProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { DEFAULT_COLLECTIONS } from '../data/collections';
import { DEFAULT_PRODUCTS } from '../data/products';
import {
  ActivePage,
  BrandSettings,
  CartItem,
  FashionCollection,
  NewsletterSubscriber,
  Order,
  OrderStatus,
  Product,
  WishlistItem,
} from '../types/fashion';

const BOOTSTRAPPED_ADMIN_EMAIL = 'sonukhajotiya01@gmail.com';

interface LookbookContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  brand: BrandSettings;
  collections: FashionCollection[];
  products: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  subscribers: NewsletterSubscriber[];
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  activeCarouselIndex: number;
  setActiveCarouselIndex: (index: number) => void;
  selectedCollection: FashionCollection | null;
  setSelectedCollection: (col: FashionCollection | null) => void;
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  legalModal: 'privacy' | 'terms' | null;
  setLegalModal: (modal: 'privacy' | 'terms' | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  addToCart: (product: Product, size: string, color: string) => Promise<void>;
  updateCartQuantity: (cartItemId: string, delta: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  placeOrder: (customerName: string, shippingAddress: string) => Promise<string | null>;
  subscribeNewsletter: (email: string) => Promise<void>;
  // Admin operations
  seedDefaultCatalogToFirestore: () => Promise<void>;
  saveCollection: (col: Omit<FashionCollection, 'id'> & { id?: string }) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  saveProduct: (prod: Omit<Product, 'id'> & { id?: string }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteSubscriber: (subscriberId: string) => Promise<void>;
  updateBrandSettings: (settings: BrandSettings) => Promise<void>;
  isCloudSynced: boolean;
}

const LookbookContext = createContext<LookbookContextValue | null>(null);

export const LookbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [brand, setBrand] = useState<BrandSettings>({
    brandName: 'MAISON LUMIÈRE',
    tagline: 'Contemporary Parisian Lookbook & Atelier',
  });

  const [collections, setCollections] = useState<FashionCollection[]>(DEFAULT_COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(1); // Start on Street Layers or Summer Linen
  const [selectedCollection, setSelectedCollection] = useState<FashionCollection | null>(null);

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  // 1. Firebase Auth listener + user profile upsert + admin check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const isBootstrapped =
            firebaseUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL &&
            firebaseUser.emailVerified;

          let hasAdminDoc = false;
          try {
            const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
            hasAdminDoc = adminSnap.exists();
          } catch {
            hasAdminDoc = false;
          }

          setIsAdmin(Boolean(isBootstrapped || hasAdminDoc));

          // Sync user profile document safely
          if (firebaseUser.emailVerified) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const existingUser = await getDoc(userRef);
            if (!existingUser.exists()) {
              await setDoc(userRef, {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'Atelier Guest',
                email: firebaseUser.email || '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            } else {
              await updateDoc(userRef, {
                name: firebaseUser.displayName || 'Atelier Guest',
                email: firebaseUser.email || '',
                updatedAt: serverTimestamp(),
              });
            }
          }
        } catch (err) {
          console.warn('User profile sync note:', err);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // 2. Public Collections & Products & Brand Settings live sync
  useEffect(() => {
    const colQuery = query(collection(db, 'collections'), orderBy('sortOrder', 'asc'));
    const unsubCollections = onSnapshot(
      colQuery,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => d.data() as FashionCollection);
          setCollections(docs);
          setIsCloudSynced(true);
        }
      },
      (err) => {
        console.warn('Collections snapshot notice:', err.message);
      }
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => d.data() as Product);
          setProducts(docs);
        }
      },
      (err) => {
        console.warn('Products snapshot notice:', err.message);
      }
    );

    const unsubBrand = onSnapshot(
      doc(db, 'settings', 'brand'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as BrandSettings;
          if (data.brandName) {
            setBrand({
              brandName: data.brandName,
              tagline: data.tagline || 'Contemporary Parisian Lookbook & Atelier',
            });
          }
        }
      },
      () => {
        // Settings doc not yet created; retain defaults
      }
    );

    return () => {
      unsubCollections();
      unsubProducts();
      unsubBrand();
    };
  }, []);

  // 3. Authenticated User Cart, Wishlist & Orders sync
  useEffect(() => {
    if (!authReady || !user) {
      return;
    }

    const cartPath = `users/${user.uid}/cart`;
    const unsubCart = onSnapshot(
      query(collection(db, 'users', user.uid, 'cart'), where('userId', '==', user.uid)),
      (snap) => {
        const items: CartItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CartItem, 'id'>),
        }));
        setCart(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, cartPath)
    );

    const wishlistPath = `users/${user.uid}/wishlist`;
    const unsubWishlist = onSnapshot(
      query(collection(db, 'users', user.uid, 'wishlist'), where('userId', '==', user.uid)),
      (snap) => {
        const items: WishlistItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<WishlistItem, 'id'>),
        }));
        setWishlist(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, wishlistPath)
    );

    const ordersQuery = isAdmin
      ? query(collection(db, 'orders'))
      : query(collection(db, 'orders'), where('userId', '==', user.uid));

    const unsubOrders = onSnapshot(
      ordersQuery,
      (snap) => {
        const list: Order[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            shippingAddress: data.shippingAddress,
            items: data.items,
            totalAmount: data.totalAmount,
            status: data.status,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? undefined,
          };
        });
        setOrders(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'orders')
    );

    let unsubSubscribers = () => {};
    if (isAdmin) {
      unsubSubscribers = onSnapshot(
        collection(db, 'newsletter'),
        (snap) => {
          const subs: NewsletterSubscriber[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              email: data.email,
              status: data.status,
              createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? undefined,
            };
          });
          setSubscribers(subs);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'newsletter')
      );
    } else {
      setSubscribers([]);
    }

    return () => {
      unsubCart();
      unsubWishlist();
      unsubOrders();
      unsubSubscribers();
    };
  }, [authReady, user, isAdmin]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      showToast(`Welcome, ${cred.user.displayName || cred.user.email}`);
      return cred.user;
    } catch (err) {
      console.error('Sign-in cancelled or failed:', err);
      showToast('Sign-in was cancelled or blocked by popup blocker.');
      return null;
    }
  }, [showToast]);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setSubscribers([]);
    if (activePage === 'admin') {
      setActivePage('home');
    }
    showToast('Signed out of Maison Lumière.');
  }, [activePage, showToast]);

  const addToCart = useCallback(
    async (product: Product, size: string, color: string) => {
      const safeId = `${product.id}_${size.replace(/[^a-zA-Z0-9]/g, '')}_${color.replace(/[^a-zA-Z0-9]/g, '')}`;

      if (!user) {
        setCart((prev) => {
          const existing = prev.find((i) => i.id === safeId);
          if (existing) {
            return prev.map((i) =>
              i.id === safeId ? { ...i, quantity: Math.min(20, i.quantity + 1) } : i
            );
          }
          return [
            ...prev,
            {
              id: safeId,
              productId: product.id,
              collectionId: product.collectionId,
              name: product.name,
              price: product.price,
              image: product.image,
              size,
              color,
              quantity: 1,
            },
          ];
        });
        showToast(`${product.name} added to bag`);
        setIsBagOpen(true);
        return;
      }

      const itemPath = `users/${user.uid}/cart/${safeId}`;
      try {
        const ref = doc(db, 'users', user.uid, 'cart', safeId);
        const existingSnap = await getDoc(ref);
        if (existingSnap.exists()) {
          const currentQty = (existingSnap.data().quantity as number) || 1;
          await updateDoc(ref, {
            quantity: Math.min(20, currentQty + 1),
            size,
            color,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, {
            userId: user.uid,
            productId: product.id,
            collectionId: product.collectionId,
            name: product.name,
            price: product.price,
            image: product.image,
            size,
            color,
            quantity: 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        showToast(`${product.name} added to bag`);
        setIsBagOpen(true);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, itemPath);
      }
    },
    [user, showToast]
  );

  const updateCartQuantity = useCallback(
    async (cartItemId: string, delta: number) => {
      const target = cart.find((i) => i.id === cartItemId);
      if (!target) return;
      const nextQty = target.quantity + delta;

      if (!user) {
        if (nextQty <= 0) {
          setCart((prev) => prev.filter((i) => i.id !== cartItemId));
        } else {
          setCart((prev) =>
            prev.map((i) =>
              i.id === cartItemId ? { ...i, quantity: Math.min(20, nextQty) } : i
            )
          );
        }
        return;
      }

      const itemPath = `users/${user.uid}/cart/${cartItemId}`;
      try {
        const ref = doc(db, 'users', user.uid, 'cart', cartItemId);
        if (nextQty <= 0) {
          await deleteDoc(ref);
        } else {
          await updateDoc(ref, {
            quantity: Math.min(20, nextQty),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, itemPath);
      }
    },
    [cart, user]
  );

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      if (!user) {
        setCart((prev) => prev.filter((i) => i.id !== cartItemId));
        return;
      }
      const itemPath = `users/${user.uid}/cart/${cartItemId}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'cart', cartItemId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, itemPath);
      }
    },
    [user]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((w) => w.productId === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product: Product) => {
      const exists = wishlist.find((w) => w.productId === product.id);
      if (!user) {
        if (exists) {
          setWishlist((prev) => prev.filter((w) => w.productId !== product.id));
          showToast(`Removed ${product.name} from wishlist`);
        } else {
          setWishlist((prev) => [
            ...prev,
            {
              id: product.id,
              productId: product.id,
              collectionId: product.collectionId,
              name: product.name,
              price: product.price,
              image: product.image,
            },
          ]);
          showToast(`Saved ${product.name} to wishlist`);
        }
        return;
      }

      const itemPath = `users/${user.uid}/wishlist/${product.id}`;
      try {
        const ref = doc(db, 'users', user.uid, 'wishlist', product.id);
        if (exists) {
          await deleteDoc(ref);
          showToast(`Removed ${product.name} from wishlist`);
        } else {
          await setDoc(ref, {
            userId: user.uid,
            productId: product.id,
            collectionId: product.collectionId,
            name: product.name,
            price: product.price,
            image: product.image,
            createdAt: serverTimestamp(),
          });
          showToast(`Saved ${product.name} to wishlist`);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, itemPath);
      }
    },
    [wishlist, user, showToast]
  );

  const placeOrder = useCallback(
    async (customerName: string, shippingAddress: string): Promise<string | null> => {
      if (!user) {
        showToast('Please sign in with Google to submit your atelier order.');
        return null;
      }
      if (cart.length === 0) return null;

      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      try {
        await setDoc(doc(db, 'orders', orderId), {
          userId: user.uid,
          customerEmail: user.email || '',
          customerName: customerName.trim().slice(0, 120),
          shippingAddress: shippingAddress.trim().slice(0, 400),
          items: cart.map((c) => ({
            productId: c.productId,
            name: c.name,
            price: c.price,
            size: c.size,
            color: c.color,
            quantity: c.quantity,
          })),
          totalAmount,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Clear persisted cart items
        await Promise.all(
          cart.map((c) => deleteDoc(doc(db, 'users', user.uid, 'cart', c.id)))
        );

        showToast(`Atelier order ${orderId} confirmed.`);
        return orderId;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
      }
    },
    [user, cart, showToast]
  );

  const subscribeNewsletter = useCallback(
    async (email: string) => {
      const normalized = email.trim().toLowerCase();
      const subId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      try {
        await setDoc(doc(db, 'newsletter', subId), {
          email: normalized,
          status: 'subscribed',
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `newsletter/${subId}`);
      }
    },
    []
  );

  // Admin: seed default 10 collections + products to Firestore
  const seedDefaultCatalogToFirestore = useCallback(async () => {
    if (!isAdmin) return;
    try {
      await Promise.all(
        DEFAULT_COLLECTIONS.map((col) =>
          setDoc(doc(db, 'collections', col.id), {
            ...col,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        )
      );
      await Promise.all(
        DEFAULT_PRODUCTS.map((prod) =>
          setDoc(doc(db, 'products', prod.id), {
            ...prod,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        )
      );
      showToast('Lookbook catalog synced to Cloud Firestore.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'collections');
    }
  }, [isAdmin, showToast]);

  const saveCollection = useCallback(
    async (col: Omit<FashionCollection, 'id'> & { id?: string }) => {
      if (!isAdmin) return;
      const id =
        col.id && /^[a-zA-Z0-9_\-]+$/.test(col.id)
          ? col.id
          : col.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '') || `col-${Date.now()}`;
      const ref = doc(db, 'collections', id);
      try {
        const existing = await getDoc(ref);
        if (existing.exists()) {
          await updateDoc(ref, {
            name: col.name,
            category: col.category,
            description: col.description,
            editorialStory: col.editorialStory,
            modelImage: col.modelImage,
            coverImage: col.coverImage,
            altText: col.altText,
            sortOrder: Number(col.sortOrder),
            featured: Boolean(col.featured),
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, {
            id,
            name: col.name,
            category: col.category,
            description: col.description,
            editorialStory: col.editorialStory,
            modelImage: col.modelImage,
            coverImage: col.coverImage,
            altText: col.altText,
            sortOrder: Number(col.sortOrder),
            featured: Boolean(col.featured),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        showToast(`Collection "${col.name}" saved.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `collections/${id}`);
      }
    },
    [isAdmin, showToast]
  );

  const deleteCollection = useCallback(
    async (id: string) => {
      if (!isAdmin) return;
      try {
        await deleteDoc(doc(db, 'collections', id));
        showToast('Collection removed.');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `collections/${id}`);
      }
    },
    [isAdmin, showToast]
  );

  const saveProduct = useCallback(
    async (prod: Omit<Product, 'id'> & { id?: string }) => {
      if (!isAdmin) return;
      const id =
        prod.id && /^[a-zA-Z0-9_\-]+$/.test(prod.id)
          ? prod.id
          : `prod-${Date.now()}`;
      const ref = doc(db, 'products', id);
      try {
        const existing = await getDoc(ref);
        if (existing.exists()) {
          await updateDoc(ref, {
            collectionId: prod.collectionId,
            name: prod.name,
            description: prod.description,
            price: Number(prod.price),
            image: prod.image,
            sizes: prod.sizes,
            colors: prod.colors,
            stock: Number(prod.stock),
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, {
            id,
            collectionId: prod.collectionId,
            name: prod.name,
            description: prod.description,
            price: Number(prod.price),
            image: prod.image,
            sizes: prod.sizes,
            colors: prod.colors,
            stock: Number(prod.stock),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        showToast(`Piece "${prod.name}" saved.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
      }
    },
    [isAdmin, showToast]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!isAdmin) return;
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast('Product removed.');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      }
    },
    [isAdmin, showToast]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      if (!isAdmin) return;
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status,
          updatedAt: serverTimestamp(),
        });
        showToast(`Order status updated to ${status}.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      }
    },
    [isAdmin, showToast]
  );

  const deleteSubscriber = useCallback(
    async (subscriberId: string) => {
      if (!isAdmin) return;
      try {
        await deleteDoc(doc(db, 'newsletter', subscriberId));
        showToast('Subscriber removed.');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `newsletter/${subscriberId}`);
      }
    },
    [isAdmin, showToast]
  );

  const updateBrandSettings = useCallback(
    async (settings: BrandSettings) => {
      if (!isAdmin) return;
      try {
        await setDoc(doc(db, 'settings', 'brand'), {
          brandName: settings.brandName.trim(),
          tagline: settings.tagline.trim(),
          updatedAt: serverTimestamp(),
        });
        setBrand(settings);
        showToast('Brand identity updated.');
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'settings/brand');
      }
    },
    [isAdmin, showToast]
  );

  return (
    <LookbookContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        brand,
        collections,
        products,
        cart,
        wishlist,
        orders,
        subscribers,
        activePage,
        setActivePage,
        activeCarouselIndex,
        setActiveCarouselIndex,
        selectedCollection,
        setSelectedCollection,
        isBagOpen,
        setIsBagOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        legalModal,
        setLegalModal,
        toast,
        showToast,
        signInWithGoogle,
        signOutUser,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        subscribeNewsletter,
        seedDefaultCatalogToFirestore,
        saveCollection,
        deleteCollection,
        saveProduct,
        deleteProduct,
        updateOrderStatus,
        deleteSubscriber,
        updateBrandSettings,
        isCloudSynced,
      }}
    >
      {children}
    </LookbookContext.Provider>
  );
};

export function useLookbook(): LookbookContextValue {
  const ctx = useContext(LookbookContext);
  if (!ctx) {
    throw new Error('useLookbook must be used inside LookbookProvider');
  }
  return ctx;
}
