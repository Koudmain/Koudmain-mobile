import { Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ICompanyProfile } from '../../../types/profile';
import { formatResponseDelay } from '../../../utils/date';
import { colors } from '../../../constants/theme';
import ProfileEmptyMessage from '../ProfileEmptyMessage';
import ProfileInfoRow from '../ProfileInfoRow';
import ProfileSection from '../ProfileSection';
import ProfileStats from '../ProfileStats';
import ProfileVerifications from '../ProfileVerifications';

interface CompanyAboutTabProps {
  company: ICompanyProfile;
}

export function CompanyAboutTab({ company }: CompanyAboutTabProps) {
  const { reliability } = company;
  const establishmentSize = [
    company.capacity ? `${company.capacity} couverts` : null,
    company.teamSize,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View>
      <ProfileSection title="À propos de nous">
        {company.description ? (
          <Text className="text-sm text-primary dark:text-white">{company.description}</Text>
        ) : (
          <ProfileEmptyMessage message="Cet établissement n'a pas encore rédigé de présentation." />
        )}
      </ProfileSection>

      <ProfileStats
        className="mt-6"
        stats={[
          { value: String(reliability.missionsPublished), label: 'missions publiées' },
          {
            value: reliability.paidOnTimeRate === null ? '-' : `${reliability.paidOnTimeRate}%`,
            label: 'payées à temps',
          },
          {
            value: formatResponseDelay(reliability.avgResponseTimeMin),
            label: 'délai pour répondre',
          },
        ]}
      />

      <ProfileSection title="Vérifications">
        <ProfileVerifications
          items={[
            { label: 'SIRET vérifié', icon: 'verified-user', verified: company.siretVerified },
            {
              label: 'Établissement validé par Koudmain',
              icon: 'corporate-fare',
              verified: company.koudmainValidated,
            },
          ]}
        />
      </ProfileSection>

      <ProfileSection title="Notre établissement">
        {!!establishmentSize && (
          <ProfileInfoRow
            icon={<MaterialIcons name="groups" size={26} color={colors.secondary.DEFAULT} />}
            text={establishmentSize}
          />
        )}
        <ProfileInfoRow
          icon={<MaterialIcons name="restaurant" size={24} color={colors.secondary.DEFAULT} />}
          text={company.mealProvided ? 'Repas fourni aux extras' : 'Repas non fourni'}
        />
        {!!company.dressCode && (
          <ProfileInfoRow
            icon={
              <MaterialCommunityIcons
                name="tshirt-crew-outline"
                size={24}
                color={colors.secondary.DEFAULT}
              />
            }
            text={company.dressCode}
          />
        )}
      </ProfileSection>
    </View>
  );
}
