// frontend/src/components/common/Loader.jsx
export default function Loader({ rows = 5 }) {
  return (
    <div role="status" aria-label="Loading expenses">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton" style={{ width: '30%', height: '14px' }} />
          <div className="skeleton" style={{ width: '12%', height: '20px', borderRadius: '999px' }} />
          <div className="skeleton" style={{ width: '16%', height: '14px', marginLeft: 'auto' }} />
          <div className="skeleton" style={{ width: '10%', height: '14px' }} />
        </div>
      ))}
    </div>
  );
}
