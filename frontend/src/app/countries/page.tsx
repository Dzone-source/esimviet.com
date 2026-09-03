import { redirect } from 'next/navigation';

/** Legacy /countries → homepage (Vietnam-only store) */
export default function CountriesIndexPage() {
  redirect('/');
}
