import { cnFusion } from '@/utils/cnFusion';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  shape?: 'round' | 'square';
  className?: string;
}

function IconButton({ onPress, icon, shape = 'round', className = '', ...props }: IconButtonProps) {
  const shapeClass = shape === 'round' ? 'rounded-full' : 'rounded-xl';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cnFusion(
        `bg-white p-4 shadow-lg items-center justify-center ${shapeClass}`,
        className,
      )}
      style={{ elevation: 5 }}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
}

export default IconButton;
