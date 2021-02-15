import React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

class AppSplash extends React.Component {
  render() {
    return (
      <main>
        <img className="icon" src="/images/todo_check.png" alt="" />

        <span className="spinner animate-spin">
          <span className="sr-only">Loading...</span>
        </span>

        <style jsx>{`
          main {
            padding: 8.75rem 0 5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .icon {
            margin: auto 0;
          }

          .spinner {
            width: 60px;
            height: 60px;
            border: 2px solid transparent;
            border-radius: 50%;
            border-top-color: ${fullConfig.theme.colors.blue[500]};
          }
        `}</style>
      </main>
    );
  }
}

export default AppSplash;
