import { Sidebar as SharedSidebar, SidebarItem } from '@koudmain/ui/components/navigation/Sidebar';
import { UserHeader } from './UserHeader';

const MENU_ITEMS: SidebarItem[] = [
  { label: 'Mon profil', path: '/my-profile' },
  { label: 'Mon porte-monnaie', path: '/YourOffers' },
  { label: 'Mes candidatures', path: '/applications' },
  { label: 'Paramètre du Compte', path: '/Settings' }, // Pertinance à revoir
  { label: 'Mes documents', path: '/contracts' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Mes favoris', path: '/YourOffers' },
];

export function Sidebar() {
  return (
    <SharedSidebar
      items={MENU_ITEMS}
      header={(navigate) => <UserHeader onPress={() => navigate('/my-profile')} />}
      padding="container"
    />
  );
}
