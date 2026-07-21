import PubliCards from '@/components/PubliCards';
import { AppScrollView } from '@koudmain/ui/components/layout/AppScrollView';

export default function Publication() {
  const desc1 =
    'Cherchons une personne expérimentée pour un service lors d’une soirée de forte influence. Maitrise de la prise de commande numérique requise. Une personne gérant la pression et le période de rush recommandé.';
  const desc2 =
    'Cherchons une personne expérimentée pour un service lors d’un midi de forte influence. Maitrise de la  cuisine française requise. Votre tâche sera d’aider le chef, et de suivre les missions qu’il pourra vous donner.';

  return (
    <AppScrollView contentContainerClassName="items-center py-4 gap-4 bg-white pt-20">
      <PubliCards
        data={{
          title: 'Serveur H/F',
          date: 'Lun. 25 Mars 2026',
          description: desc1,
          time: '18h00 - 23h00 (5h)',
          views: 123,
          clicks: 23,
          competence: { name1: 'Barman', name2: 'Serveur' },
        }}
      />
      <PubliCards
        data={{
          title: 'Serveur H/F',
          date: 'Lun. 25 Mars 2026',
          description: desc1,
          time: '18h00 - 23h00 (5h)',
          views: 67,
          clicks: 12,
          competence: { name1: 'Barman', name2: 'Serveur' },
        }}
      />
      <PubliCards
        data={{
          title: 'Commis de cuisine',
          date: 'Mar. 26 Mars 2026',
          description: desc2,
          time: '15h00 - 21h00 (6h)',
          views: 456,
          clicks: 45,
          competence: { name1: 'Barman', name2: 'Serveur' },
        }}
      />
      <PubliCards
        data={{
          title: 'Commis de cuisine',
          date: 'Mar. 26 Mars 2026',
          description: desc2,
          time: '15h00 - 21h00 (6h)',
          views: 456,
          clicks: 45,
          competence: { name1: 'Barman', name2: 'Serveur' },
        }}
      />
    </AppScrollView>
  );
}
