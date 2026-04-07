# Trading Websocket - Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/trading_streams/
> Fetched : 2026-04-07T15:12:39.416Z
> Engine  : MkDocs Material



# Trading Websocket Streams


## Order


### Order


`STREAM: v1.order`
Feed SelectorFeed DataErrorsTry it out


[WSOrderFeedSelectorV1](/../../schemas/ws_order_feed_selector_v1)


Subscribes to a feed of order updates pertaining to orders made by your account.**Each Order can be uniquely identified by its `order_id` or `client_order_id`.To subscribe to all orders, specify an empty `instrument` (eg. `2345123`).Otherwise, specify the `instrument` to only receive orders for that instrument (eg. `2345123-BTC_USDT_Perp`).


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The subaccount ID to filter by


instrument`i`
string
False`'all'`
The instrument filter to apply.


JSONRPC Wrappers

[JSONRPCRequest](/../../schemas/jsonrpc_request)
All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


Name`Lite`
Type
Required`Default`
Description


jsonrpc`j`
string
True
The JSON RPC version to use for the request


method`m`
string
True
The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` )


params`p`
object
True
The parameters for the request


id`i`
integer
False`0`
Optional Field which is used to match the response by the client.If not passed, this field will not be returned


[JSONRPCResponse](/../../schemas/jsonrpc_response)
All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


Name`Lite`
Type
Required`Default`
Description


jsonrpc`j`
string
True
The JSON RPC version to use for the request


result`r`
object
False`null`
The result for the request


error`e`
Error
False`null`
The error for the request


id`i`
integer
False`0`
Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32)


method`m`
string
True
The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` )


[Error](/../../schemas/error)
An error response


Name`Lite`
Type
Required`Default`
Description


code`c`
integer
True
The error code for the request


message`m`
string
True
The error message for the request


[WSSubscribeParams](/../../schemas/ws_subscribe_params)
All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.Sequence numbers can be either gateway-specific or global:- Gateway Unique Sequence Number: Increments by one per stream, resets to 0 on gateway restart.- Global Unique Sequence Number: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


Name`Lite`
Type
Required`Default`
Description


stream`s`
string
True
The channel to subscribe to (eg: ticker.s / ticker.d)


selectors`s1`
[string]
True
The list of feeds to subscribe to


[WSSubscribeResult](/../../schemas/ws_subscribe_result)
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltasNum snapshots returned in Response (per stream): You can ensure that you received the right number of snapshotsFirst sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshotsSequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnectDuplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


Name`Lite`
Type
Required`Default`
Description


stream`s`
string
True
The channel to subscribe to (eg: ticker.s / ticker.d)


subs`s1`
[string]
True
The list of feeds subscribed to


unsubs`u`
[string]
True
The list of feeds unsubscribed from


num_snapshots`ns`
[integer]
True
The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs`


first_sequence_number`fs`
[string]
True
The first sequence number to expect for each subscribed feed. Returned in same order as `subs`


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)
All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


Name`Lite`
Type
Required`Default`
Description


stream`s`
string
True
The channel to unsubscribe from (eg: ticker.s / ticker.d)


selectors`s1`
[string]
True
The list of feeds to unsubscribe from


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)
Returns a confirmation of all unsubscribes


Name`Lite`
Type
Required`Default`
Description


stream`s`
string
True
The channel to subscribe to (eg: ticker.s / ticker.d)


unsubs`u`
[string]
True
The list of feeds unsubscribed from


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)
All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


Name`Lite`
Type
Required`Default`
Description


request_id`ri`
integer
False`0`
Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32)


stream`s`
string
True
The channel to subscribe to (eg: ticker.s / ticker.d)


feed`f`
[string]
True
The list of feeds to subscribe to


method`m`
string
True
The method to use for the request (eg: subscribe / unsubscribe)


is_full`if`
boolean
False`false`
Whether the request is for full data or lite data


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)
All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltasNum snapshots returned in Response (per stream): You can ensure that you received the right number of snapshotsFirst sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshotsSequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnectDuplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


Name`Lite`
Type
Required`Default`
Description


request_id`ri`
integer
False`0`
Optional Field which is used to match the response by the client.If not passed, this field will not be returned


stream`s`
string
True
The channel to subscribe to (eg: ticker.s / ticker.d)


subs`s1`
[string]
True
The list of feeds subscribed to


unsubs`u`
[string]
True
The list of feeds unsubscribed from


num_snapshots`ns`
[integer]
True
The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs`


first_sequence_number`fs`
[string]
True
The first sequence number to expect for each subscribed feed. Returned in same order as `subs`


Subscribe
Full Subscribe Request
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
Full Subscribe Response
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.order",
        "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe
Full Unsubscribe Request
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
Full Unsubscribe Response
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.order",
        "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe
