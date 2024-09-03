import { useRouter } from 'next/navigation';
import EditCustomer from '@/components/Customer/EditCustomer';

const EditCustomerPage = ({ params }: { params: { id: string } }) => {
  

  if (!params.id) return null; 

  return (
    <div>
      <EditCustomer customerId={params.id} />
    </div>
  );
};

export default EditCustomerPage;
