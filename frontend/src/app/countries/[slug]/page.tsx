import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Legacy /countries/[slug] → homepage (Vietnam-only store) */
export default async function CountryPage({ params }: Props) {
  await params;
  redirect('/');
}
