const fs = require('fs');
let c = fs.readFileSync('src/components/CustomersView.ts', 'utf8');
const idx = c.indexOf('data-view-customer-profile');
if (idx !== -1) {
  // Find start of button tag
  const btnStart = c.lastIndexOf('<button', idx);
  // Find end of button tag
  const btnEnd = c.indexOf('</button>', idx) + '</button>'.length;
  c = c.substring(0, btnStart) + c.substring(btnEnd);
  c = c.replace('class="flex-1 py-2 bg-[#C86D3B]', 'class="w-full py-2 bg-[#C86D3B]');
  fs.writeFileSync('src/components/CustomersView.ts', c, 'utf8');
  console.log('SUCCESS: History button removed');
} else {
  console.log('Not found');
}
