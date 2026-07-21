import { View, Text } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  ChevronDownIcon,
  Input,
  InputField,
} from '@koudmain/ui/gluestack';

export type SelectorMissionPriceProps = {
  title: string;
  paymentType: string;
  setPaymentType: (value: string) => void;
  paymentOptions?: { label: string; value: string }[];
  amount?: string;
  setAmount?: (value: string) => void;
};

export default function SelectorMissionPrice({
  title,
  paymentType,
  setPaymentType,
  paymentOptions = [],
  amount,
  setAmount,
}: SelectorMissionPriceProps) {
  return (
    <View className="p-4">
      <View className="flex-row items-center gap-2">
        <Text className="text-primary font-inter font-bold text-xl">{title}</Text>
        <FontAwesome name="question-circle" size={24} color="black" />
      </View>
      <View className="flex-row items-center pt-3 gap-3">
        <FontAwesome5 name="money-check-alt" size={24} color="black" />
        <Input className="flex-1" variant="outline" isFocused={false} size="xl">
          <InputField
            type="text"
            className="font-jakarta font-bold font-size-16 text-right"
            placeholder="ex: 13.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </Input>
        <Select selectedValue={paymentType} onValueChange={(value) => setPaymentType(value)}>
          <SelectTrigger variant="outline" size="xl" className="flex-1 min-w-0 mr-3">
            <SelectInput placeholder="Choisir son forfait" value={paymentType} numberOfLines={1} />
            <SelectIcon as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {paymentOptions.map((option) => (
                <SelectItem key={option.value} label={option.label} value={option.value} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </View>
    </View>
  );
}
