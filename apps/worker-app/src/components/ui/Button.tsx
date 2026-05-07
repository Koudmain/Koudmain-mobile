import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'muted';

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  imageSource?: ImageSourcePropType;
  imageClassName?: string;
  icon?: React.FC<SvgProps>;
  iconSize?: number;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-secondary items-center rounded-lg py-2 px-4',
  secondary:
    'bg-white dark:bg-primary border border-secondary-400 items-center rounded-lg py-2 px-4',
  outline: 'border border-primary dark:border-white items-center rounded-lg py-2 px-4',
  muted: 'bg-secondary-300 items-center rounded-lg py-2 px-4',
};

const textVariantStyles: Record<ButtonVariant, string> = {
  primary: 'text-white text-lg font-bold',
  secondary: 'text-secondary-400 text-lg font-bold',
  outline: 'text-primary dark:text-white text-lg font-bold',
  muted: 'text-white text-lg font-bold',
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'py-1.5 px-3',
  md: 'py-2 px-4',
  lg: 'py-3 px-6',
};

export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  className = '',
  imageSource,
  imageClassName = '',
  icon: Icon,
  iconSize = 20,
  ...props
}: ButtonProps) {
  const baseStyle = variantStyles[variant];
  const textStyle = textVariantStyles[variant];
  const sizingOverride = sizeStyles[size];

  return (
    <TouchableOpacity
      className={[baseStyle, sizingOverride, 'flex-row items-center justify-center', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {Icon ? (
        <Icon width={iconSize} height={iconSize} style={{ marginRight: 8 }} />
      ) : imageSource ? (
        <Image
          source={imageSource}
          className={['w-5 h-5 mr-2', imageClassName].filter(Boolean).join(' ')}
        />
      ) : null}
      <Text className={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
