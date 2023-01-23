import { ThemeColor } from '@/lib/types/enums';

export function textColor(color: unknown) {
  switch (color) {
    case ThemeColor.Red:
      return 'text-red-500';
    case ThemeColor.Violet:
      return 'text-violet-500';
    case ThemeColor.Lime:
      return 'text-lime-500';
    case ThemeColor.Amber:
      return 'text-amber-500';
    case ThemeColor.Blue:
    default:
      return 'text-blue-500';
  }
}

export function textBoldColor(color: unknown) {
  switch (color) {
    case ThemeColor.Red:
      return 'text-red-700';
    case ThemeColor.Violet:
      return 'text-violet-700';
    case ThemeColor.Lime:
      return 'text-lime-700';
    case ThemeColor.Amber:
      return 'text-amber-700';
    case ThemeColor.Blue:
    default:
      return 'text-blue-700';
  }
}

export function placeholderColor(color: unknown) {
  switch (color) {
    case ThemeColor.Red:
      return 'placeholder-red-500';
    case ThemeColor.Violet:
      return 'placeholder-violet-500';
    case ThemeColor.Lime:
      return 'placeholder-lime-500';
    case ThemeColor.Amber:
      return 'placeholder-amber-500';
    case ThemeColor.Blue:
    default:
      return 'placeholder-blue-500';
  }
}
