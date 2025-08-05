const API_URL = '/api';

async function fetchDonations() {
  const res = await fetch(API_URL + '/donations');
  const data = await res.json();
  const list = document.getElementById('donation-list');
  list.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow p-4 flex flex-col justify-between';
    card.innerHTML = `
      <img src="${item.imageUrl || 'https://via.placeholder.com/200'}" alt="${item.item}" class="rounded-lg mb-2">
      <h3 class="text-lg font-bold">${item.item}</h3>
      <p class="text-gray-500">Condition: ${item.condition}</p>
      <p class="text-gray-600">Category: ${item.category || 'N/A'}</p>
      <p class="text-gray-700">Donor: ${item.donor}</p>
      ${item.recipient ? `<span class="text-red-500 mt-2">Claimed by ${item.recipient}</span>` 
        : `<button onclick="claimItem('${item._id}')" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Claim</button>`}
    `;
    list.appendChild(card);
  });
}

async function donateItem() {
  const item = document.getElementById('item').value;
  const condition = document.getElementById('condition').value;
  const donor = document.getElementById('donor').value;
  const category = document.getElementById('category').value;
  const imageUrl = document.getElementById('imageUrl').value;

  if (!item || !condition || !donor) {
    alert('Please fill all required fields!');
    return;
  }

  await fetch(API_URL + '/donate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item, condition, donor, category, imageUrl })
  });

  document.getElementById('item').value = '';
  document.getElementById('condition').value = '';
  document.getElementById('donor').value = '';
  document.getElementById('category').value = '';
  document.getElementById('imageUrl').value = '';

  fetchDonations();
}

async function claimItem(id) {
  const recipient = prompt('Enter your name to claim this item:');
  if (!recipient) return;
  await fetch(API_URL + '/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, recipient })
  });
  fetchDonations();
}

fetchDonations();
