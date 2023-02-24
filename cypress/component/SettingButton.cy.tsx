import type { ComponentProps } from 'react';
import colors from 'tailwindcss/colors';
import { getStore } from '@/lib/store/index';
import SettingButton from './SettingButton';
import { colorHex2regex } from './utils';

function MockHeader({ children }: ComponentProps<'div'>) {
  return <div className="flex h-12 items-center justify-end bg-blue-500">{children}</div>;
}

describe('SettingButton', () => {
  context('', () => {
    it('should mount', () => {
      const store = getStore();

      cy.mount(
        <MockHeader>
          <SettingButton />
        </MockHeader>,
        { reduxStore: store },
      );
      cy.get('button').contains('설정');
    });

    it('버튼 클릭 시 변화하는 스타일 확인 (1)', () => {
      const store = getStore();

      cy.mount(
        <MockHeader>
          <SettingButton />
        </MockHeader>,
        { reduxStore: store },
      );
      cy.get('button').click();

      cy.get('button')
        .should('have.css', 'background-color')
        .and('match', colorHex2regex(colors.zinc['100']));
      cy.get('button').should('have.css', 'color').and('match', colorHex2regex(colors.blue['500']));
    });

    it('버튼 클릭 시 변화하는 스타일 확인 (2)', () => {
      const store = getStore();

      cy.mount(
        <MockHeader>
          <SettingButton />
        </MockHeader>,
        { reduxStore: store },
      );
      cy.get('button').click();

      cy.get('button')
        .should('have.css', 'background-color')
        .and('match', colorHex2regex(colors.zinc['100']));
      cy.get('button').should('have.css', 'color').and('match', colorHex2regex(colors.blue['500']));
    });
  });

  context(
    'native event 테스트 (주의: 테스트 진행 중인 브라우저에 마우스 커서가 들어가면, hover나 focus 등의 상태 테스트는 실패할 수 있음)',
    () => {
      it('hover 스타일 테스트', () => {
        const store = getStore();

        cy.mount(
          <MockHeader>
            <SettingButton />
          </MockHeader>,
          { reduxStore: store },
        );
        cy.get('button').realHover();

        cy.get('button')
          .should('have.css', 'background-color')
          .and('match', colorHex2regex(colors.blue['700']));
      });

      it('active 스타일 테스트', () => {
        const store = getStore();

        cy.mount(
          <MockHeader>
            <SettingButton />
          </MockHeader>,
          { reduxStore: store },
        );
        cy.get('button').realMouseDown();

        cy.get('button')
          .should('have.css', 'background-color')
          .and('match', colorHex2regex(colors.blue['900']));
        cy.get('button').realMouseUp();
      });
    },
  );
});
