import { GoogleRegistration, OwnerPosition } from '@koudmain/ui/api';

type RouteParams = Record<string, string | string[] | undefined>;

export function buildRegisterData(
  params: RouteParams,
  appContext: 'employer' | 'worker',
): GoogleRegistration {
  const getParam = (key: string) =>
    Array.isArray(params[key]) ? params[key][0] : (params[key] as string);

  return {
    firstName: getParam('firstName'),
    lastName: getParam('lastName'),
    phoneNumber: getParam('phoneNumber'),
    birthDate: getParam('birthDate'),
    role: appContext === 'employer' ? 'EMPLOYER' : 'WORKER',
    workerProfile:
      appContext === 'worker'
        ? {
            skillCategoryIds: getParam('selectedJobs')
              ? getParam('selectedJobs')
                  .split(',')
                  .map((id: string) => parseInt(id, 10))
              : [1],
            bio: getParam('bio'),
            workRadius: parseInt(getParam('radius') || '10', 10),
            address: getParam('streetName')
              ? {
                  streetNumber: getParam('streetNumber') || undefined,
                  streetName: getParam('streetName') || '',
                  zipCode: getParam('zipCode') || '',
                  city: getParam('city') || '',
                  country: getParam('country') || 'France',
                  latitude: parseFloat(getParam('latitude') || '0'),
                  longitude: parseFloat(getParam('longitude') || '0'),
                }
              : undefined,
          }
        : undefined,
    employerProfile:
      appContext === 'employer'
        ? {
            companyName: getParam('companyName') || 'Entreprise inconnue',
            companyType: getParam('companyType') || 'Autre',
            ownerPosition: (getParam('ownerPosition') as OwnerPosition) || 'OWNER',
            desiredJobIds: getParam('desiredJobIds')
              ? getParam('desiredJobIds')
                  .split(',')
                  .map((id: string) => parseInt(id, 10))
              : [],
            address: getParam('streetName')
              ? {
                  streetNumber: getParam('streetNumber') || undefined,
                  streetName: getParam('streetName') || '',
                  zipCode: getParam('zipCode') || '',
                  city: getParam('city') || '',
                  country: getParam('country') || 'France',
                  latitude: parseFloat(getParam('latitude') || '0'),
                  longitude: parseFloat(getParam('longitude') || '0'),
                }
              : undefined,
          }
        : undefined,
  };
}
