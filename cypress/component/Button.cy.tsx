import type { ComponentProps } from 'react';
import classNames from 'classnames';

function Button({ className, children, ...rest }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={classNames(
        'self-start rounded-sm border-2 border-solid border-transparent bg-cyan-500 py-2 px-6 text-white duration-75 hover:border-gray-700 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

describe('Button', () => {
  it('should mount', () => {
    cy.mount(<Button>Click Me</Button>);
    cy.get('button').contains('Click Me');
  });

  it('when button is clicked, should call onClick', () => {
    cy.mount(<Button onClick={cy.spy().as('onClick')}>Click Me</Button>);
    cy.get('button').contains('Click Me').click();
    cy.get('@onClick').should('have.been.called');
  });
});
