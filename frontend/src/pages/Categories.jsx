// frontend/src/pages/Settings.jsx
// Category management — add, edit, delete categories dynamically.

import { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag, Lock, AlertTriangle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useCategoryContext } from '../context/CategoryContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import CategoryForm from '../components/category/CategoryForm.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';

export default function Categories() {
  usePageTitle('Categories');

  const {
    categories, loading, error,
    createCategory, updateCategory, deleteCategory,
  } = useCategoryContext();
  const { toasts, show: showToast } = useToast();

  const [addOpen, setAddOpen]           = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]   = useState('');
  const deleteCancelRef                 = useRef(null);

  useEffect(() => {
    if (deleteTarget) {
      setDeleteError('');
      const t = setTimeout(() => deleteCancelRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [deleteTarget]);

  async function handleCreate(data) {
    setSubmitting(true);
    try {
      await createCategory(data);
      setAddOpen(false);
      showToast(`Category "${data.label}" created!`, 'success');
    } catch (err) {
      throw err; // let CategoryForm handle and display it
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(data) {
    setSubmitting(true);
    try {
      await updateCategory(editTarget.id, data);
      setEditTarget(null);
      showToast(`Category "${data.label}" updated!`, 'success');
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      showToast(`Category deleted.`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete category.';
      setDeleteError(msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  const customCategories  = categories.filter(c => !c.isDefault);
  const defaultCategories = categories.filter(c => c.isDefault);

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Manage your custom expense categories</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setAddOpen(true)} id="add-category-btn">
          <Plus size={16} aria-hidden="true" />
          New Category
        </Button>
      </div>

      {/* Custom categories */}
      <div className="card settings-section">
        <div className="settings-section__header">
          <div>
            <h2 className="card__title">Custom Categories</h2>
            <p className="card__subtitle">Categories you've created — fully editable and deletable</p>
          </div>
          <span className="stat-card__tag">{customCategories.length}</span>
        </div>

        {loading ? (
          <div className="settings-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="settings-list__row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <div className="skeleton" style={{ width: 120, height: 16 }} />
                </div>
                <div className="skeleton" style={{ width: 80, height: 28 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="form-error" style={{ padding: 'var(--space-4)' }}>
            <AlertTriangle size={14} /> {error}
          </p>
        ) : customCategories.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-4)' }}>
            <Tag size={32} className="empty-state__icon" aria-hidden="true" />
            <p className="empty-state__title">No custom categories yet</p>
            <p className="empty-state__body">Click "New Category" to create one.</p>
          </div>
        ) : (
          <div className="settings-list">
            {customCategories.map(cat => {
              const IconComp = Icons[cat.icon] || Icons.Tag;
              return (
              <div key={cat.id} className="settings-list__row">
                <div className="settings-list__left">
                  <IconComp size={16} className="cat-icon" />
                  <span className="settings-list__label">{cat.label}</span>
                  <span className="settings-list__name-key">{cat.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => setEditTarget(cat)}
                    aria-label={`Edit ${cat.label}`}
                    id={`edit-cat-btn-${cat.id}`}
                    title="Edit category"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => setDeleteTarget(cat)}
                    aria-label={`Delete ${cat.label}`}
                    id={`delete-cat-btn-${cat.id}`}
                    title="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Default categories (read-only) */}
      <div className="card settings-section">
        <div className="settings-section__header">
          <div>
            <h2 className="card__title">Default Categories</h2>
            <p className="card__subtitle">Built-in categories — colour and label can be edited, but they cannot be deleted</p>
          </div>
          <span className="stat-card__tag">{defaultCategories.length}</span>
        </div>

        <div className="settings-list">
          {defaultCategories.map(cat => {
            const IconComp = Icons[cat.icon] || Icons.Tag;
            return (
            <div key={cat.id ?? cat.name} className="settings-list__row">
              <div className="settings-list__left">
                <IconComp size={16} className="cat-icon" />
                <span className="settings-list__label">{cat.label}</span>
                <span className="settings-list__name-key">{cat.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                {cat.id && (
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => setEditTarget(cat)}
                    aria-label={`Edit ${cat.label}`}
                    id={`edit-default-cat-btn-${cat.id}`}
                    title="Edit label/colour"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                <span className="settings-list__lock" title="Default — cannot be deleted">
                  <Lock size={13} />
                </span>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* Add Modal */}
      <Modal id="add-category-modal" isOpen={addOpen} onClose={() => setAddOpen(false)} title="New Category">
        <CategoryForm onSubmit={handleCreate} onCancel={() => setAddOpen(false)} submitting={submitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        id="edit-category-modal"
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Category"
      >
        {editTarget && (
          <CategoryForm
            key={editTarget.id}
            initialData={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            submitting={submitting}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        id="delete-category-modal"
        isOpen={!!deleteTarget}
        onClose={() => { setDeleteTarget(null); setDeleteError(''); }}
        title="Delete Category"
      >
        {deleteTarget && (
          <div className="delete-confirm">
            <p className="delete-confirm__body">
              Are you sure you want to delete <strong>"{deleteTarget.label}"</strong>?
              This will fail if any expenses currently use this category.
            </p>
            {deleteError && (
              <div className="cat-delete-error" role="alert">
                <AlertTriangle size={14} aria-hidden="true" />
                <span>{deleteError}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button
                variant="secondary" size="md"
                onClick={() => { setDeleteTarget(null); setDeleteError(''); }}
                id="delete-cat-cancel-btn"
                ref={deleteCancelRef}
              >
                Cancel
              </Button>
              <Button variant="destructive" size="md" loading={deleteLoading} onClick={handleDelete} id="delete-cat-confirm-btn">
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toasts */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`} role="alert">
            <span className="toast__message">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
