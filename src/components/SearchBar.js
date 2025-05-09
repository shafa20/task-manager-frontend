import React from 'react';
import { TextField } from '@shopify/polaris';

const SearchBar = ({ value, onChange }) => (
  <TextField
    label="Search Tasks By Name"
    value={value}
    onChange={onChange}
    autoComplete="off"
    clearButton
    onClearButtonClick={() => onChange('')}
  />
);

export default React.memo(SearchBar);
