import { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async (shouldUpdate, options = {}) => {
    const currentPage = options.page || page;
    const currentLimit = options.limit || limit;
    const currentSearch = options.search !== undefined ? options.search : searchQuery;

    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: currentLimit.toString()
    });

    if (currentSearch) {
      params.append('q', currentSearch);
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4001/api/items?${params}`);
      const json = await res.json();

      if (!shouldUpdate || shouldUpdate()) {
        setItems(json.items || json);
        setTotalItems(json.total || 0);
        setPage(json.page || currentPage);
        setLimit(json.limit || currentLimit);
      }
      return json;
    } finally {
      if (!shouldUpdate || shouldUpdate()) {
        setLoading(false);
      }
    }
  }, [page, limit, searchQuery]);

  return (
    <DataContext.Provider value={{
      items,
      page,
      limit,
      totalItems,
      searchQuery,
      loading,
      fetchItems,
      setPage,
      setLimit,
      setSearchQuery
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);