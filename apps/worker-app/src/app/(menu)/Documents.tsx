import React from 'react';
import { useRouter } from 'expo-router';
import { DocumentsScreen } from '@koudmain/ui/screens';

export default function DocumentsPage() {
  const router = useRouter();

  return <DocumentsScreen onBack={() => router.back()} />;
}
