import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Create Account', 'Access your Capella Fits customer account.', '/auth/signup', undefined, false);
export default function AccountLayout({ children }: { children: React.ReactNode }) { return children; }
