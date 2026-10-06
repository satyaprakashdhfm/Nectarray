import type { Href } from 'expo-router';

import type { Practice } from '@/lib/api';

/** Where each practice leads: the academy has a tab of its own. */
export const practiceHref = (id: Practice['id']): Href =>
  id === 'academy' ? '/academy' : { pathname: '/services/[id]', params: { id } };

/** The contact form's interest that matches each practice. */
export const INTEREST: Record<Practice['id'], string> = {
  marketing: 'Marketing & growth',
  software: 'Website or web app',
  ai: 'AI agent or chatbot',
  academy: 'Academy enrolment',
};

/** The contact tab, with the right interest already picked. */
export const contactHref = (id?: Practice['id']): Href =>
  id ? { pathname: '/contact', params: { interest: INTEREST[id] } } : '/contact';
