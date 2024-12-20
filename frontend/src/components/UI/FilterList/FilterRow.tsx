// src/components/UI/FilterList/FilterRow.tsx

import React, { useState } from 'react';
import { ExtendedFilterCondition, FrontendAvailableColumns } from '../../../types';
import { TrashIcon } from '@heroicons/react/24/outline';
import IconButton from '../IconButton/IconButton';
import { mapBackendToFrontendType, getOperators } from '../../../utils';
import { useTypeAhead } from '../../../hooks';

interface FilterRowProps {
  filter: ExtendedFilterCondition;
  index: number;
  availableColumns: FrontendAvailableColumns;
  showColumns: string[];
  updateFilter: (
    index: number,
    field: keyof ExtendedFilterCondition,
    value: any
  ) => void;
  removeFilter: (index: number) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({
  filter,
  index,
  availableColumns,
  showColumns,
  updateFilter,
  removeFilter,
}) => {
  const { suggestions, fetchSuggestions, resetSuggestions } = useTypeAhead();
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === 'ArrowUp') {
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (event.key === 'Enter') {
      if (activeSuggestionIndex >= 0) {
        updateFilter(index, 'value', suggestions[activeSuggestionIndex]);
        resetSuggestions();
      }
    } else if (event.key === 'Escape') {
      resetSuggestions();
    }
  };

  if (['isNull', 'isNotNull'].includes(filter.operator)) {

    return (
      <div className="flex flex-wrap items-center mb-2 bg-white p-2 rounded-md shadow-sm">
        {/* Column Selection */}
        <select
          value={filter.column}
          onChange={(e) => updateFilter(index, 'column', e.target.value)}
          className="mr-2 border border-brand rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
        >
          <option value="">Select Column</option>
          {showColumns.map((col) => (
            <option key={col} value={col}>
              {availableColumns[col]?.label || col}
            </option>
          ))}
        </select>

        {/* Operator Selection */}
        <select
          value={filter.operator}
          onChange={(e) => updateFilter(index, 'operator', e.target.value)}
          className="mr-2 border border-brand rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
          disabled={!filter.column}
        >
          <option value="">Select Operator</option>
          {getOperators(mapBackendToFrontendType(availableColumns[filter.column]?.type || 'String')).map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        {/* Value Input is not rendered for isNull and isNotNull */}
        <IconButton
          icon={<TrashIcon className="w-4 h-4 text-red-500" />}
          ariaLabel="Remove Filter"
          onClick={() => removeFilter(index)}
          className="ml-2"
        />
      </div>
    );
  }

  const columnTypeLower = mapBackendToFrontendType(
    availableColumns[filter.column]?.type || 'String'
  ).toLowerCase();

  return (
    <div className="flex flex-wrap items-center mb-2 bg-white p-2 rounded-md shadow-sm">
      {/* Column Selection */}
      <select
        value={filter.column}
        onChange={(e) => updateFilter(index, 'column', e.target.value)}
        className="mr-2 border border-brand rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
      >
        <option value="">Select Column</option>
        {showColumns.map((col) => (
          <option key={col} value={col}>

            { /* //TODO: Replace this available columns with current selected columns */}
            
            {availableColumns[col]?.label || col}
          </option>
        ))}
      </select>

      {/* Operator Selection */}
      <select
        value={filter.operator}
        onChange={(e) => updateFilter(index, 'operator', e.target.value)}
        className="mr-2 border border-brand rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
        disabled={!filter.column}
      >
        <option value="">Select Operator</option>
        {getOperators(mapBackendToFrontendType(availableColumns[filter.column]?.type || 'String')).map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Value Input */}
      <div className="relative flex-1">
        {columnTypeLower === 'boolean' ? (
          <div className="flex items-center space-x-1 mr-2">
            <input
              type="checkbox"
              checked={Boolean(filter.value)}
              onChange={(e) => updateFilter(index, 'value', e.target.checked)}
              className="form-checkbox h-4 w-4 text-brand focus:ring-brand-dark"
            />
            <span className="text-sm text-neutral-700">True</span>
          </div>
        ) : (
          <>
            <input
              type={
                columnTypeLower === 'number'
                  ? 'number'
                  : columnTypeLower === 'date'
                    ? 'date'
                    : 'text'
              }
              value={filter.value as string}
              onChange={(e) => {
                const newValue =
                  columnTypeLower === 'number'
                    ? e.target.valueAsNumber
                    : e.target.value;

                updateFilter(index, 'value', newValue);

                if (columnTypeLower === 'string') {
                  fetchSuggestions(filter.column, newValue as string);
                }
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => resetSuggestions()}
              className="border border-brand rounded-md p-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-brand-dark"
              placeholder="Enter value"
            />
            {columnTypeLower === 'string' && suggestions.length > 0 && (
              <ul className="absolute bg-white border border-neutral-200 rounded-md shadow-lg mt-1 z-50 max-h-40 overflow-y-auto w-full">
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className={`p-2 text-sm text-neutral-800 cursor-pointer hover:bg-brand-light ${i === activeSuggestionIndex ? 'bg-brand-light' : ''
                      }`}
                    onMouseDown={() => {
                      updateFilter(index, 'value', suggestion);
                      resetSuggestions();
                    }}
                    onMouseEnter={() => setActiveSuggestionIndex(i)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Remove Filter Button */}
      <IconButton
        icon={<TrashIcon className="w-4 h-4 text-red-500" />}
        ariaLabel="Remove Filter"
        onClick={() => removeFilter(index)}
        className="ml-2"
      />
    </div>
  );
};

export default FilterRow;