Full Subscribe Request
`{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}`
Full Subscribe Response
`{
    "request_id":1,
    "stream":"v1.order",
    "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSOrderFeedDataV1](/../../schemas/ws_order_feed_data_v1)


Name`Lite`
Type
Required`Default`
Description


stream`s`
string
True
Stream name


selector`s1`
string
True
Primary selector


sequence_number`sn`
string
True
A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is false, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is true, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.


feed`f`
Order
True
The order object being created or updated


[Order](/../../schemas/order)
Order is a typed payload used throughout the GRVT platform to express all orderbook, RFQ, and liquidation orders.GRVT orders are capable of expressing both single-legged, and multi-legged orders by default.This increases the learning curve slightly but reduces overall integration load, since the order payload is used across all GRVT trading venues.Given GRVT's trustless settlement model, the Order payload also carries the signature, required to trade the order on our ZKSync Hyperchain.All fields in the Order payload (except `id`, `metadata`, and `state`) are trustlessly enforced on our Hyperchain.This minimizes the amount of trust users have to offer to GRVT


Name`Lite`
Type
Required`Default`
Description


order_id`oi`
string
False`0`
[Filled by GRVT Backend] A unique 128-bit identifier for the order, deterministically generated within the GRVT backend


sub_account_id`sa`
string
True
The subaccount initiating the order


is_market`im`
boolean
False`false`
If the order is a market orderMarket Orders do not have a limit price, and are always executed according to the maker order price.Market Orders must always be taker orders


time_in_force`ti`
TimeInForce
True
Four supported types of orders: GTT, IOC, AON, FOK:PARTIAL EXECUTION = GTT / IOC - allows partial size execution on each legFULL EXECUTION = AON / FOK - only allows full size execution on all legsTAKER ONLY = IOC / FOK - only allows taker ordersMAKER OR TAKER = GTT / AON - allows maker or taker ordersExchange only supports (GTT, IOC, FOK)RFQ Maker only supports (GTT, AON), RFQ Taker only supports (FOK)


post_only`po`
boolean
False`false`
If True, Order must be a maker order. It has to fill the orderbook instead of match it.If False, Order can be either a maker or taker order. In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.**


|


| reduce_only`ro` 
| boolean 
| False`false` 
| If True, Order must reduce the position size, or be cancelled 
|


| legs`l` 
| [OrderLeg] 
| True 
| The legs present in this orderThe legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice 
|


| signature`s` 
| Signature 
| True 
| The signature approving this order 
|


| metadata`m` 
| OrderMetadata 
| True 
| Order Metadata, ignored by the smart contract, and unsigned by the client 
|


| state`s1` 
| OrderState 
| False`''` 
| [Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client 
|


| builder`b` 
| string 
| True 
| The main account ID of the builder 
|


| builder_fee`bf` 
| string 
| True 
| Builder fee charged for this order, expressed as a percentage (e.g., 0.001 means 0.001%). 
|


[TimeInForce](/../../schemas/time_in_force)

|  
| Must Fill All 
| Can Fill Partial 
|


| Must Fill Immediately 
| FOK 
| IOC 
|


| Can Fill Till Time 
| AON 
| GTC 
|


|  
|  
|  
|


| Value 
| Description 
|


| `GOOD_TILL_TIME` = 1 
| GTT - Remains open until it is cancelled, or expired 
|


| `ALL_OR_NONE` = 2 
| AON - Either fill the whole order or none of it (Block Trades Only) 
|


| `IMMEDIATE_OR_CANCEL` = 3 
| IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it 
|


| `FILL_OR_KILL` = 4 
| FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it 
|


| `RETAIL_PRICE_IMPROVEMENT` = 5 
| RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users. 
|


[OrderLeg](/../../schemas/order_leg)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The instrument to trade in this leg 
|


| size`s` 
| string 
| True 
| The total number of assets to trade in this leg, expressed in base asset decimal units. 
|


| limit_price`lp` 
| string 
| False`0` 
| The limit price of the order leg, expressed in `9` decimals.This is the number of quote currency units to pay/receive for this leg.This should be `null/0` if the order is a market order 
|


| is_buying_asset`ib` 
| boolean 
| True 
| Specifies if the order leg is a buy or sell 
|


[Signature](/../../schemas/signature)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| signer`s` 
| string 
| True 
| The address (public key) of the wallet signing the payload 
|


| r`r` 
| string 
| True 
| Signature R 
|


| s`s1` 
| string 
| True 
| Signature S 
|


| v`v` 
| integer 
| True 
| Signature V 
|


| expiration`e` 
| string 
| True 
| Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days 
|


| nonce`n` 
| integer 
| True 
| Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32) 
|


| chain_id`ci` 
| string 
| True 
| Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID. 
|


[OrderMetadata](/../../schemas/order_metadata)
Metadata fields are used to support Backend only operations. These operations are not trustless by nature.
Hence, fields in here are never signed, and is never transmitted to the smart contract.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| client_order_id`co` 
| string 
| True 
| A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId 
|


| create_time`ct` 
| string 
| False`0` 
| [Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds 
|


| trigger`t` 
| TriggerOrderMetadata 
| False`` 
| Trigger fields are used to support any type of trigger order such as TP/SL 
|


| broker`b` 
| BrokerTag 
| False`` 
| Specifies the broker who brokered the order 
|


[TriggerOrderMetadata](/../../schemas/trigger_order_metadata)

Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).

Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| trigger_type`tt` 
| TriggerType 
| True 
| Type of the trigger order. eg: Take Profit, Stop Loss, etc 
|


| tpsl`t` 
| TPSLOrderMetadata 
| True 
| Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders. 
|


[TriggerType](/../../schemas/trigger_type)

Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.

Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.


| Value 
| Description 
|


| `UNSPECIFIED` = 0 
| Not a trigger order. The order executes normally without any trigger conditions. 
|


| `TAKE_PROFIT` = 1 
| Take Profit Order - Executes when the price reaches a specified level to secure profits. 
|


| `STOP_LOSS` = 2 
| Stop Loss Order - Executes when the price reaches a specified level to limit losses. 
|


[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)

Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| trigger_by`tb` 
| TriggerBy 
| True 
| Defines the price type (e.g., index price) that activates a Take Profit (TP) or Stop Loss (SL) order 
|


| trigger_price`tp` 
| string 
| True 
| The Trigger Price of the order, expressed in `9` decimals. 
|


| close_position`cp` 
| boolean 
| True 
| If True, the order will close the position when the trigger price is reached 
|


| is_split_position`is` 
| boolean 
| True 
| If True, the order will be treated as part of a position's split-TP/SL set, subject to aggregate size/count limits. 
|


[TriggerBy](/../../schemas/trigger_by)

Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.

Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.


| Value 
| Description 
|


| `UNSPECIFIED` = 0 
| no trigger condition 
|


| `INDEX` = 1 
| INDEX - Order is activated when the index price reaches the trigger price 
|


| `LAST` = 2 
| LAST - Order is activated when the last trade price reaches the trigger price 
|


| `MID` = 3 
| MID - Order is activated when the mid price reaches the trigger price 
|


| `MARK` = 4 
| MARK - Order is activated when the mark price reaches the trigger price 
|


[BrokerTag](/../../schemas/broker_tag)

BrokerTag is a tag for the broker that the order is sent from.


| Value 
| Description 
|


| `UNSPECIFIED` = 0 
|  
|


| `COIN_ROUTES` = 1 
| CoinRoutes 
|


| `ALERTATRON` = 2 
| Alertatron 
|


| `ORIGAMI` = 3 
| Origami 
|


[OrderState](/../../schemas/order_state)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| status`s` 
| OrderStatus 
| True 
| The status of the order 
|


| reject_reason`rr` 
| OrderRejectReason 
| True 
| The reason for rejection or cancellation 
|


| book_size`bs` 
| [string] 
| True 
| The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs 
|


| traded_size`ts` 
| [string] 
| True 
| The total number of assets traded. Sorted in same order as Order.Legs 
|


| update_time`ut` 
| string 
| True 
| Time at which the order was updated by GRVT, expressed in unix nanoseconds 
|


| avg_fill_price`af` 
| [string] 
| True 
| The average fill price of the order. Sorted in same order as Order.Legs 
|


[OrderStatus](/../../schemas/order_status)

| Value 
| Description 
|


| `PENDING` = 1 
| Order has been sent to the matching engine and is pending a transition to open/filled/rejected. 
|


| `OPEN` = 2 
| Order is actively matching on the matching engine, could be unfilled or partially filled. 
|


| `FILLED` = 3 
| Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open. 
|


| `REJECTED` = 4 
| Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected. 
|


| `CANCELLED` = 5 
| Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled. 
|


[OrderRejectReason](/../../schemas/order_reject_reason)

| Value 
| Description 
|


| `UNSPECIFIED` = 0 
| order is not cancelled or rejected 
|


| `CLIENT_CANCEL` = 1 
| client called a Cancel API 
|


| `CLIENT_BULK_CANCEL` = 2 
| client called a Bulk Cancel API 
|


| `CLIENT_SESSION_END` = 3 
| client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate' 
|


| `MARKET_CANCEL` = 4 
| the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons 
|


| `IOC_CANCEL` = 5 
| the IOC order was cancelled after no/partial fill 
|


| `AON_CANCEL` = 6 
| the AON order was cancelled as it could not be fully matched 
|


| `FOK_CANCEL` = 7 
| the FOK order was cancelled as it could not be fully matched 
|


| `EXPIRED` = 8 
| the order was cancelled as it has expired 
|


| `FAIL_POST_ONLY` = 9 
| the post-only order could not be posted into the orderbook 
|


| `FAIL_REDUCE_ONLY` = 10 
| the reduce-only order would have caused position size to increase 
|


| `MM_PROTECTION` = 11 
| the order was cancelled due to market maker protection trigger 
|


| `SELF_TRADE_PROTECTION` = 12 
| the order was cancelled due to self-trade protection trigger 
|


| `SELF_MATCHED_SUBACCOUNT` = 13 
| the order matched with another order from the same sub account 
|


| `OVERLAPPING_CLIENT_ORDER_ID` = 14 
| an active order on your sub account shares the same clientOrderId 
|


| `BELOW_MARGIN` = 15 
| the order will bring the sub account below initial margin requirement 
|


| `LIQUIDATION` = 16 
| the sub account is liquidated (and all open orders are cancelled by Gravity) 
|


| `INSTRUMENT_INVALID` = 17 
| instrument is invalid or not found on Gravity 
|


| `INSTRUMENT_DEACTIVATED` = 18 
| instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry) 
|


| `SYSTEM_FAILOVER` = 19 
| system failover resulting in loss of order state 
|


| `UNAUTHORISED` = 20 
| the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action 
|


| `SESSION_KEY_EXPIRED` = 21 
| the session key used to sign the order expired 
|


| `SUB_ACCOUNT_NOT_FOUND` = 22 
| the subaccount does not exist 
|


| `NO_TRADE_PERMISSION` = 23 
| the signature used to sign the order has no trade permission 
|


| `UNSUPPORTED_TIME_IN_FORCE` = 24 
| the order payload does not contain a supported TimeInForce value 
|


| `MULTI_LEGGED_ORDER` = 25 
| the order has multiple legs, but multiple legs are not supported by this venue 
|


| `EXCEED_MAX_POSITION_SIZE` = 26 
| the order would have caused the subaccount to exceed the max position size 
|


| `EXCEED_MAX_SIGNATURE_EXPIRATION` = 27 
| the signature supplied is more than 30 days in the future 
|


| `MARKET_ORDER_WITH_LIMIT_PRICE` = 28 
| the market order has a limit price set 
|


| `CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29 
| client cancel on disconnect triggered 
|


| `OCO_COUNTER_PART_TRIGGERED` = 30 
| the OCO counter part order was triggered 
|


| `REDUCE_ONLY_LIMIT` = 31 
| the remaining order size was cancelled because it exceeded current position size 
|


| `CLIENT_REPLACE` = 32 
| the order was replaced by a client replace request 
|


| `DERISK_MUST_BE_IOC` = 33 
| the derisk order must be an IOC order 
|


| `DERISK_MUST_BE_REDUCE_ONLY` = 34 
| the derisk order must be a reduce-only order 
|


| `DERISK_NOT_SUPPORTED` = 35 
| derisk is not supported 
|


| `INVALID_ORDER_TYPE` = 36 
| the order type is invalid 
|


