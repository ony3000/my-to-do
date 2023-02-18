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

  const rawCssContent = fs.readFileSync(path.resolve(__dirname, './output.css'), 'utf8');

  // ----------------
  // [arbitrary value 관련 이슈]
  //
  // square bracket 안에 따옴표가 존재할 경우, 컴파일된 css를 JSDOM에 삽입하는 과정에서 parsing error가 발생한다.
  //
  // [parsing error를 피하는 방법]
  //
  // 1. square bracket 안에 따옴표가 존재하는 classname을 custom (utility) class로 정의한다.
  // 장점: 의도하는 UI 그대로 테스트 진행할 수 있다.
  // 단점: classname 정의 방법에 따라, arbitrary value를 사용했을 때보다 직관성이 떨어질 수 있다.
  //
  // 2. 컴파일된 css에서 `\'`와 `\"`를 replace로 날려버린다.
  // 장점: 가장 간단하다.
  // 단점: arbitrary value를 사용해서 정의한 속성이 JSDOM에서 테스트 가능한 속성일 경우, 해당 classname은 테스트 불가능해진다.
  //
  // 3. jsdom/cssstyle 저장소에 `\'`와 `\"` parsing이 가능해지도록 기여한다.
  // 장점: 가장 이상적이다.
  // 단점:
  // - 얻고자 하는 기능의 규모(?)에 비해, 매우 많은 노력이 필요할 것 같다.
  // - 만약 기여에 성공하더라도, 그 코드를 포함하는 새 버전의 cssstyle이 릴리즈되어야 하고, 새 버전의 cssstyle을 의존하는 jsdom이 릴리즈되어야 하고, 새 버전의 jsdom을 의존하는 jest-environment-jsdom이 릴리즈되어야 할 것이다.
  // (한 마디로, 기여한 코드가 실사용 되기까지 얼마의 시간이 걸릴지 알 수 없다.)
  // ----------------

  const styleElement = document.createElement('style');
  styleElement.innerHTML = rawCssContent.replace(/(?:\\"|\\')/g, ''); // 2안
  document.head.appendChild(styleElement);

  return view;
};

export * from '@testing-library/react';
export { customRender as render };
