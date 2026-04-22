import React from 'react';

export const unpackChildren = (node: React.ReactNode): React.ReactNode[] => {
  return React.Children.toArray(node).flatMap((child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return unpackChildren(child.props.children);
    }
    return [child];
  });
};
