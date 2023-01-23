import classNames from 'classnames';

type IconContainerProps = {
  size?: 'small' | 'medium' | 'large';
  iconClassName: string;
  iconLabel: string;
};

export default function IconContainer({
  size = 'medium',
  iconClassName,
  iconLabel,
}: IconContainerProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center justify-center',
        { 'h-4 w-4': size === 'small' },
        { 'h-6 w-6': size === 'medium' },
        { 'h-8 w-8': size === 'large' },
      )}
    >
      <i className={iconClassName} />
      <span className="sr-only">{iconLabel}</span>
    </span>
  );
}
