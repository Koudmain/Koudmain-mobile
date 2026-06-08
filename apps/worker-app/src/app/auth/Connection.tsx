import { ConnectionScreen } from '@koudmain/ui/screens/auth/ConnectionScreen';
import logo from '@/assets/images/logo/logo_v1.2_only_transparant.png';
import logo_white from '@/assets/images/logo/logo_v1.2_only_transparant_white.png';

export default function Connection() {
  return <ConnectionScreen logoLight={logo} logoDark={logo_white} />;
}
