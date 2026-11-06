import { Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { IWorkerProfile, WorkerFormationType } from '../../../types/profile';
import { formatResponseDelay } from '../../../utils/date';
import { colors } from '../../../constants/theme';
import ProfileEmptyMessage from '../ProfileEmptyMessage';
import ProfileInfoRow from '../ProfileInfoRow';
import ProfileSection from '../ProfileSection';
import ProfileStats from '../ProfileStats';
import ProfileVerifications from '../ProfileVerifications';
import { WorkerDocumentCard } from './WorkerDocumentCard';

const VERIFICATION_ITEMS = [
  { type: 'IDENTITY', label: 'Identité', icon: 'badge' },
  { type: 'SOCIAL_SECURITY', label: 'Sécurité sociale', icon: 'health-and-safety' },
  { type: 'ADDRESS_PROOF', label: 'Justificatif de domicile', icon: 'home' },
] as const;

const FORMATION_ICONS: Record<
  WorkerFormationType,
  React.ComponentProps<typeof MaterialCommunityIcons>['name']
> = {
  FORMATION: 'certificate',
  DIPLOMA: 'school',
  PERMIT: 'car',
};

const formatExperienceDuration = (months: number | null) => {
  if (!months) return null;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return [
    years && `${years} an${years > 1 ? 's' : ''}`,
    remainingMonths && `${remainingMonths} mois`,
  ]
    .filter(Boolean)
    .join(' et ');
};

interface WorkerAboutTabProps {
  worker: IWorkerProfile;
  isOwnProfile?: boolean;
}

export function WorkerAboutTab({ worker, isOwnProfile = false }: WorkerAboutTabProps) {
  const { reliability, documents } = worker;
  const hasBackground = worker.experiences.length > 0 || worker.formations.length > 0;
  const hasDocuments = !!documents.cv || !!documents.coverLetter;

  return (
    <View>
      <ProfileSection title="À propos de moi">
        {worker.bio ? (
          <Text className="text-sm text-primary dark:text-white">{worker.bio}</Text>
        ) : (
          <ProfileEmptyMessage message="Ce travailleur n'a pas encore rédigé de présentation." />
        )}
      </ProfileSection>

      <ProfileStats
        className="mt-6"
        stats={[
          { value: String(reliability.missionsCompleted), label: 'missions réalisées' },
          {
            value: reliability.responseRate === null ? '—' : `${reliability.responseRate}%`,
            label: 'taux de réponse',
          },
          {
            value: formatResponseDelay(reliability.avgResponseTimeMin),
            label: 'délai pour répondre',
          },
        ]}
      />

      <ProfileSection title="Vérifications">
        <ProfileVerifications
          items={VERIFICATION_ITEMS.map((item) => ({
            label: item.label,
            icon: item.icon,
            verified:
              worker.verifications.find((verification) => verification.type === item.type)
                ?.status === 'VERIFIED',
          }))}
        />
      </ProfileSection>

      <ProfileSection title="Expériences & Formations">
        {hasBackground ? (
          <>
            {worker.experiences.map((experience) => (
              <ProfileInfoRow
                key={`experience-${experience.id}`}
                icon={<MaterialIcons name="work" size={24} color={colors.secondary.DEFAULT} />}
                text={experience.title}
                subtext={formatExperienceDuration(experience.durationMonths)}
              />
            ))}
            {worker.formations.map((formation) => (
              <ProfileInfoRow
                key={`formation-${formation.id}`}
                icon={
                  <MaterialCommunityIcons
                    name={FORMATION_ICONS[formation.type ?? 'FORMATION']}
                    size={24}
                    color={colors.secondary.DEFAULT}
                  />
                }
                text={formation.title}
                subtext={
                  [
                    formation.institution,
                    // Date sans heure (AAAA-MM-JJ) : new Date() la décalerait selon le fuseau
                    formation.obtainedDate?.slice(0, 4),
                  ]
                    .filter(Boolean)
                    .join(' · ') || null
                }
              />
            ))}
          </>
        ) : (
          <ProfileEmptyMessage message="Ce travailleur n'a pas encore renseigné d'expérience ni de formation." />
        )}
      </ProfileSection>

      {!isOwnProfile && (
        <ProfileSection title="Documents">
          {!worker.hasApplied ? (
            <ProfileEmptyMessage message="Le CV et la lettre de motivation sont visibles une fois que ce travailleur a postulé à l'une de vos offres." />
          ) : hasDocuments ? (
            <>
              {documents.cv && <WorkerDocumentCard label="CV" document={documents.cv} />}
              {documents.coverLetter && (
                <WorkerDocumentCard label="Lettre de motivation" document={documents.coverLetter} />
              )}
            </>
          ) : (
            <ProfileEmptyMessage message="Aucun document n'a été joint à sa candidature." />
          )}
        </ProfileSection>
      )}
    </View>
  );
}
