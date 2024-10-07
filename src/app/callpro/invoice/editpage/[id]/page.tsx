import EditInvoicePage from '@/components/invoice/EditInvoicePage';

interface PageProps {
  params: { id: string };
}

const Page = ({ params }: PageProps) => {
  const { id } = params;

  if (!id) {
    return <div>Loading...</div>; // or handle error, show message
  }

  return (
    <div>
      <EditInvoicePage invoiceId={id} />
    </div>
  );
};

export default Page;
