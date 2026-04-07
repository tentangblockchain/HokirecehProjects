# Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/
> Fetched : 2026-04-07T15:12:34.075Z
> Engine  : MkDocs Material



# Overview


## Connection Details


GRVT's services are hosted in AWS Tokyo (`ap-northeast-1`).


For close partners with high trading volumes, we offer AWS PrivateLink.


## CCXT


One of the ways to integrate with Grvt is through [CCXT](https://docs.ccxt.com/#/exchanges/grvt) (CryptoCurrency exchange Trading Library) — the most widely-used open-source library for cryptocurrency exchange connectivity. CCXT provides a unified, standardized interface across 100+ exchanges, so you can integrate with Grvt using the same API you already use for other exchanges.


CCXT is available in five languages: **Python**, **JavaScript**, **TypeScript**, **PHP**, and **C#**.


PythonJavaScript / TypeScriptPHPC#


`pip install ccxt`


`npm install ccxt`


`composer require ccxt/ccxt`


`dotnet add package ccxt`


For the full list of supported methods and usage examples, see the [CCXT GRVT documentation](https://docs.ccxt.com/#/exchanges/grvt).


## Authentication


GRVT supports API Authentication via session cookies, API keys, and wallet login (EIP-712).


You may follow the below steps to authenticate your requests.


This section is conveniently inlined at every authenticated endpoint for your convenience.


Authentication

GRVT supports two authentication methods: **API Key** and **Wallet Login** (EIP-712). Both return a session cookie used to authenticate subsequent requests.


**API Key Login**


Provision an API key via the GRVT UI.


`# These are the variables you will need to set manually
GRVT_API_KEY=""
GRVT_SUB_ACCOUNT_ID=""`
Then, choose the environment you want to authenticate against.


`# dev
GRVT_AUTH_ENDPOINT="https://edge.dev.gravitymarkets.io/auth/api_key/login"
# staging
GRVT_AUTH_ENDPOINT="https://edge.staging.gravitymarkets.io/auth/api_key/login"
# testnet
GRVT_AUTH_ENDPOINT="https://edge.testnet.grvt.io/auth/api_key/login"
# prod
GRVT_AUTH_ENDPOINT="https://edge.grvt.io/auth/api_key/login"`
Now, let’s authenticate and retrieve both the session cookie and the `X-Grvt-Account-Id` header value that you’ll need to access any endpoints requiring authentication.


`echo $GRVT_API_KEY
echo $GRVT_SUB_ACCOUNT_ID
echo $GRVT_AUTH_ENDPOINT

RESPONSE=$(
    curl $GRVT_AUTH_ENDPOINT \
        -H 'Content-Type: application/json' \
        -H 'Cookie: rm=true;' \
        -d '{"api_key": "'$GRVT_API_KEY'"}' \
        -s -i
)

GRVT_COOKIE=$(echo "$RESPONSE" | grep -i 'set-cookie:' | grep -o 'gravity=[^;]*')
GRVT_ACCOUNT_ID=$(echo "$RESPONSE" | grep 'x-grvt-account-id:' | awk '{print $2}' | tr -d '\r')

echo "$GRVT_COOKIE"
echo "$GRVT_ACCOUNT_ID"`
On success, a session cookie (`gravity=...`) is set and the response body contains:


`{
  "status": "success",
  "location": "",
  "funding_account_address": "0xYourFundingAccountAddress",
  "sub_account_id": "123456789"
}`
`sub_account_id` is optional — present only when the API key was generated from a Trading Account.


**Wallet Login**


Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.


`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:


`WalletLogin(address signer, uint32 nonce, int64 expiration)`

| Field 
| Type 
| Description 
|


| `signer` 
| `address` 
| Your registered EVM wallet address 
|


| `nonce` 
| `uint32` 
| Random client-chosen number. Each `(address, nonce)` pair can only be used once. 
|


| `expiration` 
| `int64` 
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](market_data_api/#server-time). 
|


**Request**


The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.


`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
**Response**


On success, a session cookie (`gravity=...`) is set — the same `GRVT_COOKIE` used by API Key Login — and the response body contains:


`{
  "status": "success",
  "location": "",
  "funding_account_address": "0xYourFundingAccountAddress",
  "sub_account_id": "123456789"
}`
`sub_account_id` is optional — present only when the API key was generated from a Trading Account.


For a full example, see the [Authentication](auth/#wallet-login) page.


## Referral Data


GRVT provides referral APIs to query epochs, points, and referred account data.


- **[List Epochs](referral_data/#list-epochs)** — returns all past and current epochs, each spanning 7 days.

- **[Get Point Summary](referral_data/#get-point-summary)** — returns total points and community referral points for the authenticated account.

- **[Get Referral Data](referral_data/#get-referral-data)** — returns paginated data on accounts referred by the authenticated account.


All referral endpoints require authentication.


## Order Creation


### Python SDK


We have a [Python SDK](https://github.com/gravity-technologies/grvt-pysdk) available for usage. ([link](https://github.com/gravity-technologies/grvt-pysdk))


`pip install grvt-pysdk`

### Step-by-Step Guide

For specific information on how to _sign_ and _create_ an order, here's a step-by-step guide, using our Python SDK:


- [Step 8-1: Fetch All Instruments](https://github.com/gravity-technologies/grvt-pysdk/blob/1a6eced13fa9fc06c4c78434a57a2cc274e88a35/tests/pysdk/test_grvt_raw_sync.py#L49-51)

- [Step 8-2: Use Instrument Map in Order Signing](https://github.com/gravity-technologies/grvt-pysdk/blob/1a6eced13fa9fc06c4c78434a57a2cc274e88a35/tests/pysdk/test_grvt_raw_sync.py#L49-L55)

- [Step 8-3: Create An Order](https://github.com/gravity-technologies/grvt-pysdk/blob/1a6eced13fa9fc06c4c78434a57a2cc274e88a35/tests/pysdk/test_raw_utils.py#L39-L62)

- [Step 8-4: Sign Order](https://github.com/gravity-technologies/grvt-pysdk/blob/1a6eced13fa9fc06c4c78434a57a2cc274e88a35/src/pysdk/grvt_raw_signing.py#L69-L107)

- [Step 8-5: Submit The Order](https://github.com/gravity-technologies/grvt-pysdk/blob/1a6eced13fa9fc06c4c78434a57a2cc274e88a35/tests/pysdk/test_grvt_raw_sync.py#L58)


### Chain IDs


| **Network** 
| **Ethereum L1 Chain ID** 
| **GRVT L2 Chain ID** 
|


| Sepolia (Dev) 
| 11155111 
| 327 
|


| Sepolia (Stg) 
| 11155111 
| 327 
|


| Sepolia (Testnet) 
| 11155111 
| 326 
|


| Mainnet 
| 1 
| 325 
|


## Encoding (Full vs Lite)


For more versatile usage, all our APIs and Websockets are offered in `full` and `lite` variants.


These variants are identical except for the JSON `field_name` used:


- `full` uses the full field name, e.g. `order_id`

- `lite` uses the shortened field name, e.g. `oi`


This is allows for users to trade off between simplicity and performance.


## WebSocket Subscription


### Connecting to Authenticated Endpoints


To subscribe to authenticated WebSocket streams (e.g., trade-related feeds), you must establish a WebSocket connection with both your `GRVT_COOKIE` and `X-Grvt-Account-Id` included. If your WebSocket client supports custom headers, set both as headers during the initial handshake. If custom headers are not supported, append `x_grvt_account_id` as a query parameter to the endpoint URL.


#### Example (With Custom Headers):


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID"`

#### Example (Without Custom Headers):

`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full?x_grvt_account_id=$GRVT_ACCOUNT_ID" \
-H "Cookie: $GRVT_COOKIE"`
Full examples are available in the `Try it out` section of any `Trading Websocket` endpoint.


In either case, once connected, you can send authenticated requests (e.g., `subscribe`) and interact with trade-related streams.


### Request


Websocket subscriptions are initiated by sending a JSON RPC Request to the server.


They have the following structure:


- stream: The stream to subscribe to

- feed: The list of feeds to subscribe to

- method: The JSONRPC method. This is always `"subscribe"`

- is_full: Whether to subscribe to the `full` or `lite` feed.


`{
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-100-10"],
    "method":"subscribe",
    "is_full":true
}`

### Response

Upon subscribing, the server will respond with an initial JSON RPC Response.


In the successful case, the following response will be returned:


- stream: The stream that was subscribed to

- subs: The list of subscriptions that were successfully subscribed to

- unsubs: The list of subscriptions that were unsubscribed from


`{
    "stream":"v1.book.s",
    "subs":["BTC_USDT_Perp@500-100-10"],
    "unsubs":[]
}`
In the case of an error, the following response will be returned:


- code: The error code

- message: The error message

- status: The HTTP status code


`{
    "code":3001,
    "message":"Stream handler not found",
    "status":400
}`

### Feed Structure

For each WebSocket stream, users may subscribe to multiple feeds.
Each stream defines its own feed structure, which is documented on the relevant page.
However, they all share the same underlying structure.


Firstly, feeds are broken down into `primary@secondary` selector pairs.


- `primary` is used to determine the type of streaming data received.

- `secondary` is used to determine the format/subtype of the streaming data received.


When subscribing to the same `primary` selector again, the previous `secondary` selector will be replaced.


eg. If previously subcribing to `"BTC_USDT_Perp@500-100-10"` and then subscribing to `"BTC_USDT_Perp@500-1-10"`, the subscribe response will return.


`{
    "stream":"v1.book.s",
    "subs":["BTC_USDT_Perp@500-1-10"],
    "unsubs":["BTC_USDT_Perp@500-100-10"]
}`
Within each `primary` or `secondary` selector, fields are separated by `-`, and ordered by the schema definition.


### Feed Data Stream


The feed data stream will return a continuous stream of JSON objects.
It has the following structure:


- stream: The stream that the data is from

- selector: The selector that the data is from

- sequence_number: This increases by one for each feed object published in the `stream`/`selector` pair. If the number `jumps`, it indicates data loss.

- feed: The feed data object. Different for each stream.


`{
    "stream": "v1.book.s",
    "selector": "BTC_USDT_Perp@500-100-10",
    "sequence_number": "872634876",
    "feed": {}
}`

### Event Time

All feed data is published with an `event_time` timestamp (in unix nanoseconds).
This timestamp is stamped by our core cluster, and is guaranteed to be consistent across all services and nodes.
For All Streams, other than `MiniTicker` raw streams, event time is a globally consistent unique identifier for a message.
ie. All connections via WebSocket/REST can agree that a message is the same via its `event_time`.


### Sequence Number


Sequence Numbers are stamped at the gateway level. Which means that it only has relevance within a single websocket connection, and nothing more.
It helps you to guarantee that you received the right number of `snapshot` updates, and did not miss any `delta` updates.


- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas

- Num snapshots returned in JSON RPC Response (per stream): You can ensure that you received the right number of snapshots

- First sequence number returned in JSON RPC Response (per stream): You can ensure that you received the first stream, without gaps from snapshots

- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect

- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.