| `CURRENCY_NOT_DEFINED` = 37 
| the currency is not defined 
|


| `INVALID_CHAIN_ID` = 38 
| the chain ID is invalid 
|


| `BUILDER_ORDER_FEE_EXCEED` = 39 
| Builder fee exceed the limit 
|


| `BUILDER_ORDER_FEE_NEGATIVE` = 40 
| Builder fee is below 0 
|


| `BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41 
| Builder is not an authorized builder for client 
|


| `BUILDER_ORDER_BUILDER_NOT_EXIST` = 42 
| Builder does not exist 
|


| `TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44 
| the trade price is worse than the bankruptcy price 
|


| `TOO_MANY_MAKER_ORDERS` = 45 
| the order was cancelled due to matching with too many maker orders 
|


| `INSUFFICIENT_BALANCE` = 49 
| the subaccount has insufficient balance 
|


| `BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51 
| the order will bring the sub account below initial margin requirement considering wide price deviation 
|


Success


**Full Feed Response**
`{
    "stream": "v1.order",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "order_id": "0x1234567890abcdef",
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "is_market": false,
        "time_in_force": "GOOD_TILL_TIME",
        "post_only": false,
        "reduce_only": false,
        "legs": [{
            "instrument": "BTC_USDT_Perp",
            "size": "10.5",
            "limit_price": "65038.01",
            "is_buying_asset": true
        }],
        "signature": {
            "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
            "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
            "v": 28,
            "expiration": "1697788800000000000",
            "nonce": 1234567890,
            "chain_id": "325"
        },
        "metadata": {
            "client_order_id": "23042",
            "create_time": "1697788800000000000",
            "trigger": {
                "trigger_type": "TAKE_PROFIT",
                "tpsl": {
                    "trigger_by": "LAST",
                    "trigger_price": "65038.10",
                    "close_position": false,
                    "is_split_position": false
                }
            },
            "broker": "BROKER_CODE"
        },
        "state": {
            "status": "PENDING",
            "reject_reason": "CLIENT_CANCEL",
            "book_size": ["10.5"],
            "traded_size": ["1.5"],
            "update_time": "1697788800000000000",
            "avg_fill_price": ["60000.4"]
        },
        "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
        "builder_fee": "0.001"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.order",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "oi": "0x1234567890abcdef",
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "im": false,
        "ti": "GOOD_TILL_TIME",
        "po": false,
        "ro": false,
        "l": [{
            "i": "BTC_USDT_Perp",
            "s": "10.5",
            "lp": "65038.01",
            "ib": true
        }],
        "s": {
            "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
            "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
            "v": 28,
            "e": "1697788800000000000",
            "n": 1234567890,
            "ci": "325"
        },
        "m": {
            "co": "23042",
            "ct": "1697788800000000000",
            "t": {
                "tt": "TAKE_PROFIT",
                "t": {
                    "tb": "LAST",
                    "tp": "65038.10",
                    "cp": false,
                    "is": false
                }
            },
            "b": "BROKER_CODE"
        },
        "s1": {
            "s": "PENDING",
            "rr": "CLIENT_CANCEL",
            "bs": ["10.5"],
            "ts": ["1.5"],
            "ut": "1697788800000000000",
            "af": ["60000.4"]
        },
        "b": "'$GRVT_MAIN_ACCOUNT_ID'",
        "bf": "0.001"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1000 
| 401 
| You need to authenticate prior to using this functionality 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


| 3000 
| 400 
| Instrument is invalid 
|


| 3020 
| 400 
| Sub account ID must be an uint64 integer 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1000,
        "message": "You need to authenticate prior to using this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1000,
        "m": "You need to authenticate prior to using this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.order",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.order",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.order",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Order State

`STREAM: v1.state`
Feed SelectorFeed DataErrorsTry it out


[WSOrderStateFeedSelectorV1](/../../schemas/ws_order_state_feed_selector_v1)


Subscribes to a feed of order updates pertaining to orders made by your account.
Unlike the Order Stream, this only streams state updates, drastically improving throughput, and latency.
Each Order can be uniquely identified by its `order_id` or `client_order_id`.
To subscribe to all orders, specify an empty `instrument` (eg. `2345123`).
Otherwise, specify the `instrument` to only receive orders for that instrument (eg. `2345123-BTC_USDT_Perp`).


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| sub_account_id`sa` 
| string 
| True 
| The subaccount ID to filter by 
|


| instrument`i` 
| string 
| False`'all'` 
| The instrument filter to apply. 
|


JSONRPC Wrappers


[JSONRPCRequest](/../../schemas/jsonrpc_request)


All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


| params`p` 
| object 
| True 
| The parameters for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


[WSSubscribeParams](/../../schemas/ws_subscribe_params)


All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
Sequence numbers can be either gateway-specific or global:
- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


[WSSubscribeResult](/../../schemas/ws_subscribe_result)


To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)


All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to unsubscribe from (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to unsubscribe from 
|


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)


Returns a confirmation of all unsubscribes


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)


All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| feed`f` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: subscribe / unsubscribe) 
|


| is_full`if` 
| boolean 
| False`false` 
| Whether the request is for full data or lite data 
|


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)


All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


Subscribe

**Full Subscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.state",
        "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe

**Full Unsubscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.state",
        "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.state",
    "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSOrderStateFeedDataV1](/../../schemas/ws_order_state_feed_data_v1)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| Stream name 
|


| selector`s1` 
| string 
| True 
| Primary selector 
|


| sequence_number`sn` 
| string 
| True 
| A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`. 
|


| feed`f` 
| OrderStateFeed 
| True 
| The Order State Feed 
|


[OrderStateFeed](/../../schemas/order_state_feed)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| order_id`oi` 
| string 
| True 
| A unique 128-bit identifier for the order, deterministically generated within the GRVT backend 
|


| client_order_id`co` 
| string 
| True 
| A unique identifier for the active order within a subaccount, specified by the client 
|


| order_state`os` 
| OrderState 
| True 
| The order state object being created or updated 
|


[OrderState](/../../schemas/order_state)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| status`s` 
| OrderStatus 
| True 
| The status of the order 
|


| reject_reason`rr` 
| OrderRejectReason 
| True 
| The reason for rejection or cancellation 
|


| book_size`bs` 
| [string] 
| True 
| The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs 
|


| traded_size`ts` 
| [string] 
| True 
| The total number of assets traded. Sorted in same order as Order.Legs 
|


| update_time`ut` 
| string 
| True 
| Time at which the order was updated by GRVT, expressed in unix nanoseconds 
|


| avg_fill_price`af` 
| [string] 
| True 
| The average fill price of the order. Sorted in same order as Order.Legs 
|


[OrderStatus](/../../schemas/order_status)

| Value 
| Description 
|


| `PENDING` = 1 
| Order has been sent to the matching engine and is pending a transition to open/filled/rejected. 
|


| `OPEN` = 2 
| Order is actively matching on the matching engine, could be unfilled or partially filled. 
|


| `FILLED` = 3 
| Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open. 
|


| `REJECTED` = 4 
| Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected. 
|


| `CANCELLED` = 5 
| Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled. 
|


[OrderRejectReason](/../../schemas/order_reject_reason)

| Value 
| Description 
|


| `UNSPECIFIED` = 0 
| order is not cancelled or rejected 
|


| `CLIENT_CANCEL` = 1 
| client called a Cancel API 
|


| `CLIENT_BULK_CANCEL` = 2 
| client called a Bulk Cancel API 
|


| `CLIENT_SESSION_END` = 3 
| client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate' 
|


| `MARKET_CANCEL` = 4 
| the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons 
|


| `IOC_CANCEL` = 5 
| the IOC order was cancelled after no/partial fill 
|


| `AON_CANCEL` = 6 
| the AON order was cancelled as it could not be fully matched 
|


| `FOK_CANCEL` = 7 
| the FOK order was cancelled as it could not be fully matched 
|


| `EXPIRED` = 8 
| the order was cancelled as it has expired 
|


| `FAIL_POST_ONLY` = 9 
| the post-only order could not be posted into the orderbook 
|


| `FAIL_REDUCE_ONLY` = 10 
| the reduce-only order would have caused position size to increase 
|


| `MM_PROTECTION` = 11 
| the order was cancelled due to market maker protection trigger 
|


| `SELF_TRADE_PROTECTION` = 12 
| the order was cancelled due to self-trade protection trigger 
|


| `SELF_MATCHED_SUBACCOUNT` = 13 
| the order matched with another order from the same sub account 
|


| `OVERLAPPING_CLIENT_ORDER_ID` = 14 
| an active order on your sub account shares the same clientOrderId 
|


| `BELOW_MARGIN` = 15 
| the order will bring the sub account below initial margin requirement 
|


| `LIQUIDATION` = 16 
| the sub account is liquidated (and all open orders are cancelled by Gravity) 
|


| `INSTRUMENT_INVALID` = 17 
| instrument is invalid or not found on Gravity 
|


| `INSTRUMENT_DEACTIVATED` = 18 
| instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry) 
|


| `SYSTEM_FAILOVER` = 19 
| system failover resulting in loss of order state 
|


| `UNAUTHORISED` = 20 
| the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action 
|


| `SESSION_KEY_EXPIRED` = 21 
| the session key used to sign the order expired 
|


| `SUB_ACCOUNT_NOT_FOUND` = 22 
| the subaccount does not exist 
|


| `NO_TRADE_PERMISSION` = 23 
| the signature used to sign the order has no trade permission 
|


| `UNSUPPORTED_TIME_IN_FORCE` = 24 
| the order payload does not contain a supported TimeInForce value 
|


| `MULTI_LEGGED_ORDER` = 25 
| the order has multiple legs, but multiple legs are not supported by this venue 
|


| `EXCEED_MAX_POSITION_SIZE` = 26 
| the order would have caused the subaccount to exceed the max position size 
|


| `EXCEED_MAX_SIGNATURE_EXPIRATION` = 27 
| the signature supplied is more than 30 days in the future 
|


| `MARKET_ORDER_WITH_LIMIT_PRICE` = 28 
| the market order has a limit price set 
|


| `CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29 
| client cancel on disconnect triggered 
|


