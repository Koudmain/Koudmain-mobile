import { View } from 'react-native';
import DurationZone, {
  FDurationLongMissionFilter,
  defaultFDurationLongMissionFilter,
} from './DurationZone';
import RemunerationLongZone, {
  FRemunerationLongMissionFilter,
  defaultFRemunerationLongMissionFilter,
} from './RemunerationZone';

export interface FLongMissionFilter {
  remuneration: FRemunerationLongMissionFilter;
  duration: FDurationLongMissionFilter;
  active: boolean;
  enabled: boolean;
}

export const defaultLongMissionFilter: FLongMissionFilter = {
  remuneration: defaultFRemunerationLongMissionFilter,
  duration: defaultFDurationLongMissionFilter,
  active: false,
  enabled: true,
};

interface LongMissionFilterProps {
  filters: FLongMissionFilter;
  setFilters: (filters: FLongMissionFilter) => void;
}

export default function LongMissionFilter({ filters, setFilters }: LongMissionFilterProps) {
  const handleRemunerationChange = (remuneration: FRemunerationLongMissionFilter) => {
    const nextFilters = { ...filters, remuneration };

    setFilters({
      ...nextFilters,
      active: Boolean(remuneration.active || nextFilters.duration.active),
    });
  };

  const handleDurationChange = (duration: FDurationLongMissionFilter) => {
    const nextFilters = { ...filters, duration };

    setFilters({
      ...nextFilters,
      active: Boolean(nextFilters.remuneration.active || duration.active),
    });
  };

  return (
    <View className="space-y-4 pb-32">
      <RemunerationLongZone filters={filters.remuneration} setFilters={handleRemunerationChange} />

      <DurationZone filters={filters.duration} setFilters={handleDurationChange} />
    </View>
  );
}
