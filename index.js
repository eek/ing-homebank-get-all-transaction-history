async function getTransactions() {
  // What account? 0 will be the first account, n will be the nth account
  let account = 0;

  // If you want to not include pending transactions
  // change the following to `false`
  let includePending = true;

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
  let orchardToken = hbPS['hb-apitoken'][0]['v'];

  const headers = {
    credentials: "same-origin",
    headers: {
      "Orchard-Token": orchardToken
    }
  };

  // Get all Accounts List
  let getAccountsRaw = await fetch(`https://www.homebank.ro/hb-restapi/hb-restapi/api-v1/accounts?t=${new Date().getTime()}&selfPayment=false&showClosedAccounts=true&showMutualFundsAccounts=true&showWallet=false`, headers)
    .then(res => res.text());

  // Remove the first 6 non-valid JSON characters before parsing
  getAccountsRaw = getAccountsRaw.substring(6);

  // Parse the accounts (String to JS)
  const accounts = JSON.parse(getAccountsRaw);

  // Get Current Account Details
  const currentAccount = accounts[account];

  // Get the requested account from Account Details
  const currentAccountID = currentAccount.id;

  // get the accountNumber to filter pendingTransactions just for this one.
  const currentAccountNumber = currentAccount.accountNumber;

  // Request Transactions - await for result
  let transactionsRaw = await fetch(`https://www.homebank.ro/hb-restapi/hb-restapi/api-v1/accounts/${currentAccountID}/transactions?t=${new Date().getTime()}&fromDate=${fromDate}&limit=${transactionsLimit}&offset=0&toDate=${toDate}`, headers)
    .then(res => res.text());

  // Remove the first 6 non-valid JSON characters before parsing
  transactionsRaw = transactionsRaw.substring(6);

  // Parse them to get an JS array
  const transactions = JSON.parse(transactionsRaw);
  let pendingTransactions = [];

  // IF we want to include pending, do the following:
  if (includePending) {
    // Request pending Transactions
    let pendingTransactionsRaw = await fetch(`https://www.homebank.ro/hb-restapi/hb-restapi/api-v1/pendingtransactions?t=${new Date().getTime()}`, headers)
      .then(res => res.text());

    // Remove the first 6 non-valid JSON characters before parsing
    pendingTransactionsRaw = pendingTransactionsRaw.substring(6);

    // Parse them to get an JS array
    // Filter the transactions to just the account we're requesting info for
    pendingTransactions = JSON.parse(pendingTransactionsRaw)
      .filter((el) => el.accountNo === currentAccountNumber);
  }

  // Concat all into an unique array
  const transactionsAll = pendingTransactions.concat(transactions);

  // We need to download the data so let's create an anchor to keep the date
  let el = document.createElement('a');

  // Create URL Object - faster than appending MB of data directly in the DOM
  // Stringify them before adding them to a blob.
  el.href = window.URL.createObjectURL(new Blob([JSON.stringify(transactionsAll)], {type: 'text/csv'}));

  // Set the URL as a download and the property as the filname
  // Add account Number, ID, fromDate and toDate
  el.download = `ING_Transactions_account_${currentAccountNumber}_id_${currentAccountID}_${fromDate}_to_${toDate}.json`;

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