| `OCO_COUNTER_PART_TRIGGERED` = 30 
| the OCO counter part order was triggered 
|


| `REDUCE_ONLY_LIMIT` = 31 
| the remaining order size was cancelled because it exceeded current position size 
|


| `CLIENT_REPLACE` = 32 
| the order was replaced by a client replace request 
|


| `DERISK_MUST_BE_IOC` = 33 
| the derisk order must be an IOC order 
|


| `DERISK_MUST_BE_REDUCE_ONLY` = 34 
| the derisk order must be a reduce-only order 
|


| `DERISK_NOT_SUPPORTED` = 35 
| derisk is not supported 
|


| `INVALID_ORDER_TYPE` = 36 
| the order type is invalid 
|


| `CURRENCY_NOT_DEFINED` = 37 
| the currency is not defined 
|


| `INVALID_CHAIN_ID` = 38 
| the chain ID is invalid 
|


| `BUILDER_ORDER_FEE_EXCEED` = 39 
| Builder fee exceed the limit 
|


| `BUILDER_ORDER_FEE_NEGATIVE` = 40 
| Builder fee is below 0 
|


| `BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41 
| Builder is not an authorized builder for client 
|


| `BUILDER_ORDER_BUILDER_NOT_EXIST` = 42 
| Builder does not exist 
|


| `TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44 
| the trade price is worse than the bankruptcy price 
|


| `TOO_MANY_MAKER_ORDERS` = 45 
| the order was cancelled due to matching with too many maker orders 
|


| `INSUFFICIENT_BALANCE` = 49 
| the subaccount has insufficient balance 
|


| `BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51 
| the order will bring the sub account below initial margin requirement considering wide price deviation 
|


Success


**Full Feed Response**
`{
    "stream": "v1.state",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "order_id": "10000101000203040506",
        "client_order_id": "23042",
        "order_state": {
            "status": "PENDING",
            "reject_reason": "CLIENT_CANCEL",
            "book_size": ["10.5"],
            "traded_size": ["1.5"],
            "update_time": "1697788800000000000",
            "avg_fill_price": ["60000.4"]
        }
    }
}`
**Lite Feed Response**
`{
    "s": "v1.state",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "oi": "10000101000203040506",
        "co": "23042",
        "os": {
            "s": "PENDING",
            "rr": "CLIENT_CANCEL",
            "bs": ["10.5"],
            "ts": ["1.5"],
            "ut": "1697788800000000000",
            "af": ["60000.4"]
        }
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1000 
| 401 
| You need to authenticate prior to using this functionality 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


| 3000 
| 400 
| Instrument is invalid 
|


| 3020 
| 400 
| Sub account ID must be an uint64 integer 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1000,
        "message": "You need to authenticate prior to using this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1000,
        "m": "You need to authenticate prior to using this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.state",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.state",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.state",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Cancel Status

`STREAM: v1.cancel`
Feed SelectorFeed DataErrorsTry it out


[WSCancelFeedSelectorV1](/../../schemas/ws_cancel_feed_selector_v1)


Subscribes to a feed of time-to-live expiry events for order cancellations requested by a given subaccount.
**This stream presently only provides expiry updates for cancel-order requests set with a valid TTL value**.
Successful order cancellations will reflect as updates published to the [order-state stream](https://api-docs.grvt.io/trading_streams/#order-state).
_A future release will expand the functionality of this stream to provide more general status updates on order cancellation requests._
Each Order can be uniquely identified by its `client_order_id`.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| sub_account_id`sa` 
| string 
| True 
| The subaccount ID to filter by 
|


JSONRPC Wrappers


[JSONRPCRequest](/../../schemas/jsonrpc_request)


All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


| params`p` 
| object 
| True 
| The parameters for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


[WSSubscribeParams](/../../schemas/ws_subscribe_params)


All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
Sequence numbers can be either gateway-specific or global:
- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


[WSSubscribeResult](/../../schemas/ws_subscribe_result)


To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)


All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to unsubscribe from (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to unsubscribe from 
|


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)


Returns a confirmation of all unsubscribes


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)


All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| feed`f` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: subscribe / unsubscribe) 
|


| is_full`if` 
| boolean 
| False`false` 
| Whether the request is for full data or lite data 
|


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)


All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


Subscribe

