export const emptyState = () => ({ income: 0, savingsAllocation: 0, expensesAllocation: 0, budget: 0, accounts: [], transactions: [], onboardingComplete: false });
export const normalizeState = value => {
  const next = { ...emptyState(), ...(value || {}) };
  next.accounts = Array.isArray(next.accounts) ? next.accounts : [];
  next.transactions = Array.isArray(next.transactions) ? next.transactions : [];
  if (next.expensesAllocation == null) next.expensesAllocation = Number(next.budget || 0);
  next.budget = Number(next.expensesAllocation || 0);
  next.income = Number(next.income || 0);
  next.savingsAllocation = Number(next.savingsAllocation || 0);
  return next;
};
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
export const dateKey = date => { const d = date || new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const monthTransactions = state => { const d = new Date(), m = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; return state.transactions.filter(t => String(t.date || '').slice(0,7) === m); };
export const total = (items, type) => items.filter(t => t.type === type).reduce((sum,t) => sum + Number(t.amount || 0), 0);
export const categories = ['Food & Dining','Groceries','Transport','Shopping','Bills & Utilities','Health','Entertainment','Travel','Education','Salary','Investment','Other'];
export function suggestCategory(description, type='expense') {
  if (type === 'income') return /salary|payroll/i.test(description) ? 'Salary' : 'Other';
  const s = String(description || '').toLowerCase();
  const rules = [['Food & Dining',/restaurant|cafe|coffee|swiggy|zomato|food|pizza|burger/],['Groceries',/grocery|zepto|blinkit|instamart|supermarket|mart/],['Transport',/uber|ola|metro|fuel|petrol|rapido|bus|train/],['Shopping',/amazon|flipkart|myntra|shopping|store/],['Bills & Utilities',/electric|water|recharge|broadband|mobile|bill/],['Health',/pharmacy|hospital|doctor|medicine|health/],['Entertainment',/movie|cinema|netflix|spotify|game/],['Travel',/hotel|flight|airline|booking|makemytrip/],['Education',/course|book|school|college|tuition/]];
  return rules.find(([,re]) => re.test(s))?.[0] || 'Other';
}
export function downloadJSON(data, name='money-os-backup.json') { const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url); }
