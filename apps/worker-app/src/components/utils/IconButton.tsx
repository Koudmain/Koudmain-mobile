import { cnFusion } from '@koudmain/ui/utils/cnFusion';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  shape?: 'round' | 'square';
  className?: string;
}

/**
 *
 * @param onPress Fonction à appeler lorsque le bouton est pressée
 * @param icon L'icône à afficher à l'intérieur du bouton
 * @param shape La forme du bouton, soit 'round' pour un bouton circulaire, soit 'square' pour un bouton carré (par défaut: 'round')
 * @param className Classes supplémentaires pour le conteneur principal du bouton
 * @returns
 */
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
