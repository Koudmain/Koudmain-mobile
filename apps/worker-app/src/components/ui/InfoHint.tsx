import { cnFusion } from '@koudmain/ui/utils/cnFusion';
import React, { useState, useRef } from 'react';
import { Pressable, Text, View, Modal, TouchableWithoutFeedback } from 'react-native';

interface InfoHintProps {
  icon: React.ReactNode;
  texts: string[];
  className?: string;
}

/**
 *
 * @param icon L'icône à afficher pour le bouton d'information
 * @param texts Un tableau de textes à afficher dans l'infobulle (chaque élément du tableau correspond à une ligne de texte)
 * @param className Classes supplémentaires pour le conteneur principal
 * @returns Un composant InfoHint qui affiche une infobulle avec les textes fournis lorsque l'icône est pressée
 */
export default function InfoHint({ icon, texts, className = '' }: InfoHintProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<View>(null);

  const toggleTooltip = () => {
    if (!isOpen && buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setCoords({ x, y, width, height });
        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <View className={cnFusion('flex flex-1', className)} ref={buttonRef} collapsable={false}>
      <Pressable
        onPress={toggleTooltip}
        className="h-9 w-9 items-center justify-center rounded-full bg-secondary/10 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel={isOpen ? 'Masquer les informations' : 'Afficher les informations'}
      >
        {icon}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className="flex-1 bg-transparent">
            <View
              style={{
                top: coords.y + coords.height + 8,
                left: Math.max(16, coords.x - 100),
              }}
              className="absolute w-64 rounded-2xl bg-primary border border-primary-500 p-4 gap-y-2 shadow-2xl"
            >
              {texts.map((text, index) => (
                <Text key={`${text}-${index}`} className="text-sm text-white">
                  {text}
                </Text>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