**Full Subscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.cancel",
        "subs": ["'$GRVT_SUB_ACCOUNT_ID'"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe

**Full Unsubscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.cancel",
        "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.cancel",
    "subs":["'$GRVT_SUB_ACCOUNT_ID'"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSCancelFeedDataV1](/../../schemas/ws_cancel_feed_data_v1)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| Stream name 
|


| selector`s1` 
| string 
| True 
| Primary selector 
|


| sequence_number`sn` 
| string 
| True 
| A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`. 
|


| feed`f` 
| CancelStatusFeed 
| True 
| Data relating to the status of the cancellation attempt 
|


[CancelStatusFeed](/../../schemas/cancel_status_feed)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| sub_account_id`sa` 
| string 
| True 
| The subaccount ID that requested the cancellation 
|


| client_order_id`co` 
| string 
| True 
| A unique identifier for the active order within a subaccount, specified by the client 
|


| order_id`oi` 
| string 
| True 
| A unique 128-bit identifier for the order, deterministically generated within the GRVT backend 
|


| reason`r` 
| OrderRejectReason 
| True 
| The user-provided reason for cancelling the order 
|


| update_time`ut` 
| string 
| False`0` 
| [Filled by GRVT Backend] Time at which the cancellation status was updated by GRVT in unix nanoseconds 
|


| cancel_status`cs` 
| CancelStatus 
| True 
| Status of the cancellation attempt 
|


[OrderRejectReason](/../../schemas/order_reject_reason)

| Value 
| Description 
|


| `UNSPECIFIED` = 0 
| order is not cancelled or rejected 
|


| `CLIENT_CANCEL` = 1 
| client called a Cancel API 
|


| `CLIENT_BULK_CANCEL` = 2 
| client called a Bulk Cancel API 
|


| `CLIENT_SESSION_END` = 3 
| client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate' 
|


| `MARKET_CANCEL` = 4 
| the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons 
|


| `IOC_CANCEL` = 5 
| the IOC order was cancelled after no/partial fill 
|


| `AON_CANCEL` = 6 
| the AON order was cancelled as it could not be fully matched 
|


| `FOK_CANCEL` = 7 
| the FOK order was cancelled as it could not be fully matched 
|


| `EXPIRED` = 8 
| the order was cancelled as it has expired 
|


| `FAIL_POST_ONLY` = 9 
| the post-only order could not be posted into the orderbook 
|


| `FAIL_REDUCE_ONLY` = 10 
| the reduce-only order would have caused position size to increase 
|


| `MM_PROTECTION` = 11 
| the order was cancelled due to market maker protection trigger 
|


| `SELF_TRADE_PROTECTION` = 12 
| the order was cancelled due to self-trade protection trigger 
|


| `SELF_MATCHED_SUBACCOUNT` = 13 
| the order matched with another order from the same sub account 
|


| `OVERLAPPING_CLIENT_ORDER_ID` = 14 
| an active order on your sub account shares the same clientOrderId 
|


| `BELOW_MARGIN` = 15 
| the order will bring the sub account below initial margin requirement 
|


| `LIQUIDATION` = 16 
| the sub account is liquidated (and all open orders are cancelled by Gravity) 
|


| `INSTRUMENT_INVALID` = 17 
| instrument is invalid or not found on Gravity 
|


| `INSTRUMENT_DEACTIVATED` = 18 
| instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry) 
|


| `SYSTEM_FAILOVER` = 19 
| system failover resulting in loss of order state 
|


| `UNAUTHORISED` = 20 
| the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action 
|


| `SESSION_KEY_EXPIRED` = 21 
| the session key used to sign the order expired 
|


| `SUB_ACCOUNT_NOT_FOUND` = 22 
| the subaccount does not exist 
|


| `NO_TRADE_PERMISSION` = 23 
| the signature used to sign the order has no trade permission 
|


| `UNSUPPORTED_TIME_IN_FORCE` = 24 
| the order payload does not contain a supported TimeInForce value 
|


| `MULTI_LEGGED_ORDER` = 25 
| the order has multiple legs, but multiple legs are not supported by this venue 
|


| `EXCEED_MAX_POSITION_SIZE` = 26 
| the order would have caused the subaccount to exceed the max position size 
|


| `EXCEED_MAX_SIGNATURE_EXPIRATION` = 27 
| the signature supplied is more than 30 days in the future 
|


| `MARKET_ORDER_WITH_LIMIT_PRICE` = 28 
| the market order has a limit price set 
|


| `CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29 
| client cancel on disconnect triggered 
|


| `OCO_COUNTER_PART_TRIGGERED` = 30 
| the OCO counter part order was triggered 
|


| `REDUCE_ONLY_LIMIT` = 31 
| the remaining order size was cancelled because it exceeded current position size 
|


| `CLIENT_REPLACE` = 32 
| the order was replaced by a client replace request 
|


| `DERISK_MUST_BE_IOC` = 33 
| the derisk order must be an IOC order 
|


| `DERISK_MUST_BE_REDUCE_ONLY` = 34 
| the derisk order must be a reduce-only order 
|


| `DERISK_NOT_SUPPORTED` = 35 
| derisk is not supported 
|


| `INVALID_ORDER_TYPE` = 36 
| the order type is invalid 
|


| `CURRENCY_NOT_DEFINED` = 37 
| the currency is not defined 
|


| `INVALID_CHAIN_ID` = 38 
| the chain ID is invalid 
|


| `BUILDER_ORDER_FEE_EXCEED` = 39 
| Builder fee exceed the limit 
|


| `BUILDER_ORDER_FEE_NEGATIVE` = 40 
| Builder fee is below 0 
|


| `BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41 
| Builder is not an authorized builder for client 
|


| `BUILDER_ORDER_BUILDER_NOT_EXIST` = 42 
| Builder does not exist 
|


| `TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44 
| the trade price is worse than the bankruptcy price 
|


| `TOO_MANY_MAKER_ORDERS` = 45 
| the order was cancelled due to matching with too many maker orders 
|


| `INSUFFICIENT_BALANCE` = 49 
| the subaccount has insufficient balance 
|


| `BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51 
| the order will bring the sub account below initial margin requirement considering wide price deviation 
|


[CancelStatus](/../../schemas/cancel_status)

| Value 
| Description 
|


| `EXPIRED` = 1 
| Cancellation has expired because corresponding order had not arrived within the defined time-to-live window. 
|


| `DROPPED_DUPLICATE` = 2 
| This cancellation request was dropped because its TTL window overlaps with another cancellation request for the same order. 
|


Success


**Full Feed Response**
`{
    "stream": "v1.cancel",
    "selector": "'$GRVT_SUB_ACCOUNT_ID'",
    "sequence_number": "872634876",
    "feed": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "client_order_id": "23042",
        "order_id": "10000101000203040506",
        "reason": "UNSPECIFIED",
        "update_time": "1697788800000000000",
        "cancel_status": "EXPIRED"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.cancel",
    "s1": "'$GRVT_SUB_ACCOUNT_ID'",
    "sn": "872634876",
    "f": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "co": "23042",
        "oi": "10000101000203040506",
        "r": "UNSPECIFIED",
        "ut": "1697788800000000000",
        "cs": "EXPIRED"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1000 
| 401 
| You need to authenticate prior to using this functionality 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


| 3000 
| 400 
| Instrument is invalid 
|


| 3020 
| 400 
| Sub account ID must be an uint64 integer 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1000,
        "message": "You need to authenticate prior to using this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1000,
        "m": "You need to authenticate prior to using this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.cancel",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.cancel",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.cancel",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


## Execution


### Fill

`STREAM: v1.fill`
Feed SelectorFeed DataErrorsTry it out


[WSFillFeedSelectorV1](/../../schemas/ws_fill_feed_selector_v1)


Subscribes to a feed of private trade updates. This happens when a trade is executed.
To subscribe to all private trades, specify an empty `instrument` (eg. `2345123`).
Otherwise, specify the `instrument` to only receive private trades for that instrument (eg. `2345123-BTC_USDT_Perp`).


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| sub_account_id`sa` 
| string 
| True 
| The sub account ID to request for 
|


| instrument`i` 
| string 
| False`'all'` 
| The instrument filter to apply. 
|


JSONRPC Wrappers


[JSONRPCRequest](/../../schemas/jsonrpc_request)


All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


| params`p` 
| object 
| True 
| The parameters for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


[WSSubscribeParams](/../../schemas/ws_subscribe_params)


All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
Sequence numbers can be either gateway-specific or global:
- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


[WSSubscribeResult](/../../schemas/ws_subscribe_result)


To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)


All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to unsubscribe from (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to unsubscribe from 
|


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)


Returns a confirmation of all unsubscribes


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)


All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| feed`f` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: subscribe / unsubscribe) 
|


| is_full`if` 
| boolean 
| False`false` 
| Whether the request is for full data or lite data 
|


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)


All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


Subscribe

**Full Subscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.fill",
        "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe

**Full Unsubscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.fill",
        "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.fill",
    "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSFillFeedDataV1](/../../schemas/ws_fill_feed_data_v1)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The websocket channel to which the response is sent 
|


| selector`s1` 
| string 
| True 
| Primary selector 
|


