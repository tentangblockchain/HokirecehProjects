# Learn - Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/learn/
> Fetched : 2026-04-07T15:10:52.067Z
> Engine  : MkDocs Material



# Learn


## INTRODUCTION


### Getting Started


Performance meets safety and privacy


Grvt is a self-custodial DEX for onchain financial privacy that is powered by zero-knowledge technology, ensuring private, trustless, scalable and secure infrastructure.


**Testnet**


[https://testnet.grvt.io/](https://testnet.grvt.io/)


**Mainnet**


[https://grvt.io/](https://grvt.io/)


### Architecture Overview


Grvt's exchange architecture overview


Grvt adopts an architecture that matches and stores data off chain and provides smart contract level guarantees of their execution on chain. Grvt adopted this architecture to improve throughput by processing transactions off the Ethereum Mainnet.


#### Offchain


All actions impacting user funds, such as trades or account creation, are eventually pushed on-chain by Grvt. Key user actions that are pushed on-chain include transactions processed by the following:


- Matching Engine: Orders that are matched by the matching engine are sent on-chain

- Risk Engine: Liquidations are sent to the chain

- Account Management: Creation of entities such as trading accounts or addition of wallets that can use funds

- Fund Management: Internal and external transfer of funds


#### Onchain


A subset of the off chain actions are pushed to the GRVT chain. These actions are then published as zero-knowledge proofs to verify off-chain transactions on Ethereum.


- Trade Settlement: Matched orders are settled on chain

- Risk Engine Validation: Liquidations are validated on chain as being fair based on smart contract logic

- Account Management Validations: Account Management actions are validated on chain

- Fund Management: Fund transfers are validated and settled on chain


#### GRVT Native Deposit Contracts


- **GRVTBridgeProxy**
  Contract address used for depositing native tokens:
`0xE17aeD2fC55f4A876315376ffA49FE6358113a65`

- **L1NativeTokenVault**
  Contract that holds the deposited funds:
`0xbed1eb542f9a5aa6419ff3deb921a372681111f6`


When you deposit native tokens through GRVT, you’ll interact with **GRVTBridgeProxy**, while your assets will ultimately be stored in the **L1NativeTokenVault**.


## CORE CONCEPTS


### Accounts and Users


#### Funding Account


Funding accounts are the highest level on-chain identity in GRVT. The purpose of the funding account is primarily fund management. They process deposits, withdrawals, external Transfers to other funding accounts and internal transfers to linked trading accounts.


#### Trading Account


Each funding account can link to multiple trading accounts. To trade derivatives, you must transfer funds from your funding account to a specific trading account.


#### Users


In the case of **individual accounts**, each account has a maximum of one user. The user has access to all the linked trading accounts.


### User Identifiers


One User, One Email, One Wallet


In GRVT, each user must register both Web2 and Web3 credentials.


### User Registration and Credentials


Users can register on GRVT using either an email or a wallet.


**Email Registration**


If a user signs up with an email, GRVT automatically creates a wallet for them in the background, powered by Privy. This wallet is used to enable trading and other actions that affect asset ownership.


**Wallet Registration**


If a user signs up with a wallet, that wallet is registered directly and can be used immediately. All trades and any actions that affect asset ownership (e.g. trading) must be signed by a registered wallet and are executed only if the wallet is registered with GRVT.


### Account Identifiers


The on-chain main AccountID matches the wallet address that created the account.


#### Individual Account Representation


#### Funding Account Off-Chain Representation (Read + Write)


| Off-Chain accountIDs 
| Off chain user email addresses 
|


| ACC:2aO9cE9kJkah16urpA7DQKPOEdx 
| [[email protected]](/cdn-cgi/l/email-protection) 
|


| ACC:2aO9cE9kJkah16urpA7DQKPOFxk 
| [[email protected]](/cdn-cgi/l/email-protection) 
|


| ACC:2aO9cE9kJkah16urajkDQKPOEdx 
| [[email protected]](/cdn-cgi/l/email-protection), [[email protected]](/cdn-cgi/l/email-protection) 
|


#### Funding Account On-Chain Representation (Own)


| On-Chain accountIDs 
| On-Chain user wallets 
|


| 0xb794f5ea0ba39494ce839613fffba74279579268 
| 0xb794f5ea0ba39494ce839613fffba74279579268 
|


| 0xdB055877e6c13b6A6B25aBcAA29B393777dD0a73 
| 0xdB055877e6c13b6A6B25aBcAA29B393777dD0a73 
|


| 0x40b38765696e3d5d8d9d834d8aad4bb6e418e489 
| 0x40b38765696e3d5d8d9d834d8aad4bb6e418e489, 0xe92d1a43df510f82c66382592a047d288f85226f 
|


### API Keys


API keys for programmatic trading


API Keys are only registered at Trading Account level with `trade` only permissions. Each API key needs to be tagged to a valid Ethereum public address.


#### How to authenticate using API keys?


- You will receive a session token by [authenticating](https://api-docs.grvt.io/#authentication) against your API key. This session token must be used then used in your `read` and `write` requests.


#### How to authorize transactions using API keys?


- Each API key must be tagged to a valid Ethereum address. There are two ways of doing so

- Input (Secure): You possess a [public/private key pair.](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/keys/) You provide the public address, while only you have access to the secret private key.

- Generate (Convenient): The GRVT front-end client generates a public/private key pair in your browser and allows you to copy the secret private key. GRVT does not store the private key after it is generated.

- The Secret Private key must be used to sign orders using EIP-712 signing method.


#### Mapping of API Keys to Trading Accounts


Learn more: [Video Explanation](https://www.youtube.com/watch?v=7T1sJWjqJUE)


### PBAC for API keys


Permission Based Access Control for API Keys


#### Funding Account Permissions


| Permission 
| Permissions 
|


| Funding Admin 
| **Highest permission in the exchange, that supersedes all other permissions**Can create Trading AccountsCan trigger actions need to meet a multi-signature threshold like adding users to funding account, or adding a withdrawal/transfer address 
|


| Internal Transfer 
| Can transfer funds from the Funding Account to associated Trading Accounts 
|


| External Transfer 
| Can transfer funds to other funding accounts within GRVT if these accounts are in the transfer address book 
|


| Withdrawal 
| Can withdraw funds to pre-approved Layer 1 wallets 
|


#### Trading Account Permissions


| Permission 
| Access 
|


| Admin 
| Inherits "Trade" and "Transfer" permissions 
|


| Trade 
| Can trade from the given Trading Account 
|


| Transfer 
| Can internally transfer funds to Funding Account or other trading accounts within the same Business Account 
|


## HELP CENTER


### Contact Support