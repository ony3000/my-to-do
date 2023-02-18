import fs from 'fs';
import path from 'path';
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

function AllTheProviders({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const view = render(ui, { wrapper: AllTheProviders, ...options });

  const styleElement = document.createElement('style');
  styleElement.innerHTML = fs.readFileSync(path.resolve(__dirname, './output.css'), 'utf8');
  document.head.appendChild(styleElement);

  return view;
};

export * from '@testing-library/react';
export { customRender as render };