| sequence_number`sn` 
| string 
| True 
| A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`. 
|


| feed`f` 
| Fill 
| True 
| A private trade matching the request filter 
|


[Fill](/../../schemas/fill)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| event_time`et` 
| string 
| True 
| Time at which the event was emitted in unix nanoseconds 
|


| sub_account_id`sa` 
| string 
| True 
| The sub account ID that participated in the trade 
|


| instrument`i` 
| string 
| True 
| The instrument being represented 
|


| is_buyer`ib` 
| boolean 
| True 
| The side that the subaccount took on the trade 
|


| is_taker`it` 
| boolean 
| True 
| The role that the subaccount took on the trade 
|


| size`s` 
| string 
| True 
| The number of assets being traded, expressed in base asset decimal units 
|


| price`p` 
| string 
| True 
| The traded price, expressed in `9` decimals 
|


| mark_price`mp` 
| string 
| False`None` 
| The mark price of the instrument at point of trade, expressed in `9` decimals 
|


| index_price`ip` 
| string 
| True 
| The index price of the instrument at point of trade, expressed in `9` decimals 
|


| interest_rate`ir` 
| string 
| True 
| The interest rate of the underlying at point of trade, expressed in centibeeps (1/100th of a basis point) 
|


| forward_price`fp` 
| string 
| False`None` 
| [Options] The forward price of the option at point of trade, expressed in `9` decimals 
|


| realized_pnl`rp` 
| string 
| True 
| The realized PnL of the trade, expressed in quote asset decimal units (0 if increasing position size) 
|


| fee`f` 
| string 
| True 
| The fees paid on the trade, expressed in quote asset decimal unit (negative if maker rebate applied) 
|


| fee_rate`fr` 
| string 
| True 
| The fee rate paid on the trade 
|


| trade_id`ti` 
| string 
| True 
| A trade identifier, globally unique, and monotonically increasing (not by `1`).All trades sharing a single taker execution share the same first component (before `-`), and `event_time`.`trade_id` is guaranteed to be consistent across MarketData `Trade` and Trading `Fill`. 
|


| order_id`oi` 
| string 
| True 
| An order identifier 
|


| venue`v` 
| Venue 
| True 
| The venue where the trade occurred 
|


| is_liquidation`il` 
| boolean 
| True 
| If the trade was a liquidation 
|


| client_order_id`co` 
| string 
| True 
| A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId 
|


| signer`s1` 
| string 
| True 
| The address (public key) of the wallet signing the payload 
|


| broker`b` 
| BrokerTag 
| False`` 
| Specifies the broker who brokered the order 
|


| is_rpi`ir1` 
| boolean 
| True 
| If the trade is a RPI trade 
|


| builder`b1` 
| string 
| True 
| The main account ID of the builder. referred to Order.builder 
|


| builder_fee_rate`bf` 
| string 
| True 
| Builder fee percentage charged for this order. referred to Order.builder builderFee 
|


| builder_fee`bf1` 
| string 
| True 
| The builder fee paid on the trade, expressed in quote asset decimal unit. referred to Trade.builderFee 
|


| fee_currency`fc` 
| string 
| True 
| The currency of the fee paid on the trade 
|


[Venue](/../../schemas/venue)

The list of Trading Venues that are supported on the GRVT exchange


| Value 
| Description 
|


| `ORDERBOOK` = 1 
| the trade is cleared on the orderbook venue 
|


| `RFQ` = 2 
| the trade is cleared on the RFQ venue 
|


[BrokerTag](/../../schemas/broker_tag)

BrokerTag is a tag for the broker that the order is sent from.


| Value 
| Description 
|


| `UNSPECIFIED` = 0 
|  
|


| `COIN_ROUTES` = 1 
| CoinRoutes 
|


| `ALERTATRON` = 2 
| Alertatron 
|


| `ORIGAMI` = 3 
| Origami 
|


Success


**Full Feed Response**
`{
    "stream": "v1.fill",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "instrument": "BTC_USDT_Perp",
        "is_buyer": true,
        "is_taker": true,
        "size": "0.30",
        "price": "65038.01",
        "mark_price": "65038.01",
        "index_price": "65038.01",
        "interest_rate": 0.0003,
        "forward_price": "65038.01",
        "realized_pnl": "2400.50",
        "fee": "9.75",
        "fee_rate": 0.0003,
        "trade_id": "209358-2",
        "order_id": "0x10000101000203040506",
        "venue": "ORDERBOOK",
        "is_liquidation": false,
        "client_order_id": "23042",
        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "broker": "UNSPECIFIED",
        "is_rpi": false,
        "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
        "builder_fee_rate": 0.001,
        "builder_fee": "0.2",
        "fee_currency": "USDT"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.fill",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "i": "BTC_USDT_Perp",
        "ib": true,
        "it": true,
        "s": "0.30",
        "p": "65038.01",
        "mp": "65038.01",
        "ip": "65038.01",
        "ir": 0.0003,
        "fp": "65038.01",
        "rp": "2400.50",
        "f": "9.75",
        "fr": 0.0003,
        "ti": "209358-2",
        "oi": "0x10000101000203040506",
        "v": "ORDERBOOK",
        "il": false,
        "co": "23042",
        "s1": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "b": "UNSPECIFIED",
        "ir1": false,
        "b1": "'$GRVT_MAIN_ACCOUNT_ID'",
        "bf": 0.001,
        "bf1": "0.2",
        "fc": "USDT"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1000 
| 401 
| You need to authenticate prior to using this functionality 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


| 3000 
| 400 
| Instrument is invalid 
|


| 3020 
| 400 
| Sub account ID must be an uint64 integer 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1000,
        "message": "You need to authenticate prior to using this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1000,
        "m": "You need to authenticate prior to using this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.fill",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.fill",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.fill",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Positions

`STREAM: v1.position`
Feed SelectorFeed DataErrorsTry it out


[WSPositionsFeedSelectorV1](/../../schemas/ws_positions_feed_selector_v1)


Subscribes to a feed of position updates.
Updates get published when a trade is executed, and when leverage configurations are changed for instruments with ongoing positions.
To subscribe to all positions, specify an empty `instrument` (eg. `2345123`).
Otherwise, specify the `instrument` to only receive positions for that instrument (eg. `2345123-BTC_USDT_Perp`).


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| sub_account_id`sa` 
| string 
| True 
| The subaccount ID to filter by 
|


| instrument`i` 
| string 
| False`'all'` 
| The instrument filter to apply. 
|


JSONRPC Wrappers


[JSONRPCRequest](/../../schemas/jsonrpc_request)


All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


| params`p` 
| object 
| True 
| The parameters for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


[WSSubscribeParams](/../../schemas/ws_subscribe_params)


All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
Sequence numbers can be either gateway-specific or global:
- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


[WSSubscribeResult](/../../schemas/ws_subscribe_result)


To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)


All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to unsubscribe from (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to unsubscribe from 
|


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)


Returns a confirmation of all unsubscribes


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)


All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| feed`f` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: subscribe / unsubscribe) 
|


| is_full`if` 
| boolean 
| False`false` 
| Whether the request is for full data or lite data 
|


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)


All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


Subscribe

**Full Subscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.position",
        "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe

**Full Unsubscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.position",
        "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.position",
    "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSPositionsFeedDataV1](/../../schemas/ws_positions_feed_data_v1)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| Stream name 
|


| selector`s1` 
| string 
| True 
| Primary selector 
|


