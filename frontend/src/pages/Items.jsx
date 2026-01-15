import { useEffect, useRef } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems, page, setPage, totalItems, searchQuery, setSearchQuery } = useData();
  const active = useRef(true);

  useEffect(() => {
    active.current = true;

    fetchItems(() => active.current).catch((err) => {
      if (active.current) {
        console.error(err);
      }
    });

    return () => {
      active.current = false;
    };
  }, [fetchItems]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPage(1);
    fetchItems(() => active.current, { search: value, page: 1 }).catch(console.error);
  };

  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchItems(() => active.current, { page: newPage }).catch(console.error);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(totalItems / 10);
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchItems(() => active.current, { page: newPage }).catch(console.error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      {!items.length ? (
        <p>No items found</p>
      ) : (
        <>
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <Link to={'/items/' + item.id}>{item.name}</Link>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handlePrevious} disabled={page === 1}>
              Previous
            </button>
            <span style={{ margin: '0 15px' }}>
              Page {page} of {Math.ceil(totalItems / 10)} ({totalItems} total items)
            </span>
            <button onClick={handleNext} disabled={page >= Math.ceil(totalItems / 10)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Items;