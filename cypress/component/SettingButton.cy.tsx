import type { ComponentProps } from 'react';
import { Provider } from 'react-redux';
import colors from 'tailwindcss/colors';
import { store } from '@/lib/store/index';
import SettingButton from './SettingButton';
import { colorHex2regex } from './utils';

function MockHeader({ children }: ComponentProps<'div'>) {
  return <div className="flex h-12 items-center justify-end bg-blue-500">{children}</div>;
}

describe('SettingButton', () => {
  it('should mount', () => {
    cy.mount(
      <Provider store={store}>
        <MockHeader>
          <SettingButton />
        </MockHeader>
      </Provider>,
    );
    cy.get('button').contains('설정');
  });

  it('버튼 클릭 시 변화하는 스타일 확인 (1)', () => {
    cy.mount(
      <Provider store={store}>
        <MockHeader>
          <SettingButton />
        </MockHeader>
      </Provider>,
    );
    cy.get('button').click();

    cy.get('button')
      .should('have.css', 'background-color')
      .and('match', colorHex2regex(colors.zinc['100']));
    cy.get('button').should('have.css', 'color').and('match', colorHex2regex(colors.blue['500']));
  });

  it('버튼 클릭 시 변화하는 스타일 확인 (2)', () => {
    cy.mount(
      <Provider store={store}>
        <MockHeader>
          <SettingButton />
        </MockHeader>
      </Provider>,
    );
    cy.get('button').click();

    cy.get('button')
      .should('have.css', 'background-color')
      .and('match', colorHex2regex(colors.zinc['100']));
    cy.get('button').should('have.css', 'color').and('match', colorHex2regex(colors.blue['500']));
  });
});