| sequence_number`sn` 
| string 
| True 
| A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`. 
|


| feed`f` 
| Positions 
| True 
| A Position being created or updated matching the request filter 
|


[Positions](/../../schemas/positions)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| event_time`et` 
| string 
| True 
| Time at which the event was emitted in unix nanoseconds 
|


| sub_account_id`sa` 
| string 
| True 
| The sub account ID that participated in the trade 
|


| instrument`i` 
| string 
| True 
| The instrument being represented 
|


| size`s` 
| string 
| True 
| The size of the position, expressed in base asset decimal units. Negative for short positions 
|


| notional`n` 
| string 
| True 
| The notional value of the position, negative for short assets, expressed in quote asset decimal units 
|


| entry_price`ep` 
| string 
| True 
| The entry price of the position, expressed in `9` decimalsWhenever increasing the size of a position, the entry price is updated to the new average entry price`new_entry_price = (old_entry_price * old_size + trade_price * trade_size) / (old_size + trade_size)` 
|


| exit_price`ep1` 
| string 
| True 
| The exit price of the position, expressed in `9` decimalsWhenever decreasing the size of a position, the exit price is updated to the new average exit price`new_exit_price = (old_exit_price * old_exit_trade_size + trade_price * trade_size) / (old_exit_trade_size + trade_size)` 
|


| mark_price`mp` 
| string 
| True 
| The mark price of the position, expressed in `9` decimals 
|


| unrealized_pnl`up` 
| string 
| True 
| The unrealized PnL of the position, expressed in quote asset decimal units`unrealized_pnl = (mark_price - entry_price) * size` 
|


| realized_pnl`rp` 
| string 
| True 
| The realized PnL of the position, expressed in quote asset decimal units`realized_pnl = (exit_price - entry_price) * exit_trade_size` 
|


| total_pnl`tp` 
| string 
| True 
| The total PnL of the position, expressed in quote asset decimal units`total_pnl = realized_pnl + unrealized_pnl` 
|


| roi`r` 
| string 
| True 
| The ROI of the position, expressed as a percentage`roi = (total_pnl / (entry_price * abs(size))) * 100^` 
|


| quote_index_price`qi` 
| string 
| True 
| The index price of the quote currency. (reported in `USD`) 
|


| est_liquidation_price`el` 
| string 
| True 
| The estimated liquidation price 
|


| leverage`l` 
| string 
| True 
| The current leverage value for this position 
|


| cumulative_fee`cf` 
| string 
| True 
| The cumulative fee paid on the position, expressed in quote asset decimal units 
|


| cumulative_realized_funding_payment`cr` 
| string 
| True 
| The cumulative realized funding payment of the position, expressed in quote asset decimal units. Positive if paid, negative if received 
|


| margin_type`mt` 
| PositionMarginType 
| True 
| The margin type of the position 
|


| isolated_balance`ib` 
| string 
| False`None` 
| [IsolatedOnly] The wallet balance reserved for this isolated margin position, expressed in quote asset decimal units. If this positions is liquidated, this is the maximal balance that can be lost 
|


| isolated_im`ii` 
| string 
| False`None` 
| [IsolatedOnly] The initial margin of the isolated margin position, expressed in quote asset decimal units. The `total_equity` required to open more size in the position 
|


| isolated_mm`im` 
| string 
| False`None` 
| [IsolatedOnly] The maintenance margin of the isolated margin position, expressed in quote asset decimal units. The `total_equity` required to avoid liquidation of the position 
|


[PositionMarginType](/../../schemas/position_margin_type)

| Value 
| Description 
|


| `ISOLATED` = 1 
| Isolated Margin Mode: each position is allocated a fixed amount of collateral 
|


| `CROSS` = 2 
| Cross Margin Mode: uses all available funds in your account as collateral across all cross margin positions 
|


Success


**Full Feed Response**
`{
    "stream": "v1.position",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "instrument": "BTC_USDT_Perp",
        "size": "2635000.50",
        "notional": "2635000.50",
        "entry_price": "65038.01",
        "exit_price": "65038.01",
        "mark_price": "65038.01",
        "unrealized_pnl": "135000.50",
        "realized_pnl": "-35000.30",
        "total_pnl": "100000.20",
        "roi": "10.20",
        "quote_index_price": "1.0000102",
        "est_liquidation_price": 60000.25,
        "leverage": "10",
        "cumulative_fee": "100000.20",
        "cumulative_realized_funding_payment": "100000.20",
        "margin_type": "cross",
        "isolated_balance": "100000.20",
        "isolated_im": "100000.20",
        "isolated_mm": "100000.20"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.position",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "i": "BTC_USDT_Perp",
        "s": "2635000.50",
        "n": "2635000.50",
        "ep": "65038.01",
        "ep1": "65038.01",
        "mp": "65038.01",
        "up": "135000.50",
        "rp": "-35000.30",
        "tp": "100000.20",
        "r": "10.20",
        "qi": "1.0000102",
        "el": 60000.25,
        "l": "10",
        "cf": "100000.20",
        "cr": "100000.20",
        "mt": "cross",
        "ib": "100000.20",
        "ii": "100000.20",
        "im": "100000.20"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1000 
| 401 
| You need to authenticate prior to using this functionality 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


| 3000 
| 400 
| Instrument is invalid 
|


| 3020 
| 400 
| Sub account ID must be an uint64 integer 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1000,
        "message": "You need to authenticate prior to using this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1000,
        "m": "You need to authenticate prior to using this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.position",
        "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.position",
        "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.position",
    "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


## Transfer


### Deposit

`STREAM: v1.deposit`
Feed SelectorFeed DataErrorsTry it out


[WSDepositFeedSelectorV1](/../../schemas/ws_deposit_feed_selector_v1)


Subscribes to a feed of deposits. This will execute when there is any deposit to selected account.
To subscribe to a main account, specify the account ID (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a`).


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| main_account_id`ma` 
| string 
| True 
| The main account ID to request for 
|


JSONRPC Wrappers


[JSONRPCRequest](/../../schemas/jsonrpc_request)


All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


| params`p` 
| object 
| True 
| The parameters for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


[WSSubscribeParams](/../../schemas/ws_subscribe_params)


All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
Sequence numbers can be either gateway-specific or global:
- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


[WSSubscribeResult](/../../schemas/ws_subscribe_result)


To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)


All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to unsubscribe from (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to unsubscribe from 
|


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)


Returns a confirmation of all unsubscribes


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)


All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| feed`f` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: subscribe / unsubscribe) 
|


| is_full`if` 
| boolean 
| False`false` 
| Whether the request is for full data or lite data 
|


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)


All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


Subscribe

**Full Subscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.deposit",
        "subs": ["'$GRVT_MAIN_ACCOUNT_ID'"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe

**Full Unsubscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.deposit",
        "unsubs": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.deposit",
    "subs":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSDepositFeedDataV1](/../../schemas/ws_deposit_feed_data_v1)


Subscribes to a feed of deposit updates.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The websocket channel to which the response is sent 
|


| selector`s1` 
| string 
| True 
| Primary selector 
|


| sequence_number`sn` 
| string 
| True 
| A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`. 
|


| feed`f` 
| Deposit 
| True 
| The Deposit object 
|


[Deposit](/../../schemas/deposit)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| tx_hash`th` 
| string 
| True 
| The hash of the bridgemint event producing the deposit 
|


| to_account_id`ta` 
| string 
| True 
| The account to deposit into 
|


| currency`c` 
| string 
| True 
| The token currency to deposit 
|


| num_tokens`nt` 
| string 
| True 
| The number of tokens to deposit 
|


Success


**Full Feed Response**
`{
    "stream": "v1.deposit",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "tx_hash": "0x1234567890123456789012345678901234567890123456789012345678901234",
        "to_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "currency": "USDT",
        "num_tokens": "10.50"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.deposit",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "th": "0x1234567890123456789012345678901234567890123456789012345678901234",
        "ta": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "c": "USDT",
        "nt": "10.50"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1001,
        "message": "You are not authorized to access this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1001,
        "m": "You are not authorized to access this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1001,
    "message":"You are not authorized to access this functionality",
    "status":403
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.deposit",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.deposit",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.deposit",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Transfer

`STREAM: v1.transfer`
Feed SelectorFeed DataErrorsTry it out


[WSTransferFeedSelectorV1](/../../schemas/ws_transfer_feed_selector_v1)


Subscribes to a feed of transfers. This will execute when there is any transfer to or from the selected account.
To subscribe to a main account, specify the account ID (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a`).
To subscribe to a sub account, specify the main account and the sub account dash separated (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a-1920109784202388`).


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| main_account_id`ma` 
| string 
| True 
| The main account ID to request for 
|


| sub_account_id`sa` 
| string 
| False`'0'` 
| The sub account ID to request for 
|


JSONRPC Wrappers


[JSONRPCRequest](/../../schemas/jsonrpc_request)


All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


| params`p` 
| object 
| True 
| The parameters for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


[WSSubscribeParams](/../../schemas/ws_subscribe_params)


All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
Sequence numbers can be either gateway-specific or global:
- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


[WSSubscribeResult](/../../schemas/ws_subscribe_result)


To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)


All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to unsubscribe from (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to unsubscribe from 
|


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)


Returns a confirmation of all unsubscribes


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)


All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| feed`f` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: subscribe / unsubscribe) 
|


| is_full`if` 
| boolean 
| False`false` 
| Whether the request is for full data or lite data 
|


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)


All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


Subscribe

**Full Subscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.transfer",
        "subs": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe

**Full Unsubscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.transfer",
        "unsubs": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.transfer",
    "subs":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSTransferFeedDataV1](/../../schemas/ws_transfer_feed_data_v1)


Subscribes to a feed of transfer updates.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The websocket channel to which the response is sent 
|


| selector`s1` 
| string 
| True 
| Primary selector 
|


| sequence_number`sn` 
| string 
| True 
| A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`. 
|


| feed`f` 
| TransferHistory 
| True 
| The transfer history matching the requested filters 
|


[TransferHistory](/../../schemas/transfer_history)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| tx_id`ti` 
| string 
| True 
| The transaction ID of the transfer 
|


| from_account_id`fa` 
| string 
| True 
| The account to transfer from 
|


| from_sub_account_id`fs` 
| string 
| True 
| The subaccount to transfer from (0 if transferring from main account) 
|


| to_account_id`ta` 
| string 
| True 
| The account to deposit into 
|


| to_sub_account_id`ts` 
| string 
| True 
| The subaccount to transfer to (0 if transferring to main account) 
|


| currency`c` 
| string 
| True 
| The token currency to transfer 
|


| num_tokens`nt` 
| string 
| True 
| The number of tokens to transfer 
|


| signature`s` 
| Signature 
| True 
| The signature of the transfer 
|


| event_time`et` 
| string 
| True 
| The timestamp of the transfer in unix nanoseconds 
|


| transfer_type`tt` 
| TransferType 
| True 
| The type of transfer 
|


| transfer_metadata`tm` 
| string 
| True 
| The metadata of the transfer 
|


[Signature](/../../schemas/signature)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| signer`s` 
| string 
| True 
| The address (public key) of the wallet signing the payload 
|


| r`r` 
| string 
| True 
| Signature R 
|


| s`s1` 
| string 
| True 
| Signature S 
|


| v`v` 
| integer 
| True 
| Signature V 
|


| expiration`e` 
| string 
| True 
| Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days 
|


| nonce`n` 
| integer 
| True 
| Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32) 
|


| chain_id`ci` 
| string 
| True 
| Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID. 
|


[TransferType](/../../schemas/transfer_type)

| Value 
| Description 
|


| `UNSPECIFIED` = 0 
| Default transfer that has nothing to do with bridging 
|


| `STANDARD` = 1 
| Standard transfer that has nothing to do with bridging 
|


| `FAST_ARB_DEPOSIT` = 2 
| Fast Arb Deposit Metadata type 
|


| `FAST_ARB_WITHDRAWAL` = 3 
| Fast Arb Withdrawal Metadata type 
|


| `NON_NATIVE_BRIDGE_DEPOSIT` = 4 
| Transfer type for non native bridging deposit 
|


| `NON_NATIVE_BRIDGE_WITHDRAWAL` = 5 
| Transfer type for non native bridging withdrawal 
|


| `ADHOC_INCENTIVE` = 6 
| Transfer type for adhoc incentive 
|


| `REFERRAL_INCENTIVE` = 7 
| Transfer type for referral incentive 
|


| `TRADING_DEPOSIT_YIELD_INCENTIVE` = 8 
| Transfer type for trading deposit yield incentive 
|


Success


**Full Feed Response**
`{
    "stream": "v1.transfer",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "tx_id": "1028403",
        "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "from_sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "to_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "to_sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "currency": "USDT",
        "num_tokens": "1500.0",
        "signature": {
            "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
            "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
            "v": 28,
            "expiration": "1697788800000000000",
            "nonce": 1234567890,
            "chain_id": "325"
        },
        "event_time": "1697788800000000000",
        "transfer_type": "STANDARD",
        "transfer_metadata": null
    }
}`
**Lite Feed Response**
`{
    "s": "v1.transfer",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "ti": "1028403",
        "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "fs": "'$GRVT_SUB_ACCOUNT_ID'",
        "ta": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "ts": "'$GRVT_SUB_ACCOUNT_ID'",
        "c": "USDT",
        "nt": "1500.0",
        "s": {
            "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
            "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
            "v": 28,
            "e": "1697788800000000000",
            "n": 1234567890,
            "ci": "325"
        },
        "et": "1697788800000000000",
        "tt": "STANDARD",
        "tm": null
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


| 3020 
| 400 
| Sub account ID must be an uint64 integer 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1001,
        "message": "You are not authorized to access this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1001,
        "m": "You are not authorized to access this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1001,
    "message":"You are not authorized to access this functionality",
    "status":403
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.transfer",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.transfer",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.transfer",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Withdrawal

`STREAM: v1.withdrawal`
Feed SelectorFeed DataErrorsTry it out


[WSWithdrawalFeedSelectorV1](/../../schemas/ws_withdrawal_feed_selector_v1)


Subscribes to a feed of withdrawals. This will execute when there is any withdrawal from the selected account.
To subscribe to a main account, specify the account ID (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a`).


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| main_account_id`ma` 
| string 
| True 
| The main account ID to request for 
|


