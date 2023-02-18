import colors from 'tailwindcss/colors';
import { render, screen } from '@/test-providers/tailwind';

describe('렌더링 결과 간단 테스트', () => {
  it('display: flex', () => {
    render(<div data-testid="div-01" className="flex" />);

    const element = screen.getByTestId('div-01');
    const computedStyle = window.getComputedStyle(element);

    expect(computedStyle.display).toBe('flex');
  });

  it('font-size: 14px', () => {
    render(<div data-testid="div-02" className="text-[14px]" />);

    const element = screen.getByTestId('div-02');
    const computedStyle = window.getComputedStyle(element);

    expect(computedStyle.fontSize).toBe('14px');
  });

  it('border: 1px solid blue-500', () => {
    render(<div data-testid="div-03" className="border border-solid border-blue-500" />);

    const element = screen.getByTestId('div-03');
    const computedStyle = window.getComputedStyle(element);

    expect(computedStyle.borderWidth).toBe('1px');
    expect(computedStyle.borderStyle).toBe('solid');
    expect(computedStyle.borderColor).toBe(colors.blue['500']);
  });

  it('background-color: gray-500', () => {
    render(<div data-testid="div-04" className="bg-gray-500" />);

    const element = screen.getByTestId('div-04');
    const computedStyle = window.getComputedStyle(element);

    expect(computedStyle.backgroundColor).toBe(colors.gray['500']);
  });
});
