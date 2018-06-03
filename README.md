## Get Full Account History from ING Homebank in JSON format
Bypass the pesky 24 months limit and get a full detailed actual computer-readable format (JSON) file of your transactions 

I usually hate it when companies impose limits that don't really have any meaning behind them.

I needed a computer readable format of all my transactions I've made from my ING account, their CSV export are really unusable and they also have this no-sense 24 months limit.

### But whyyyyy?

So, the script from this repo is actually a console-script that downloads ALL your Transactions is a nice JSON format.

What do you need to do for it to work?

1. Log in to https://www.homebank.ro/
2. Go to the Transactions Report Screen (Raport tranzactii) in the new interface
3. Open the console
4. Paste the script (from here - https://github.com/eek/ing-homebank-get-all-transaction-history/blob/master/index.js)

After you paste the script, you'll get a `.json` file to download.

That's it!

Enjoy!

#### Variables

Yes, the script has some variables you can change!

They are:

- `account` - integer to specify which account you want (0 is your first - default and n is your nth)
- `includePending` - include Pending Transactions - default `true`, set to `false` to not include pending.
- `fromDate` - the date from which to get transactions, by default it's `01-01-2008`, it needs to be in `DD-MM-YYYY` format
- `toDate` - the last date of transactions you want - `defaults to today`.
- `transactionsLimit` - the limit of transactions to download - default to `100000`

I haven't added them as params to the function, you can change them as you wish before running it in console.

That's about it!

Enjoy!

License: MIT
