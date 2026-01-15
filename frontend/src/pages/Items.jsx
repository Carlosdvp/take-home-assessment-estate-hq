import { useEffect, useRef } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();
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

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={'/items/' + item.id}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;