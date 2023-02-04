import classNames from 'classnames';

type ToggleButtonProps = {
  disabled?: boolean;
  isActive?: boolean;
  onToggle: () => void;
};

export default function ToggleButton({
  disabled = false,
  isActive = false,
  onToggle,
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        'group flex h-5 w-10 items-center rounded-full border border-solid px-[3px] outline-blue-500',
        { 'border-gray-500 bg-white hover:border-gray-700': !isActive },
        {
          'justify-end border-blue-500 bg-blue-500 hover:border-blue-600 hover:bg-blue-600':
            isActive,
        },
      )}
      title={isActive ? '끄기' : '켜기'}
      disabled={disabled}
      onClick={onToggle}
    >
      <span
        className={classNames(
          'inline-flex h-3 w-3 rounded-full',
          { 'bg-gray-500 group-hover:bg-gray-800': !isActive },
          { 'bg-white': isActive },
        )}
      />
      <span className="sr-only">{isActive ? '끄기' : '켜기'}</span>
    </button>
  );
}
