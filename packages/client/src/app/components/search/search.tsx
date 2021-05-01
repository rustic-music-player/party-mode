import './search.scss';
import React from 'react';
import { classnames } from '../../classnames';

export interface SearchProps {
  className?: string;
}

const Search = ({ className }: SearchProps) => <div className={classnames("search", className)}>
  <input type="search" placeholder="Search..." className="search__input"/>
</div>;

export default Search;
