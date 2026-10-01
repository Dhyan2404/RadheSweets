import { initialData } from '../src/data.js';
console.log('Customers count:', initialData.customers?.length);
console.log('Order status counts:', initialData.orderStatusCounts);
console.log('Orders length:', initialData.orders?.length);
const completed = initialData.orders?.filter(o => o.status === 'Completed').length;
const advance = initialData.orders?.filter(o => o.status === 'Advance Booking').length;
const kitchen = initialData.orders?.filter(o => o.status === 'Kitchen Packing').length;
console.log('Counts:', { completed, advance, kitchen });
