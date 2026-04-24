// components/GlobalLoader.jsx
import React from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import ScrollLoading from './ScrollLoading';

export default function GlobalLoader() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching + isMutating > 0;

  console.log('GlobalLoader - isFetching:', isFetching, 'isMutating:', isMutating, 'isLoading:', isLoading);

  if (!isLoading) {
    return null;
  }

  return <ScrollLoading message="Loading..." />;
}