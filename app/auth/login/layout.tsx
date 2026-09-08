import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Sign In', 'Access your Capella Fits customer account.', '/auth/login', undefined, false);
export default function AccountLayout({ children }: { children: React.ReactNode }) { return children; }
