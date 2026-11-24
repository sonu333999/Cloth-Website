import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  Check,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from '../components/EditorialImage';
import { FashionCollection, OrderStatus, Product } from '../types/fashion';

type AdminTab = 'collections' | 'products' | 'orders' | 'newsletter' | 'brand';

export const Admin: React.FC = () => {
  const {
    user,
    isAdmin,
    brand,
    collections,
    products,
    orders,
    subscribers,
    isCloudSynced,
    signInWithGoogle,
    seedDefaultCatalogToFirestore,
    saveCollection,
    deleteCollection,
    saveProduct,
    deleteProduct,
    updateOrderStatus,
    deleteSubscriber,
    updateBrandSettings,
    showToast,
  } = useLookbook();

  const [tab, setTab] = useState<AdminTab>('collections');

  // Collection Form State
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [colForm, setColForm] = useState({
    name: '',
    category: '12 · CAPSULE',
    description: '',
    editorialStory: '',
    modelImage: '/src/assets/images/model_summer_linen_1795517679458.jpg',
    coverImage: '/src/assets/images/model_summer_linen_1795517679458.jpg',
    altText: '',
    sortOrder: 11,
    featured: true,
  });

  // Product Form State
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    collectionId: collections[0]?.id || 'summer-linen',
    name: '',
    description: '',
    price: 4999,
    image: '/src/assets/images/model_street_layers_1795517681077.jpg',
    sizesText: 'XS, S, M, L',
    colorsText: 'Ivory, Charcoal',
    stock: 10,
  });

  // Brand Identity Form
  const [brandNameInput, setBrandNameInput] = useState(brand.brandName);
  const [brandTaglineInput, setBrandTaglineInput] = useState(brand.tagline);
  const [uploadingCloudinary, setUploadingCloudinary] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  const handleCloudinaryUpload = async (
    file: File,
    onSuccess: (url: string) => void
  ) => {
    if (!cloudName || !uploadPreset) {
      showToast(
        'Set VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET in Secrets to upload directly, or paste any image URL.'
      );
      return;
    }

    setUploadingCloudinary(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
        { method: 'POST', body: formData }
      );
      const json = (await res.json()) as { secure_url?: string; error?: { message: string } };
      if (!res.ok || !json.secure_url) {
        throw new Error(json.error?.message || 'Cloudinary upload failed');
      }
      onSuccess(json.secure_url);
      showToast('Image uploaded to Cloudinary.');
    } catch (err) {
      console.error(err);
      showToast('Cloudinary upload failed. Verify cloud name & unsigned preset.');
    } finally {
      setUploadingCloudinary(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#EAE4DA] pt-32 pb-24 px-5 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#F4F0E9] border border-[#D2CCC1] p-8 space-y-5 text-center">
          <Shield className="w-8 h-8 mx-auto text-[#30312E]" strokeWidth={1.3} />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#99958D]">
            Restricted Access
          </p>
          <h1 className="font-serif text-3xl text-[#30312E]">Atelier Admin Showroom</h1>
          <p className="text-sm text-[#30312E]/75 leading-relaxed">
            {user
              ? `Signed in as ${user.email}. Administrator authorization is required to manage collections, products, and orders.`
              : 'Sign in with your verified administrator Google account to access collection management, inventory, and orders.'}
          </p>
          {!user && (
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="w-full py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.18em] hover:bg-[#414642] transition-colors"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </main>
    );
  }

  const startEditCollection = (col: FashionCollection) => {
    setEditingColId(col.id);
    setColForm({
      name: col.name,
      category: col.category,
      description: col.description,
      editorialStory: col.editorialStory,
      modelImage: col.modelImage,
      coverImage: col.coverImage,
      altText: col.altText,
      sortOrder: col.sortOrder,
      featured: col.featured,
    });
  };

  const resetColForm = () => {
    setEditingColId(null);
    setColForm({
      name: '',
      category: '12 · CAPSULE',
      description: '',
      editorialStory: '',
      modelImage: '/src/assets/images/model_summer_linen_1795517679458.jpg',
      coverImage: '/src/assets/images/model_summer_linen_1795517679458.jpg',
      altText: '',
      sortOrder: collections.length + 1,
      featured: true,
    });
  };

  const submitCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCollection({
      id: editingColId || undefined,
      name: colForm.name.trim(),
      category: colForm.category.trim(),
      description: colForm.description.trim(),
      editorialStory: colForm.editorialStory.trim() || colForm.description.trim(),
      modelImage: colForm.modelImage.trim(),
      coverImage: colForm.coverImage.trim() || colForm.modelImage.trim(),
      altText: colForm.altText.trim() || `${colForm.name} editorial lookbook model`,
      sortOrder: Number(colForm.sortOrder),
      featured: colForm.featured,
    });
    resetColForm();
  };

  const startEditProduct = (prod: Product) => {
    setEditingProdId(prod.id);
    setProdForm({
      collectionId: prod.collectionId,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      image: prod.image,
      sizesText: prod.sizes.join(', '),
      colorsText: prod.colors.join(', '),
      stock: prod.stock,
    });
  };

  const resetProdForm = () => {
    setEditingProdId(null);
    setProdForm({
      collectionId: collections[0]?.id || 'summer-linen',
      name: '',
      description: '',
      price: 4999,
      image: '/src/assets/images/model_street_layers_1795517681077.jpg',
      sizesText: 'XS, S, M, L',
      colorsText: 'Ivory, Charcoal',
      stock: 10,
    });
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = prodForm.sizesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = prodForm.colorsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    await saveProduct({
      id: editingProdId || undefined,
      collectionId: prodForm.collectionId,
      name: prodForm.name.trim(),
      description: prodForm.description.trim(),
      price: Number(prodForm.price),
      image: prodForm.image.trim(),
      sizes: sizes.length ? sizes : ['M'],
      colors: colors.length ? colors : ['Default'],
      stock: Number(prodForm.stock),
    });
    resetProdForm();
  };

  return (
    <main className="min-h-screen bg-[#EAE4DA] pt-28 pb-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#D2CCC1]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#80A997] mb-2">
              Atelier Management
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#30312E]">
              Showroom Admin Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void seedDefaultCatalogToFirestore()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F0E9] border border-[#30312E] text-xs font-mono uppercase tracking-[0.14em] hover:bg-[#30312E] hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isCloudSynced ? 'Re-Sync Catalog to Cloud' : 'Seed Catalog to Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#D2CCC1] pb-4">
          {(
            [
              ['collections', `Collections (${collections.length})`],
              ['products', `Products & Inventory (${products.length})`],
              ['orders', `Orders (${orders.length})`],
              ['newsletter', `Newsletter (${subscribers.length})`],
              ['brand', 'Brand Identity'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-xs font-mono uppercase tracking-[0.14em] transition-colors ${
                tab === key
                  ? 'bg-[#30312E] text-white'
                  : 'bg-[#F4F0E9] text-[#30312E] border border-[#D2CCC1] hover:border-[#30312E]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* COLLECTIONS TAB */}
        {tab === 'collections' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <form
              onSubmit={(e) => void submitCollection(e)}
              className="lg:col-span-5 bg-[#F4F0E9] border border-[#D2CCC1] p-6 space-y-4 h-fit"
            >
              <h2 className="font-serif text-2xl">
                {editingColId ? 'Edit Collection' : 'Add New Collection'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    required
                    value={colForm.name}
                    onChange={(e) => setColForm({ ...colForm, name: e.target.value })}
                    placeholder="Autumn Cashmere"
                    className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                    Category Label
                  </label>
                  <input
                    type="text"
                    required
                    value={colForm.category}
                    onChange={(e) => setColForm({ ...colForm, category: e.target.value })}
                    placeholder="12 · CAPSULE"
                    className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  required
                  value={colForm.description}
                  onChange={(e) => setColForm({ ...colForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                  Editorial Story
                </label>
                <textarea
                  rows={3}
                  value={colForm.editorialStory}
                  onChange={(e) => setColForm({ ...colForm, editorialStory: e.target.value })}
                  className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                  Model Image URL (or Upload to Cloudinary)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={colForm.modelImage}
                    onChange={(e) =>
                      setColForm({
                        ...colForm,
                        modelImage: e.target.value,
                        coverImage: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-[#30312E] text-white text-xs font-mono uppercase cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCloudinary ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleCloudinaryUpload(file, (url) =>
                            setColForm((prev) => ({
                              ...prev,
                              modelImage: url,
                              coverImage: url,
                            }))
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                    Carousel Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={colForm.sortOrder}
                    onChange={(e) =>
                      setColForm({ ...colForm, sortOrder: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm font-mono"
                  />
                </div>
                <label className="flex items-center gap-2 pt-5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={colForm.featured}
                    onChange={(e) => setColForm({ ...colForm, featured: e.target.checked })}
                  />
                  <span>Featured in Gallery</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 hover:bg-[#414642]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingColId ? 'Update Collection' : 'Save Collection'}</span>
                </button>
                {editingColId && (
                  <button
                    type="button"
                    onClick={resetColForm}
                    className="px-4 py-3 border border-[#D2CCC1] text-xs font-mono uppercase"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="bg-[#F4F0E9] border border-[#D2CCC1] p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <EditorialImage
                      src={col.modelImage}
                      alt={col.name}
                      className="w-14 h-20 object-cover object-top bg-[#EAE4DA]"
                    />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#80A997]">
                        {col.category} · Order {col.sortOrder}
                      </p>
                      <h3 className="font-serif text-xl">{col.name}</h3>
                      <p className="text-xs text-[#30312E]/70 line-clamp-1">
                        {col.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditCollection(col)}
                      aria-label={`Edit ${col.name}`}
                      className="p-2 border border-[#D2CCC1] hover:bg-[#30312E] hover:text-white transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteCollection(col.id)}
                      aria-label={`Delete ${col.name}`}
                      className="p-2 border border-[#D2CCC1] text-rose-700 hover:bg-rose-700 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <form
              onSubmit={(e) => void submitProduct(e)}
              className="lg:col-span-5 bg-[#F4F0E9] border border-[#D2CCC1] p-6 space-y-4 h-fit"
            >
              <h2 className="font-serif text-2xl">
                {editingProdId ? 'Edit Piece' : 'Add Product'}
              </h2>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                  Collection
                </label>
                <select
                  value={prodForm.collectionId}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, collectionId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm"
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                  Piece Name
                </label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="Tailored Linen Trench"
                  className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodForm.price}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodForm.stock}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                    Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={prodForm.sizesText}
                    onChange={(e) => setProdForm({ ...prodForm, sizesText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                    Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={prodForm.colorsText}
                    onChange={(e) => setProdForm({ ...prodForm, colorsText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D] mb-1">
                  Product Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-[#30312E] text-white text-xs font-mono uppercase cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleCloudinaryUpload(file, (url) =>
                            setProdForm((prev) => ({ ...prev, image: url }))
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.16em]"
                >
                  {editingProdId ? 'Update Product' : 'Save Product'}
                </button>
                {editingProdId && (
                  <button
                    type="button"
                    onClick={resetProdForm}
                    className="px-4 py-3 border border-[#D2CCC1] text-xs font-mono uppercase"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#F4F0E9] border border-[#D2CCC1] p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <EditorialImage
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-16 object-cover object-top bg-[#EAE4DA]"
                    />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D]">
                        {prod.collectionId} · Stock: {prod.stock}
                      </p>
                      <h3 className="font-serif text-xl">{prod.name}</h3>
                      <p className="font-mono text-xs tabular-nums">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditProduct(prod)}
                      aria-label={`Edit ${prod.name}`}
                      className="p-2 border border-[#D2CCC1] hover:bg-[#30312E] hover:text-white transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteProduct(prod.id)}
                      aria-label={`Delete ${prod.name}`}
                      className="p-2 border border-[#D2CCC1] text-rose-700 hover:bg-rose-700 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-[#F4F0E9] border border-[#D2CCC1] p-10 text-center text-sm text-[#99958D]">
                No atelier orders recorded yet.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#F4F0E9] border border-[#D2CCC1] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-1.5">
                    <p className="font-mono text-xs text-[#80A997]">{order.id}</p>
                    <h3 className="font-serif text-2xl">{order.customerName}</h3>
                    <p className="text-xs text-[#30312E]/75">
                      {order.customerEmail} · {order.shippingAddress}
                    </p>
                    <p className="font-mono text-xs tabular-nums pt-1">
                      {order.items.length} pieces · Total ₹
                      {order.totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#99958D]">
                      Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        void updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="px-3 py-2 bg-[#EAE4DA] border border-[#D2CCC1] font-mono text-xs uppercase"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NEWSLETTER TAB */}
        {tab === 'newsletter' && (
          <div className="bg-[#F4F0E9] border border-[#D2CCC1] divide-y divide-[#D2CCC1]">
            {subscribers.length === 0 ? (
              <p className="p-8 text-center text-sm text-[#99958D]">
                No newsletter subscribers yet.
              </p>
            ) : (
              subscribers.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 px-6 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-mono text-sm">{sub.email}</p>
                    <p className="font-mono text-[10px] text-[#99958D] uppercase">
                      {sub.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteSubscriber(sub.id)}
                    aria-label={`Remove ${sub.email}`}
                    className="p-2 text-rose-700 hover:bg-rose-700 hover:text-white border border-[#D2CCC1] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* BRAND IDENTITY TAB */}
        {tab === 'brand' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void updateBrandSettings({
                brandName: brandNameInput,
                tagline: brandTaglineInput,
              });
            }}
            className="max-w-lg bg-[#F4F0E9] border border-[#D2CCC1] p-6 space-y-5"
          >
            <h2 className="font-serif text-2xl">Brand Identity</h2>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D] mb-1">
                Fashion House Name
              </label>
              <input
                type="text"
                required
                value={brandNameInput}
                onChange={(e) => setBrandNameInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm font-serif tracking-widest uppercase"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D] mb-1">
                Editorial Tagline
              </label>
              <input
                type="text"
                required
                value={brandTaglineInput}
                onChange={(e) => setBrandTaglineInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#EAE4DA]/60 border border-[#D2CCC1] text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.18em] inline-flex items-center gap-2 hover:bg-[#414642]"
            >
              <Check className="w-4 h-4" />
              <span>Save Brand Identity</span>
            </button>
          </form>
        )}
      </div>
    </main>
  );
};
