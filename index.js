async function getTransactions() {
  // What account? It might be 0 or it might be 1 (especially if you have 2 account)
  // If you have just 1 account, it's most likely 0.
  let account = 0;

  // Set the limit of transactions
  let transactionsLimit = 100000;

  // From when to request - first tranasctions
  let fromDate = '01-01-2008';

  // To when - default it's today, but it can also be like fromDate

  let toDate = new Date().toISOString().split('T')[0].split('-').reverse().join('-');
  // let toDate = '31-05-2018';


  // We need to get the API token in order to get a proper response back
  let hbPS = JSON.parse(localStorage.getItem('hb-ps'));

  // The API Token also called Orchard Token in requests
  let orchardToken = hbPS['hb-apitoken'][0];

  // Request data - await for result
  const transactions = await fetch(`https://www.homebank.ro/hb-restapi/hb-restapi/api-v1/accounts/${account}/transactions?t=${new Date().getTime()}&fromDate=${fromDate}&limit=${transactionsLimit}&offset=0&toDate=${toDate}`,
    {
      credentials: "same-origin",
      headers: {
        "Orchard-Token": orchardToken
      }
    }
  ).then(res => res.text());

  // We need to download the data so let's create an anchor to keep the date
  let el = document.createElement('a');

  // Create URL Object - faster than appending MB of data directly in the DOM
  // We also need to start from position 6, they append some weird closing thingie at the beginning lol.
  el.href = window.URL.createObjectURL(new Blob([transactions.substring(6)], {type: 'text/csv'}));

  // Set the URL as a download and the property as the filname
  el.download = `ING_Transactions_${fromDate}_to_${toDate}.json`;

  // No need to show it
  el.style.display = 'none';

  // Append to body.
  document.body.appendChild(el);

  // Trigger download
  el.click();

  // Remove from body.
  document.body.removeChild(el);

  //We're done! Woop Woop
}

getTransactions();