JSONRPC Wrappers


[JSONRPCRequest](/../../schemas/jsonrpc_request)


All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


| params`p` 
| object 
| True 
| The parameters for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


[WSSubscribeParams](/../../schemas/ws_subscribe_params)


All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
Sequence numbers can be either gateway-specific or global:
- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


[WSSubscribeResult](/../../schemas/ws_subscribe_result)


To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)


All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to unsubscribe from (eg: ticker.s / ticker.d) 
|


| selectors`s1` 
| [string] 
| True 
| The list of feeds to unsubscribe from 
|


[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)


Returns a confirmation of all unsubscribes


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


[WSSubscribeRequestV1Legacy](/../../schemas/ws_subscribe_request_v1_legacy)


All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| feed`f` 
| [string] 
| True 
| The list of feeds to subscribe to 
|


| method`m` 
| string 
| True 
| The method to use for the request (eg: subscribe / unsubscribe) 
|


| is_full`if` 
| boolean 
| False`false` 
| Whether the request is for full data or lite data 
|


[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)


All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:
- All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas
- Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots
- First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots
- Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect
- Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.

When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_id`ri` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned 
|


| stream`s` 
| string 
| True 
| The channel to subscribe to (eg: ticker.s / ticker.d) 
|


| subs`s1` 
| [string] 
| True 
| The list of feeds subscribed to 
|


| unsubs`u` 
| [string] 
| True 
| The list of feeds unsubscribed from 
|


| num_snapshots`ns` 
| [integer] 
| True 
| The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs` 
|


| first_sequence_number`fs` 
| [string] 
| True 
| The first sequence number to expect for each subscribed feed. Returned in same order as `subs` 
|


Subscribe

**Full Subscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.withdrawal",
        "subs": ["'$GRVT_MAIN_ACCOUNT_ID'"],
        "unsubs": [],
        "num_snapshots": [10],
        "first_sequence_number": [872634876]
    },
    "id": 123,
    "method": "subscribe"
}`


Unsubscribe

**Full Unsubscribe Request**
`{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.withdrawal",
        "unsubs": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.withdrawal",
    "subs":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSWithdrawalFeedDataV1](/../../schemas/ws_withdrawal_feed_data_v1)


Subscribes to a feed of withdrawal updates.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| stream`s` 
| string 
| True 
| The websocket channel to which the response is sent 
|


| selector`s1` 
| string 
| True 
| Primary selector 
|


| sequence_number`sn` 
| string 
| True 
| A sequence number used to determine message order within a stream.- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.  - A single cluster payload can be multiplexed into multiple stream payloads.  - To distinguish each stream payload, a `dedupCounter` is included.  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`. 
|


| feed`f` 
| Withdrawal 
| True 
| The Withdrawal object 
|


[Withdrawal](/../../schemas/withdrawal)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| from_account_id`fa` 
| string 
| True 
| The subaccount to withdraw from 
|


| to_eth_address`te` 
| string 
| True 
| The ethereum address to withdraw to 
|


| currency`c` 
| string 
| True 
| The token currency to withdraw 
|


| num_tokens`nt` 
| string 
| True 
| The number of tokens to withdraw 
|


| signature`s` 
| Signature 
| True 
| The signature of the withdrawal 
|


[Signature](/../../schemas/signature)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| signer`s` 
| string 
| True 
| The address (public key) of the wallet signing the payload 
|


| r`r` 
| string 
| True 
| Signature R 
|


| s`s1` 
| string 
| True 
| Signature S 
|


| v`v` 
| integer 
| True 
| Signature V 
|


| expiration`e` 
| string 
| True 
| Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days 
|


| nonce`n` 
| integer 
| True 
| Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32) 
|


| chain_id`ci` 
| string 
| True 
| Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID. 
|


Success


**Full Feed Response**
`{
    "stream": "v1.withdrawal",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "currency": "USDT",
        "num_tokens": "10.50",
        "signature": {
            "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
            "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
            "v": 28,
            "expiration": "1697788800000000000",
            "nonce": 1234567890,
            "chain_id": "325"
        }
    }
}`
**Lite Feed Response**
`{
    "s": "v1.withdrawal",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
        "c": "USDT",
        "nt": "10.50",
        "s": {
            "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
            "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
            "v": 28,
            "e": "1697788800000000000",
            "n": 1234567890,
            "ci": "325"
        }
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1001 
| 403 
| You are not authorized to access this functionality 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 1101 
| 400 
| Feed Format must be in the format of @ 
|


| 1102 
| 400 
| Wrong number of primary selectors 
|


| 1103 
| 400 
| Wrong number of secondary selectors 
|


[JSONRPCResponse](/../../schemas/jsonrpc_response)


All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| jsonrpc`j` 
| string 
| True 
| The JSON RPC version to use for the request 
|


| result`r` 
| object 
| False`null` 
| The result for the request 
|


| error`e` 
| Error 
| False`null` 
| The error for the request 
|


| id`i` 
| integer 
| False`0` 
| Optional Field which is used to match the response by the client.If not passed, this field will not be returned.Range: 0 to 4,294,967,295 (uint32) 
|


| method`m` 
| string 
| True 
| The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` ) 
|


[Error](/../../schemas/error)

An error response


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| code`c` 
| integer 
| True 
| The error code for the request 
|


| message`m` 
| string 
| True 
| The error message for the request 
|


Error


**Full Error Response**
`{
    "jsonrpc": "2.0",
    "error": {
        "code": 1001,
        "message": "You are not authorized to access this functionality"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1001,
        "m": "You are not authorized to access this functionality"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1001,
    "message":"You are not authorized to access this functionality",
    "status":403
}`


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
| Unix timestamp in nanoseconds. Must be in the future, max **5 minutes** from now. See [Server Time](../market_data_api/#server-time). 
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


For a full example, see the [Authentication](../auth/#wallet-login) page.


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.testnet.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.withdrawal",
        "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.withdrawal",
        "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://trades.grvt.io/ws" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "request_id":1,
    "stream":"v1.withdrawal",
    "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`