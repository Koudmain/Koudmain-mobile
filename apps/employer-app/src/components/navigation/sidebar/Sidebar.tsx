import { Sidebar as SharedSidebar, SidebarItem } from '@koudmain/ui/components/navigation/Sidebar';
import { UserHeader } from './UserHeader';

const MENU_ITEMS: SidebarItem[] = [
  { label: 'Mon établissement', path: '/my-company' },
  { label: 'Paramètre du Compte', path: '/Settings' },
  { label: 'Mes documents', path: '/contracts' },
  { label: 'Notifications', path: '/notifications' },
];

export function Sidebar() {
  return <SharedSidebar items={MENU_ITEMS} header={() => <UserHeader />} padding="sections" />;
}
