"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-bottom">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="btn btn-light w-100 d-flex justify-content-between align-items-center py-2 px-0 rounded-0 border-0 bg-white"
      >
        <span className="fw-medium small text-dark">{title}</span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className="text-secondary"
          style={{
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          aria-hidden="true"
        />
      </button>

      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

function CheckboxOption({ id, label, count, checked, onChange }) {
  return (
    <div className="form-check py-1">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label
        className="form-check-label d-flex justify-content-between w-100 small text-dark"
        htmlFor={id}
        style={{ cursor: "pointer" }}
      >
        <span>{label}</span>
        <span className="text-muted">({count})</span>
      </label>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  filterOptions,
  priceBounds,
  onToggleFilter,
  onPriceChange,
  onClearAll,
}) {
  const selectedCategories = filters?.categories || [];
  const selectedBrands = filters?.brands || [];
  const selectedSizes = filters?.sizes || [];
  const selectedColours = filters?.colours || [];
  const priceRange = filters?.maxPrice || priceBounds?.max || 0;

  return (
    <aside className="filter-sidebar sticky-top" style={{ top: "96px" }}>
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        <span className="text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>
          Refine By
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="btn btn-link btn-sm text-secondary p-0 text-decoration-underline"
          style={{ fontSize: "12px" }}
        >
          Clear all
        </button>
      </div>

      <div className="px-3">
        <CollapsibleSection title="Categories">
          {filterOptions.categories.map((category) => (
            <CheckboxOption
              key={category.value}
              id={`cat-${category.value}`}
              label={category.label}
              count={category.count}
              checked={selectedCategories.includes(category.value)}
              onChange={() => onToggleFilter("categories", category.value)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Price Range">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Rs {priceBounds.min}</small>
            <small className="text-muted">Rs {priceBounds.max}</small>
          </div>
          <input
            type="range"
            className="form-range"
            min={priceBounds.min}
            max={priceBounds.max}
            step="100"
            value={priceRange}
            onChange={(event) => onPriceChange(Number(event.target.value))}
          />
          <p className="text-muted mt-1 mb-0 small">Up to Rs {priceRange}</p>
        </CollapsibleSection>

        <CollapsibleSection title="Brands">
          {filterOptions.brands.map((brand) => (
            <CheckboxOption
              key={brand.value}
              id={`brand-${brand.value}`}
              label={brand.label}
              count={brand.count}
              checked={selectedBrands.includes(brand.value)}
              onChange={() => onToggleFilter("brands", brand.value)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Size">
          {filterOptions.sizes.map((size) => (
            <CheckboxOption
              key={size.value}
              id={`size-${size.value}`}
              label={size.label}
              count={size.count}
              checked={selectedSizes.includes(size.value)}
              onChange={() => onToggleFilter("sizes", size.value)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Colour">
          {filterOptions.colours.map((colour) => (
            <div key={colour.value} className="form-check py-1">
              <input
                className="form-check-input"
                type="checkbox"
                id={`colour-${colour.value}`}
                checked={selectedColours.includes(colour.value)}
                onChange={() => onToggleFilter("colours", colour.value)}
              />
              <label
                className="form-check-label d-flex justify-content-between align-items-center w-100 small text-dark"
                htmlFor={`colour-${colour.value}`}
                style={{ cursor: "pointer" }}
              >
                <span className="d-flex align-items-center gap-2">
                  <span
                    className="rounded-circle border"
                    style={{
                      width: "14px",
                      height: "14px",
                      backgroundColor: colour.hex,
                      flexShrink: 0,
                    }}
                  />
                  {colour.label}
                </span>
                <span className="text-muted">({colour.count})</span>
              </label>
            </div>
          ))}
        </CollapsibleSection>
      </div>
    </aside>
  );
}
