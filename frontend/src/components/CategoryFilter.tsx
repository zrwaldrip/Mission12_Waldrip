import { useEffect, useMemo, useState } from "react";

type CategoryFilterProps = {
  selectedCategories: string[];
  onSelectedCategoriesChange: (categories: string[]) => void;
};

function toSafeId(s: string) {
  return `cat-${s.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export default function CategoryFilter({
  selectedCategories,
  onSelectedCategoriesChange,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://bookstore-waldrip-backend-fneddpauhuezawar.eastus-01.azurewebsites.net/api/Book/GetCategories"
        );

        if (!response.ok) {
          throw new Error(`Failed to load categories (HTTP ${response.status})`);
        }

        const data = (await response.json()) as unknown;
        if (Array.isArray(data)) {
          setCategories(data.filter((c): c is string => typeof c === "string"));
        } else {
          setCategories([]);
        }
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load categories";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.localeCompare(b));
  }, [categories]);

  const allSelected = selectedCategories.length === 0;

  const toggleCategory = (category: string, checked: boolean) => {
    if (checked) {
      if (!selectedCategories.includes(category)) {
        onSelectedCategoriesChange([...selectedCategories, category]);
      }
    } else {
      onSelectedCategoriesChange(
        selectedCategories.filter((c) => c !== category)
      );
    }
  };

  return (
    <div className="mb-3">
      <h2 className="h5 mb-2">Filter by Category</h2>

      {loading && <div>Loading categories...</div>}
      {error && <div className="text-danger">{error}</div>}

      {!loading && !error && (
        <div className="d-flex flex-wrap gap-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="allCategories"
              checked={allSelected}
              onChange={(e) => {
                if (e.target.checked) onSelectedCategoriesChange([]);
              }}
            />
            <label className="form-check-label" htmlFor="allCategories">
              All Categories
            </label>
          </div>

          {sortedCategories.map((category) => (
            <div className="form-check" key={category}>
              <input
                className="form-check-input"
                type="checkbox"
                id={toSafeId(category)}
                checked={selectedCategories.includes(category)}
                onChange={(e) =>
                  toggleCategory(category, e.target.checked)
                }
              />
              <label className="form-check-label" htmlFor={toSafeId(category)}>
                {category}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

