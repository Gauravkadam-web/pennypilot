// frontend/src/components/category/CategoryForm.jsx
// Form for creating or editing a category.
// Supports: label input + color picker (12 preset swatches).

import { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import Button from '../common/Button.jsx';

// 12 preset color swatches for easy selection
const COLOR_PALETTE = [
  '#F59E0B', '#EF4444', '#EC4899', '#F43F5E',
  '#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4',
  '#10B981', '#22C55E', '#84CC16', '#6B7280',
];

function validate(form, isEdit) {
  const errors = {};
  if (!isEdit) {
    if (!form.name.trim()) errors.name = 'Name is required';
    else if (!/^[A-Z0-9_]+$/.test(form.name.toUpperCase()))
      errors.name = 'Only uppercase letters, digits, and underscores';
    else if (form.name.length > 50) errors.name = 'Max 50 characters';
  }
  if (!form.label.trim()) errors.label = 'Label is required';
  else if (form.label.length > 60) errors.label = 'Max 60 characters';
  if (!form.color) errors.color = 'Please select a colour';
  return errors;
}

/**
 * @param {object|null}  initialData  null = create mode, object = edit mode
 * @param {Function}     onSubmit
 * @param {Function}     onCancel
 * @param {boolean}      submitting
 */
export default function CategoryForm({ initialData = null, onSubmit, onCancel, submitting = false }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name:  initialData?.name  ?? '',
    label: initialData?.label ?? '',
    color: initialData?.color ?? COLOR_PALETTE[0],
  });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function selectColor(hex) {
    setForm(prev => ({ ...prev, color: hex }));
    if (errors.color) setErrors(prev => ({ ...prev, color: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validate(form, isEdit);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await onSubmit({
        name:  form.name.toUpperCase().trim(),
        label: form.label.trim(),
        color: form.color,
      });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save category. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate id="category-form">
      {apiError && (
        <div className="form-error cat-form-error" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {apiError}
        </div>
      )}

      {/* Name field — only on create */}
      {!isEdit && (
        <div className="form-group">
          <label htmlFor="cat-name" className="form-label form-label--required">
            Category Key
          </label>
          <input
            id="cat-name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            value={form.name}
            onChange={(e) => handleChange({ target: { name: 'name', value: e.target.value.toUpperCase() } })}
            placeholder="e.g. FREELANCE"
            maxLength={50}
            autoComplete="off"
          />
          <span className="form-helper">Uppercase letters, digits, underscores only (e.g. MY_CUSTOM)</span>
          {errors.name && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.name}</span>}
        </div>
      )}

      {/* Label */}
      <div className="form-group">
        <label htmlFor="cat-label" className="form-label form-label--required">Display Label</label>
        <input
          id="cat-label"
          name="label"
          type="text"
          className={`form-input ${errors.label ? 'form-input--error' : ''}`}
          value={form.label}
          onChange={handleChange}
          placeholder="e.g. Freelance Income"
          maxLength={60}
          autoComplete="off"
        />
        {errors.label && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.label}</span>}
      </div>

      {/* Color picker */}
      <div className="form-group">
        <label className="form-label form-label--required">Colour</label>
        <div className="color-palette" role="group" aria-label="Select category colour">
          {COLOR_PALETTE.map(hex => (
            <button
              key={hex}
              type="button"
              className={`color-swatch${form.color === hex ? ' color-swatch--selected' : ''}`}
              style={{ backgroundColor: hex }}
              onClick={() => selectColor(hex)}
              aria-label={`Select colour ${hex}`}
              aria-pressed={form.color === hex}
              title={hex}
            >
              {form.color === hex && <Check size={12} color="#fff" strokeWidth={3} />}
            </button>
          ))}
        </div>
        {errors.color && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.color}</span>}
        {/* Preview badge */}
        <div className="cat-preview">
          <span className="badge" style={{ backgroundColor: `${form.color}22`, color: form.color }}>
            <span className="badge__dot" style={{ backgroundColor: form.color }} />
            {form.label || 'Preview'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
        <Button type="button" variant="secondary" size="md" onClick={onCancel} id="cat-form-cancel">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" loading={submitting} id="cat-form-submit">
          {isEdit ? 'Save Changes' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
