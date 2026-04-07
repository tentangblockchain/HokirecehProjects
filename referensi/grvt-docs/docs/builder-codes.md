# Builder Integration - Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/builder_codes/
> Fetched : 2026-04-07T15:12:41.801Z
> Engine  : MkDocs Material



# Builder Integration Guide


## Overview


This guide explains how to integrate your application with GRVT and enable trading on behalf of your users.


## Integration steps


### 1. Connect User Wallet


### 2. Authorize Builder


Choose the environment you want to authenticate against.


`# dev
GRVT_AUTH_ENDPOINT="https://edge.dev.gravitymarkets.io/auth/builder/authorize"
# stg
GRVT_AUTH_ENDPOINT="https://edge.staging.gravitymarkets.io/auth/builder/authorize"
# testnet
GRVT_AUTH_ENDPOINT="https://edge.testnet.grvt.io/auth/builder/authorize"
# prod
GRVT_AUTH_ENDPOINT="https://edge.grvt.io/auth/builder/authorize"`

#### Request Parameters


Retrieving Funding Addresses


Both `main_account_id` and `builder_account_id` are funding addresses that can be retrieved by accessing the GRVT Exchange API Keys page: [https://grvt.io/exchange/account/api-keys](https://grvt.io/exchange/account/api-keys)


This endpoint supports two modes depending on whether you provide the API key fields:


- **With API key** (provide `builder_api_key_signer` + `builder_api_key_permissions` + `builder_api_key_label`): Authorizes the builder on-chain via `AddAccountSignerWithBuilder` and creates a GRVT API key. The API key is returned in the response.

- **Without API key** (omit all three `builder_api_key_*` fields): Authorizes the builder on-chain via `AuthorizeBuilder` without creating an API key. Returns an empty response.


| "name" 
| Type 
| Required 
| Description 
|


| main_account_id 
| string 
| True 
| The funding address of the user granting the authorization. 
|


| builder_account_id 
| string 
| True 
| The funding address of the Builder receiving the authorization. 
|


| max_futures_fee_rate 
| string 
| True 
| The maximum fee rate cap in percentage for Futures trades executed by this builder. The builder cannot charge fees exceeding this limit. Eg. "0.1" means 0.1% 
|


| max_spot_fee_rate 
| string 
| True 
| The maximum fee rate cap in percentage for Spot trades executed by this builder. The builder cannot charge fees exceeding this limit. Eg. "0.1" means 0.1% 
|


| signature 
| Signature 
| True 
| The cryptographic signature authenticating this request. Must be signed by the private key associated with mainAccountID. See [Signing Payload](#signing-payload) section below for details. 
|


| builder_api_key_label 
| string 
| False 
| Required when `builder_api_key_signer` and `builder_api_key_permissions` are provided. The user will see this label on the gravity api list UI. 
|


| builder_api_key_signer 
| string 
| False 
| An Ethereum public key pair that you generate for your user. This key can sign trades on behalf of your user across all sub-accounts they have. You can use the private key to sign trades on behalf of your user without sending Grvt the private key. Must be provided together with `builder_api_key_permissions`. 
|


| builder_api_key_permissions 
| string 
| False 
| Permissions as a sorted string (lowest bit to highest bit), separated by `&`:- Examples: `"Trade"`, `"Admin"`, `"Admin&Trade"`- Bit mapping: ADMIN=1, INTERNAL_TRANSFER=2, EXTERNAL_TRANSFER=3, WITHDRAW=4, VAULT_INVESTOR=5, TRADE=6**Please use TRADE for now**Must be provided together with `builder_api_key_signer`. 
|


#### Example Request


**With API key creation:**
`{
    "main_account_id": "'0x...'",
    "builder_account_id": "'0x....'",
    "max_futures_fee_rate": "0.001",
    "max_spot_fee_rate": "0.0001",
    "signature": {
        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
        "v": 28,
        "expiration": "1697788800000000000",
        "nonce": 1234567890,
        "chain_id": "327"
    },
    "builder_api_key_label": "superbuilder",
    "builder_api_key_signer": "0x....",
    "builder_api_key_permissions": "Admin&Trade"
}`


**Without API key (on-chain authorization only):**
`{
    "main_account_id": "'0x...'",
    "builder_account_id": "'0x....'",
    "max_futures_fee_rate": "0.001",
    "max_spot_fee_rate": "0.0001",
    "signature": {
        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
        "v": 28,
        "expiration": "1697788800000000000",
        "nonce": 1234567890,
        "chain_id": "327"
    }
}`


#### Signing Payload


The signature must be created using EIP-712 typed data signing. The structure differs based on the authorization mode:


**With API key** (when providing `builder_api_key_signer` + `builder_api_key_permissions`):


`{
  "domain": {
    "chainId": 327,
    "name": "GRVT Exchange",
    "version": "0"
  },
  "message": {
    "accountID": "'0x...'",
    "signer": "'0x....'",
    "permissions": "Trade",
    "builderAccountID": "'0x....'",
    "maxFutureFeeRate": 100,
    "maxSpotFeeRate": 10,
    "nonce": 1234567890,
    "expiration": 1697788800000000000
  },
  "primaryType": "AddAccountSignerWithBuilder",
  "types": {
    "EIP712Domain": [
      { "name": "name", "type": "string" },
      { "name": "version", "type": "string" },
      { "name": "chainId", "type": "uint256" }
    ],
    "AddAccountSignerWithBuilder": [
      { "name": "accountID", "type": "address" },
      { "name": "signer", "type": "address" },
      { "name": "permissions", "type": "string" },
      { "name": "builderAccountID", "type": "address" },
      { "name": "maxFutureFeeRate", "type": "uint32" },
      { "name": "maxSpotFeeRate", "type": "uint32" },
      { "name": "nonce", "type": "uint32" },
      { "name": "expiration", "type": "int64" }
    ]
  }
}`
**Without API key** (on-chain authorization only):


`{
  "domain": {
    "chainId": 327,
    "name": "GRVT Exchange",
    "version": "0"
  },
  "message": {
    "mainAccountID": "'0x...'",
    "builderAccountID": "'0x....'",
    "maxFutureFeeRate": 100,
    "maxSpotFeeRate": 10,
    "nonce": 1234567890,
    "expiration": 1697788800000000000
  },
  "primaryType": "AuthorizeBuilder",
  "types": {
    "EIP712Domain": [
      { "name": "name", "type": "string" },
      { "name": "version", "type": "string" },
      { "name": "chainId", "type": "uint256" }
    ],
    "AuthorizeBuilder": [
      { "name": "mainAccountID", "type": "address" },
      { "name": "builderAccountID", "type": "address" },
      { "name": "maxFutureFeeRate", "type": "uint32" },
      { "name": "maxSpotFeeRate", "type": "uint32" },
      { "name": "nonce", "type": "uint32" },
      { "name": "expiration", "type": "int64" }
    ]
  }
}`

Chain ID


The `chainId` value in the `domain` field must match the **GRVT L2 Chain ID** for your target environment. The example above uses `327` (Sepolia Dev/Stg). Refer to the **[Chain IDs](../#chain-ids) table** for all network-specific values.


Fee Rate Units


The `maxFutureFeeRate` and `maxSpotFeeRate` fields in the signing payload are expressed as **integers multiplied by 10,000 (1e4)**:
- Calculation: fee_rate × 10,000
- Example conversions:


```
- `0.001` fee rate = `10` (0.001 × 10,000)
- `0.0005` fee rate = `5` (0.0005 × 10,000)
- `0.0001` fee rate = `1` (0.0001 × 10,000)

```


**Payload Fields:**


| Field 
| Type 
| Mode 
| Description 
|


| chainId 
| uint256 
| Both 
| The GRVT L2 Chain ID for the target network (in `domain` field). Refer to **[Chain IDs](../#chain-ids) table** for network-specific values. 
|


| mainAccountID 
| address 
| Without API key 
| The Main Account ID (Ethereum address) of the user granting authorization (used in `AuthorizeBuilder` type) 
|


| accountID 
| address 
| With API key 
| The Main Account ID (Ethereum address) of the user granting authorization (used in `AddAccountSignerWithBuilder` type) 
|


| builderAccountID 
| address 
| Both 
| The `builder_account_id` - Main Account ID of the Builder 
|


| maxFutureFeeRate 
| uint32 
| Both 
| The `max_futures_fee_rate` - Maximum fee rate for Futures trades (multiplied by 10,000) 
|


| maxSpotFeeRate 
| uint32 
| Both 
| The `max_spot_fee_rate` - Maximum fee rate for Spot trades (multiplied by 10,000) 
|


| nonce 
| uint32 
| Both 
| Random value for signature deconflicting (0 to 4,294,967,295) 
|


| expiration 
| int64 
| Both 
| Timestamp in unix nanoseconds when signature expires (max 30 days) 
|


| signer 
| address 
| With API key 
| The `builder_api_key_signer` - Ethereum public key that can sign trades on behalf of the user 
|


| permissions 
| string 
| With API key 
| The `builder_api_key_permissions` as a sorted string (lowest bit to highest bit), separated by `&`:- Single permission: `"Admin"` or `"Trade"`- Multiple permissions: `"Admin&InternalTransfer"`, `"Admin&InternalTransfer&Trade"`- Bit mapping: ADMIN=1, INTERNAL_TRANSFER=2, EXTERNAL_TRANSFER=3, WITHDRAW=4, VAULT_INVESTOR=5, TRADE=6- **Note:** Permissions are always sorted by bit position (e.g., `"Admin&Trade"`, never `"Trade&Admin"`) 
|


Permission String Format


- Both the `permissions` field in the signing payload and the `builder_api_key_permissions` request parameter must use the **sorted string format**

- When multiple permissions are granted, they must be sorted by bit position (lowest to highest) and joined with `&`

- Examples:
Single permission: `"Trade"` or `"Admin"`

- Multiple permissions: `"Admin&InternalTransfer"` (correct) vs `"InternalTransfer&Admin"` (incorrect - wrong order)

- Combined: `"Admin&InternalTransfer&Trade"`


- **Note:** The permission string format ensures a 1-to-1 mapping between the string and its bitmask value


**Signing Process:**


- The user must sign this EIP-712 typed data payload with their private key associated with `main_account_id`

- The signing produces three values: `r`, `s`, and `v`

- These values, along with the `signer` address, `nonce`, `expiration`, and `chain_id` are included in the `signature` field of the request


Note


The signature fields correspond to the [Signature](/../../schemas/signature) type used throughout the GRVT API.


#### Example Response


**With API key creation** — the API key is used for authentication in step 3:


`{
    "api_key": "abc....."
}`
**Without API key** — returns an empty response on success:


`{}`

### 3. Authenticate with API Key


Note


This step applies only when using the **with API key** authorization mode.


Use the `api_key` returned from step 2 to authenticate with the GRVT API and use trading functions.


For detailed authentication instructions, please refer to the **[Authentication](../auth/)** page.


### 4. Manage Sub-Accounts


Query available sub-accounts that your builder can trade on.


**Reference:** **[Builder Codes - Get Sub Accounts](../trading_api/#get-sub-accounts)**


### 5. Execute Trades


Your builder can now execute trades on all authorized sub-accounts using the Trade permission and the `builder_api_signer` key pair from one of the sub accounts.


**Reference:** **[Builder Codes - Trading on Behalf of Users](../trading_api/#create-order)**