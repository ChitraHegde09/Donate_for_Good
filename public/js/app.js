const API_URL = '/api';

async function fetchDonations() {
    const res = await fetch(API_URL + '/donations');
    const data = await res.json();
    const list = document.getElementById('donation-list');
    list.innerHTML = '';
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.item} (${item.condition}) - Donor: ${item.donor} 
            ${item.recipient ? `<span>Claimed by ${item.recipient}</span>` : `<button onclick="claimItem(${item.id})">Claim</button>`}`;
        list.appendChild(li);
    });
}

async function donateItem() {
    const item = document.getElementById('item').value;
    const condition = document.getElementById('condition').value;
    const donor = document.getElementById('donor').value;

    await fetch(API_URL + '/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, condition, donor })
    });
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
