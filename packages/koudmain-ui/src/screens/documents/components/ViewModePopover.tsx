import React from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../../constants/theme';
import { FolderDisplayMode } from '../types';

interface ViewModePopoverProps {
  visible: boolean;
  currentMode: FolderDisplayMode;
  onSelectMode: (mode: FolderDisplayMode) => void;
  onClose: () => void;
}

export function ViewModePopover({
  visible,
  currentMode,
  onSelectMode,
  onClose,
}: ViewModePopoverProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/10">
          <View className="absolute right-4 top-32 w-14 bg-white dark:bg-[#2C2C2E] rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 py-1 items-center">
            <TouchableOpacity
              onPress={() => {
                onSelectMode('grid');
                onClose();
              }}
              className={`w-full py-2.5 items-center justify-center ${
                currentMode === 'grid' ? 'bg-gray-100 dark:bg-neutral-700' : ''
              }`}
            >
              <Ionicons
                name="grid-outline"
                size={18}
                color={currentMode === 'grid' ? colors.secondary.DEFAULT : '#8E8E93'}
              />
            </TouchableOpacity>

            <View className="h-px w-4/5 bg-gray-200 dark:bg-neutral-700 my-0.5" />

            <TouchableOpacity
              onPress={() => {
                onSelectMode('list');
                onClose();
              }}
              className={`w-full py-2.5 items-center justify-center ${
                currentMode === 'list' ? 'bg-gray-100 dark:bg-neutral-700' : ''
              }`}
            >
              <Feather
                name="list"
                size={18}
                color={currentMode === 'list' ? colors.secondary.DEFAULT : '#8E8E93'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
