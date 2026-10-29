import { GoogleRegistration, OwnerPosition } from '@koudmain/ui/api';

type RouteParams = Record<string, string | string[] | undefined>;

export function firstParam(params: RouteParams, key: string): string {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

export function buildRegisterData(
  params: RouteParams,
  appContext: 'employer' | 'worker',
): GoogleRegistration {
  const getParam = (key: string) => firstParam(params, key);
  const address = getParam('streetName')
    ? {
        streetNumber: getParam('streetNumber') || undefined,
        streetName: getParam('streetName'),
        zipCode: getParam('zipCode'),
        city: getParam('city'),
        country: getParam('country') || 'France',
        latitude: parseFloat(getParam('latitude') || '0'),
        longitude: parseFloat(getParam('longitude') || '0'),
      }
    : undefined;

  return {
    firstName: getParam('firstName'),
    lastName: getParam('lastName'),
    phoneNumber: getParam('phoneNumber') || '0600000000',
    birthDate: getParam('birthDate') || '1990-01-01',
    role: appContext === 'employer' ? 'EMPLOYER' : 'WORKER',
    workerProfile:
      appContext === 'worker'
        ? {
            skillCategoryIds: getParam('selectedJobs')
              ? getParam('selectedJobs')
                  .split(',')
                  .map((id: string) => parseInt(id, 10))
              : [1],
            bio: getParam('bio') || undefined,
            workRadius: parseInt(getParam('radius') || '10', 10),
            address,
          }
        : undefined,
    employerProfile:
      appContext === 'employer'
        ? {
            companyName: getParam('companyName') || 'Entreprise inconnue',
            companyType: getParam('companyType') || 'Autre CHR',
            ownerPosition: (getParam('ownerPosition') as OwnerPosition) || 'OWNER',
            desiredJobIds: getParam('desiredJobIds')
              ? getParam('desiredJobIds')
                  .split(',')
                  .map((id: string) => parseInt(id, 10))
              : [],
            address,
          }
        : undefined,
  };
}
