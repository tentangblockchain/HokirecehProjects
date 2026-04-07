# Trading API - Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/trading_api/
> Fetched : 2026-04-07T15:12:38.257Z
> Engine  : MkDocs Material



# Trading APIs


All requests should be made using the `POST` HTTP method.


## Order


### Create Order


`FULL ENDPOINT: full/v1/create_order
LITE ENDPOINT: lite/v1/create_order`
RequestResponseErrorsTry it out


[ApiCreateOrderRequest](/../../schemas/api_create_order_request)


Create an order on the orderbook for this trading account.**Name`Lite`
Type
Required`Default`
Description


order`o`
Order
True
The order to create


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
If True, Order must be a maker order. It has to fill the orderbook instead of match it.If False, Order can be either a maker or taker order. In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.****reduce_only`ro`
boolean
False`false`
If True, Order must reduce the position size, or be cancelled


legs`l`
[OrderLeg]
True
The legs present in this orderThe legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice


signature`s`
Signature
True
The signature approving this order


metadata`m`
OrderMetadata
True
Order Metadata, ignored by the smart contract, and unsigned by the client


state`s1`
OrderState
False`''`
[Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client


builder`b`
string
True
The main account ID of the builder


builder_fee`bf`
string
True
Builder fee charged for this order, expressed as a percentage (e.g., 0.001 means 0.001%).


[TimeInForce](/../../schemas/time_in_force)


Must Fill All
Can Fill Partial


Must Fill Immediately
FOK
IOC


Can Fill Till Time
AON
GTC


Value
Description


`GOOD_TILL_TIME` = 1
GTT - Remains open until it is cancelled, or expired


`ALL_OR_NONE` = 2
AON - Either fill the whole order or none of it (Block Trades Only)


`IMMEDIATE_OR_CANCEL` = 3
IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it


`FILL_OR_KILL` = 4
FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it


`RETAIL_PRICE_IMPROVEMENT` = 5
RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users.


[OrderLeg](/../../schemas/order_leg)


Name`Lite`
Type
Required`Default`
Description


instrument`i`
string
True
The instrument to trade in this leg


size`s`
string
True
The total number of assets to trade in this leg, expressed in base asset decimal units.


limit_price`lp`
string
False`0`
The limit price of the order leg, expressed in `9` decimals.This is the number of quote currency units to pay/receive for this leg.This should be `null/0` if the order is a market order


is_buying_asset`ib`
boolean
True
Specifies if the order leg is a buy or sell


[Signature](/../../schemas/signature)


Name`Lite`
Type
Required`Default`
Description


signer`s`
string
True
The address (public key) of the wallet signing the payload


r`r`
string
True
Signature R


s`s1`
string
True
Signature S


v`v`
integer
True
Signature V


expiration`e`
string
True
Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days


nonce`n`
integer
True
Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32)


chain_id`ci`
string
True
Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID.


[OrderMetadata](/../../schemas/order_metadata)
Metadata fields are used to support Backend only operations. These operations are not trustless by nature.Hence, fields in here are never signed, and is never transmitted to the smart contract.


Name`Lite`
Type
Required`Default`
Description


client_order_id`co`
string
True
A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId


create_time`ct`
string
False`0`
[Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds


trigger`t`
TriggerOrderMetadata
False``
Trigger fields are used to support any type of trigger order such as TP/SL


broker`b`
BrokerTag
False``
Specifies the broker who brokered the order


[TriggerOrderMetadata](/../../schemas/trigger_order_metadata)
Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.


Name`Lite`
Type
Required`Default`
Description


trigger_type`tt`
TriggerType
True
Type of the trigger order. eg: Take Profit, Stop Loss, etc


tpsl`t`
TPSLOrderMetadata
True
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


[TriggerType](/../../schemas/trigger_type)
Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.


Value
Description


`UNSPECIFIED` = 0
Not a trigger order. The order executes normally without any trigger conditions.


`TAKE_PROFIT` = 1
Take Profit Order - Executes when the price reaches a specified level to secure profits.


`STOP_LOSS` = 2
Stop Loss Order - Executes when the price reaches a specified level to limit losses.


[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


Name`Lite`
Type
Required`Default`
Description


trigger_by`tb`
TriggerBy
True
Defines the price type (e.g., index price) that activates a Take Profit (TP) or Stop Loss (SL) order


trigger_price`tp`
string
True
The Trigger Price of the order, expressed in `9` decimals.


close_position`cp`
boolean
True
If True, the order will close the position when the trigger price is reached


is_split_position`is`
boolean
True
If True, the order will be treated as part of a position's split-TP/SL set, subject to aggregate size/count limits.


[TriggerBy](/../../schemas/trigger_by)
Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.


Value
Description


`UNSPECIFIED` = 0
no trigger condition


`INDEX` = 1
INDEX - Order is activated when the index price reaches the trigger price


`LAST` = 2
LAST - Order is activated when the last trade price reaches the trigger price


`MID` = 3
MID - Order is activated when the mid price reaches the trigger price


`MARK` = 4
MARK - Order is activated when the mark price reaches the trigger price


[BrokerTag](/../../schemas/broker_tag)
BrokerTag is a tag for the broker that the order is sent from.


Value
Description


`UNSPECIFIED` = 0


`COIN_ROUTES` = 1
CoinRoutes


`ALERTATRON` = 2
Alertatron


`ORIGAMI` = 3
Origami


[OrderState](/../../schemas/order_state)


Name`Lite`
Type
Required`Default`
Description


status`s`
OrderStatus
True
The status of the order


reject_reason`rr`
OrderRejectReason
True
The reason for rejection or cancellation


book_size`bs`
[string]
True
The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs


traded_size`ts`
[string]
True
The total number of assets traded. Sorted in same order as Order.Legs


update_time`ut`
string
True
Time at which the order was updated by GRVT, expressed in unix nanoseconds


avg_fill_price`af`
[string]
True
The average fill price of the order. Sorted in same order as Order.Legs


[OrderStatus](/../../schemas/order_status)


Value
Description


`PENDING` = 1
Order has been sent to the matching engine and is pending a transition to open/filled/rejected.


`OPEN` = 2
Order is actively matching on the matching engine, could be unfilled or partially filled.


`FILLED` = 3
Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.


`REJECTED` = 4
Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.


`CANCELLED` = 5
Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.


[OrderRejectReason](/../../schemas/order_reject_reason)


Value
Description


`UNSPECIFIED` = 0
order is not cancelled or rejected


`CLIENT_CANCEL` = 1
client called a Cancel API


`CLIENT_BULK_CANCEL` = 2
client called a Bulk Cancel API


`CLIENT_SESSION_END` = 3
client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate'


`MARKET_CANCEL` = 4
the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons


`IOC_CANCEL` = 5
the IOC order was cancelled after no/partial fill


`AON_CANCEL` = 6
the AON order was cancelled as it could not be fully matched


`FOK_CANCEL` = 7
the FOK order was cancelled as it could not be fully matched


`EXPIRED` = 8
the order was cancelled as it has expired


`FAIL_POST_ONLY` = 9
the post-only order could not be posted into the orderbook


`FAIL_REDUCE_ONLY` = 10
the reduce-only order would have caused position size to increase


`MM_PROTECTION` = 11
the order was cancelled due to market maker protection trigger


`SELF_TRADE_PROTECTION` = 12
the order was cancelled due to self-trade protection trigger


`SELF_MATCHED_SUBACCOUNT` = 13
the order matched with another order from the same sub account


`OVERLAPPING_CLIENT_ORDER_ID` = 14
an active order on your sub account shares the same clientOrderId


`BELOW_MARGIN` = 15
the order will bring the sub account below initial margin requirement


`LIQUIDATION` = 16
the sub account is liquidated (and all open orders are cancelled by Gravity)


`INSTRUMENT_INVALID` = 17
instrument is invalid or not found on Gravity


`INSTRUMENT_DEACTIVATED` = 18
instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry)


`SYSTEM_FAILOVER` = 19
system failover resulting in loss of order state


`UNAUTHORISED` = 20
the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action


`SESSION_KEY_EXPIRED` = 21
the session key used to sign the order expired


`SUB_ACCOUNT_NOT_FOUND` = 22
the subaccount does not exist


`NO_TRADE_PERMISSION` = 23
the signature used to sign the order has no trade permission


`UNSUPPORTED_TIME_IN_FORCE` = 24
the order payload does not contain a supported TimeInForce value


`MULTI_LEGGED_ORDER` = 25
the order has multiple legs, but multiple legs are not supported by this venue


`EXCEED_MAX_POSITION_SIZE` = 26
the order would have caused the subaccount to exceed the max position size


`EXCEED_MAX_SIGNATURE_EXPIRATION` = 27
the signature supplied is more than 30 days in the future


`MARKET_ORDER_WITH_LIMIT_PRICE` = 28
the market order has a limit price set


`CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29
client cancel on disconnect triggered


`OCO_COUNTER_PART_TRIGGERED` = 30
the OCO counter part order was triggered


`REDUCE_ONLY_LIMIT` = 31
the remaining order size was cancelled because it exceeded current position size


`CLIENT_REPLACE` = 32
the order was replaced by a client replace request


`DERISK_MUST_BE_IOC` = 33
the derisk order must be an IOC order


`DERISK_MUST_BE_REDUCE_ONLY` = 34
the derisk order must be a reduce-only order


`DERISK_NOT_SUPPORTED` = 35
derisk is not supported


`INVALID_ORDER_TYPE` = 36
the order type is invalid


`CURRENCY_NOT_DEFINED` = 37
the currency is not defined


`INVALID_CHAIN_ID` = 38
the chain ID is invalid


`BUILDER_ORDER_FEE_EXCEED` = 39
Builder fee exceed the limit


`BUILDER_ORDER_FEE_NEGATIVE` = 40
Builder fee is below 0


`BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41
Builder is not an authorized builder for client


`BUILDER_ORDER_BUILDER_NOT_EXIST` = 42
Builder does not exist


`TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44
the trade price is worse than the bankruptcy price


`TOO_MANY_MAKER_ORDERS` = 45
the order was cancelled due to matching with too many maker orders


`INSUFFICIENT_BALANCE` = 49
the subaccount has insufficient balance


`BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51
the order will bring the sub account below initial margin requirement considering wide price deviation


Query
Full Request
`{
    "order": {
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
        "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
        "builder_fee": "0.001"
    }
}`
Lite Request
`{
    "o": {
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
        "b": "'$GRVT_MAIN_ACCOUNT_ID'",
        "bf": "0.001"
    }
}`


[ApiCreateOrderResponse](/../../schemas/api_create_order_response)


Name`Lite`
Type
Required`Default`
Description


result`r`
Order
True
The created order


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
If True, Order must be a maker order. It has to fill the orderbook instead of match it.If False, Order can be either a maker or taker order. In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.****reduce_only`ro`
boolean
False`false`
If True, Order must reduce the position size, or be cancelled


legs`l`
[OrderLeg]
True
The legs present in this orderThe legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice


signature`s`
Signature
True
The signature approving this order


metadata`m`
OrderMetadata
True
Order Metadata, ignored by the smart contract, and unsigned by the client


state`s1`
OrderState
False`''`
[Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client


builder`b`
string
True
The main account ID of the builder


builder_fee`bf`
string
True
Builder fee charged for this order, expressed as a percentage (e.g., 0.001 means 0.001%).


[TimeInForce](/../../schemas/time_in_force)


Must Fill All
Can Fill Partial


Must Fill Immediately
FOK
IOC


Can Fill Till Time
AON
GTC


Value
Description


`GOOD_TILL_TIME` = 1
GTT - Remains open until it is cancelled, or expired


`ALL_OR_NONE` = 2
AON - Either fill the whole order or none of it (Block Trades Only)


`IMMEDIATE_OR_CANCEL` = 3
IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it


`FILL_OR_KILL` = 4
FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it


`RETAIL_PRICE_IMPROVEMENT` = 5
RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users.


[OrderLeg](/../../schemas/order_leg)


Name`Lite`
Type
Required`Default`
Description


instrument`i`
string
True
The instrument to trade in this leg


size`s`
string
True
The total number of assets to trade in this leg, expressed in base asset decimal units.


limit_price`lp`
string
False`0`
The limit price of the order leg, expressed in `9` decimals.This is the number of quote currency units to pay/receive for this leg.This should be `null/0` if the order is a market order


is_buying_asset`ib`
boolean
True
Specifies if the order leg is a buy or sell


[Signature](/../../schemas/signature)


Name`Lite`
Type
Required`Default`
Description


signer`s`
string
True
The address (public key) of the wallet signing the payload


r`r`
string
True
Signature R


s`s1`
string
True
Signature S


v`v`
integer
True
Signature V


expiration`e`
string
True
Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days


nonce`n`
integer
True
Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32)


chain_id`ci`
string
True
Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID.


[OrderMetadata](/../../schemas/order_metadata)
Metadata fields are used to support Backend only operations. These operations are not trustless by nature.Hence, fields in here are never signed, and is never transmitted to the smart contract.


Name`Lite`
Type
Required`Default`
Description


client_order_id`co`
string
True
A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId


create_time`ct`
string
False`0`
[Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds


trigger`t`
TriggerOrderMetadata
False``
Trigger fields are used to support any type of trigger order such as TP/SL


broker`b`
BrokerTag
False``
Specifies the broker who brokered the order


[TriggerOrderMetadata](/../../schemas/trigger_order_metadata)
Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.


Name`Lite`
Type
Required`Default`
Description


trigger_type`tt`
TriggerType
True
Type of the trigger order. eg: Take Profit, Stop Loss, etc


tpsl`t`
TPSLOrderMetadata
True
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


[TriggerType](/../../schemas/trigger_type)
Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.


Value
Description


`UNSPECIFIED` = 0
Not a trigger order. The order executes normally without any trigger conditions.


`TAKE_PROFIT` = 1
Take Profit Order - Executes when the price reaches a specified level to secure profits.


`STOP_LOSS` = 2
Stop Loss Order - Executes when the price reaches a specified level to limit losses.


[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


Name`Lite`
Type
Required`Default`
Description


trigger_by`tb`
TriggerBy
True
Defines the price type (e.g., index price) that activates a Take Profit (TP) or Stop Loss (SL) order


trigger_price`tp`
string
True
The Trigger Price of the order, expressed in `9` decimals.


close_position`cp`
boolean
True
If True, the order will close the position when the trigger price is reached


is_split_position`is`
boolean
True
If True, the order will be treated as part of a position's split-TP/SL set, subject to aggregate size/count limits.


[TriggerBy](/../../schemas/trigger_by)
Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.


Value
Description


`UNSPECIFIED` = 0
no trigger condition


`INDEX` = 1
INDEX - Order is activated when the index price reaches the trigger price


`LAST` = 2
LAST - Order is activated when the last trade price reaches the trigger price


`MID` = 3
MID - Order is activated when the mid price reaches the trigger price


`MARK` = 4
MARK - Order is activated when the mark price reaches the trigger price


[BrokerTag](/../../schemas/broker_tag)
BrokerTag is a tag for the broker that the order is sent from.


Value
Description


`UNSPECIFIED` = 0


`COIN_ROUTES` = 1
CoinRoutes


`ALERTATRON` = 2
Alertatron


`ORIGAMI` = 3
Origami


[OrderState](/../../schemas/order_state)


Name`Lite`
Type
Required`Default`
Description


status`s`
OrderStatus
True
The status of the order


reject_reason`rr`
OrderRejectReason
True
The reason for rejection or cancellation


book_size`bs`
[string]
True
The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs


traded_size`ts`
[string]
True
The total number of assets traded. Sorted in same order as Order.Legs


update_time`ut`
string
True
Time at which the order was updated by GRVT, expressed in unix nanoseconds


avg_fill_price`af`
[string]
True
The average fill price of the order. Sorted in same order as Order.Legs


[OrderStatus](/../../schemas/order_status)


Value
Description


`PENDING` = 1
Order has been sent to the matching engine and is pending a transition to open/filled/rejected.


`OPEN` = 2
Order is actively matching on the matching engine, could be unfilled or partially filled.


`FILLED` = 3
Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.


`REJECTED` = 4
Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.


`CANCELLED` = 5
Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.


[OrderRejectReason](/../../schemas/order_reject_reason)


Value
Description


`UNSPECIFIED` = 0
order is not cancelled or rejected


`CLIENT_CANCEL` = 1
client called a Cancel API


`CLIENT_BULK_CANCEL` = 2
client called a Bulk Cancel API


`CLIENT_SESSION_END` = 3
client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate'


`MARKET_CANCEL` = 4
the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons


`IOC_CANCEL` = 5
the IOC order was cancelled after no/partial fill


`AON_CANCEL` = 6
the AON order was cancelled as it could not be fully matched


`FOK_CANCEL` = 7
the FOK order was cancelled as it could not be fully matched


`EXPIRED` = 8
the order was cancelled as it has expired


`FAIL_POST_ONLY` = 9
the post-only order could not be posted into the orderbook


`FAIL_REDUCE_ONLY` = 10
the reduce-only order would have caused position size to increase


`MM_PROTECTION` = 11
the order was cancelled due to market maker protection trigger


`SELF_TRADE_PROTECTION` = 12
the order was cancelled due to self-trade protection trigger


`SELF_MATCHED_SUBACCOUNT` = 13
the order matched with another order from the same sub account


`OVERLAPPING_CLIENT_ORDER_ID` = 14
an active order on your sub account shares the same clientOrderId


`BELOW_MARGIN` = 15
the order will bring the sub account below initial margin requirement


`LIQUIDATION` = 16
the sub account is liquidated (and all open orders are cancelled by Gravity)


`INSTRUMENT_INVALID` = 17
instrument is invalid or not found on Gravity


`INSTRUMENT_DEACTIVATED` = 18
instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry)


`SYSTEM_FAILOVER` = 19
system failover resulting in loss of order state


`UNAUTHORISED` = 20
the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action


`SESSION_KEY_EXPIRED` = 21
the session key used to sign the order expired


`SUB_ACCOUNT_NOT_FOUND` = 22
the subaccount does not exist


`NO_TRADE_PERMISSION` = 23
the signature used to sign the order has no trade permission


`UNSUPPORTED_TIME_IN_FORCE` = 24
the order payload does not contain a supported TimeInForce value


`MULTI_LEGGED_ORDER` = 25
the order has multiple legs, but multiple legs are not supported by this venue


`EXCEED_MAX_POSITION_SIZE` = 26
the order would have caused the subaccount to exceed the max position size


`EXCEED_MAX_SIGNATURE_EXPIRATION` = 27
the signature supplied is more than 30 days in the future


`MARKET_ORDER_WITH_LIMIT_PRICE` = 28
the market order has a limit price set


`CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29
client cancel on disconnect triggered


`OCO_COUNTER_PART_TRIGGERED` = 30
the OCO counter part order was triggered


`REDUCE_ONLY_LIMIT` = 31
the remaining order size was cancelled because it exceeded current position size


`CLIENT_REPLACE` = 32
the order was replaced by a client replace request


`DERISK_MUST_BE_IOC` = 33
the derisk order must be an IOC order


`DERISK_MUST_BE_REDUCE_ONLY` = 34
the derisk order must be a reduce-only order


`DERISK_NOT_SUPPORTED` = 35
derisk is not supported


`INVALID_ORDER_TYPE` = 36
the order type is invalid


`CURRENCY_NOT_DEFINED` = 37
the currency is not defined


`INVALID_CHAIN_ID` = 38
the chain ID is invalid


`BUILDER_ORDER_FEE_EXCEED` = 39
Builder fee exceed the limit


`BUILDER_ORDER_FEE_NEGATIVE` = 40
Builder fee is below 0


`BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41
Builder is not an authorized builder for client


`BUILDER_ORDER_BUILDER_NOT_EXIST` = 42
Builder does not exist


`TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44
the trade price is worse than the bankruptcy price


`TOO_MANY_MAKER_ORDERS` = 45
the order was cancelled due to matching with too many maker orders


`INSUFFICIENT_BALANCE` = 49
the subaccount has insufficient balance


`BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51
the order will bring the sub account below initial margin requirement considering wide price deviation


Success
Full Response
`{
    "result": {
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
Lite Response
`{
    "r": {
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


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1004
404
Data Not Found


1005
500
Unknown Error


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


1400
403
Signer does not have trade permission


1009
503
We are temporarily deactivating this API endpoint, please try again later


1012
400
Invalid signature chain ID


2000
403
Signature is from an unauthorized signer


2001
403
Signature has expired


2002
403
Signature does not match payload


2003
403
Order sub account does not match logged in user


2004
403
Signature is from an expired session key


2006
403
Signature R/S must have exactly 64 characters long without 0x prefix


2005
403
Signature V must be 27/28


2007
403
Signature S must be in the lower half of the curve


2010
400
Order ID should be empty when creating an order


2011
400
Client Order ID should be supplied when creating an order


2012
400
Client Order ID overlaps with existing active order


2030
400
Orderbook Orders must have a TimeInForce of GTT/IOC/FOK


2031
400
RFQ Orders must have a TimeInForce of GTT/AON/IOC/FOK


2032
400
Post Only can only be set to true for GTT/AON orders


2020
400
Market Order must always be supplied without a limit price


2021
400
Limit Order must always be supplied with a limit price


2040
400
Order must contain at least one leg


2041
400
Order Legs must be sorted by Derivative.Instrument/Underlying/BaseCurrency/Expiration/StrikePrice


2042
400
Orderbook Orders must contain only one leg


2050
400
Order state must be empty upon creation


2051
400
Order execution metadata must be empty upon creation


2060
400
Order Legs contain one or more inactive derivative


2061
400
Unsupported Instrument Requested


2062
400
Order size smaller than min size


2063
400
Order size smaller than min block size in block trade venue


2064
400
Invalid limit price tick


2065
400
Order size too granular


2066
400
Order below minimum notional. Please try again with a higher price or size.


2067
400
Order below minimum notional. Please try reducing your position again with a higher price or size.


2070
400
Liquidation Order is not supported


2080
400
Insufficient margin to create order


2081
400
Order Fill would result in exceeding maximum position size


2082
400
Pre-order check failed


2084
400
Post-order check failed


2083
400
Order Fill would result in exceeding maximum position size under current configurable leverage tier


2090
429
Max open orders exceeded


2110
400
Invalid trigger by


2111
400
Unsupported trigger by


2112
400
Invalid trigger order


2113
400
Trigger price must be non-zero


2114
400
Invalid position linked TPSL orders, position linked TPSL must be a reduce-only order


2115
400
Invalid position linked TPSL orders, position linked TPSL must not have smaller size than the position


2116
400
Position linked TPSL order for this asset already exists


2117
400
Position linked TPSL orders must be created from web or mobile clients


2242
400
Split TPSL functionality not supported; you may be using a deprecated API, or this functionality is temporarily disabled


3004
500
Instrument does not have a valid maintenance margin configuration


3005
500
Instrument's underlying currency does not have a valid balance decimal configuration


3006
500
Instrument's quote currency does not have a valid balance decimal configuration


2400
400
Reduce only order with no position


2401
400
Reduce only order must not increase position size


2402
400
Reduce only order size exceeds maximum allowed value


7304
400
Only position-reducing orders (`reduce_only` as true) allowed for this asset right now.


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "order": {
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
        "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
        "builder_fee": "0.001"
    }
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/create_order",
    "params": {
        "order": {
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
            "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
            "builder_fee": "0.001"
        }
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "o": {
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
        "b": "'$GRVT_MAIN_ACCOUNT_ID'",
        "bf": "0.001"
    }
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/create_order",
    "p": {
        "o": {
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
            "b": "'$GRVT_MAIN_ACCOUNT_ID'",
            "bf": "0.001"
        }
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "order": {
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
        "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
        "builder_fee": "0.001"
    }
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/create_order",
    "params": {
        "order": {
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
            "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
            "builder_fee": "0.001"
        }
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "o": {
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
        "b": "'$GRVT_MAIN_ACCOUNT_ID'",
        "bf": "0.001"
    }
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/create_order",
    "p": {
        "o": {
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
            "b": "'$GRVT_MAIN_ACCOUNT_ID'",
            "bf": "0.001"
        }
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "order": {
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
        "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
        "builder_fee": "0.001"
    }
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/create_order",
    "params": {
        "order": {
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
            "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
            "builder_fee": "0.001"
        }
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "o": {
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
        "b": "'$GRVT_MAIN_ACCOUNT_ID'",
        "bf": "0.001"
    }
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/create_order",
    "p": {
        "o": {
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
            "b": "'$GRVT_MAIN_ACCOUNT_ID'",
            "bf": "0.001"
        }
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "order": {
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
        "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
        "builder_fee": "0.001"
    }
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/create_order",
    "params": {
        "order": {
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
            "builder": "'$GRVT_MAIN_ACCOUNT_ID'",
            "builder_fee": "0.001"
        }
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/create_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "o": {
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
        "b": "'$GRVT_MAIN_ACCOUNT_ID'",
        "bf": "0.001"
    }
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/create_order",
    "p": {
        "o": {
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
            "b": "'$GRVT_MAIN_ACCOUNT_ID'",
            "bf": "0.001"
        }
    },
    "i": 123
}
' -w 360`


### Cancel Order

`FULL ENDPOINT: full/v1/cancel_order
LITE ENDPOINT: lite/v1/cancel_order`
RequestResponseErrorsTry it out


[ApiCancelOrderRequest](/../../schemas/api_cancel_order_request)
Cancel an order on the orderbook for this trading account. Either `order_id` or `client_order_id` must be provided.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The subaccount ID cancelling the order


order_id`oi`
string
False`0`
Cancel the order with this `order_id`


client_order_id`co`
string
False`0`
Cancel the order with this `client_order_id`


time_to_live_ms`tt`
string
False`100`
Specifies the time-to-live (in milliseconds) for this cancellation.During this period, any order creation with a matching `client_order_id` will be cancelled and not be added to the GRVT matching engine.This mechanism helps mitigate time-of-flight issues where cancellations might arrive before the corresponding orders.Hence, cancellation by `order_id` ignores this field as the exchange can only assign `order_id`s to already-processed order creations.The duration cannot be negative, is rounded down to the nearest 100ms (e.g., `'670'` -> `'600'`, `'30'` -> `'0'`) and capped at 5 seconds (i.e., `'5000'`).Value of `'0'` or omission results in the default time-to-live value being applied.If the caller requests multiple successive cancellations for a given order, such that the time-to-live windows overlap, only the first request will be considered.


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042",
    "time_to_live_ms": "500"
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042",
    "tt": "500"
}`


[AckResponse](/../../schemas/ack_response)
Used to acknowledge a request has been received and will be processed


Name`Lite`
Type
Required`Default`
Description


result`r`
Ack
True
The Ack Object


[Ack](/../../schemas/ack)


Name`Lite`
Type
Required`Default`
Description


ack`a`
boolean
True
Gravity has acknowledged that the request has been successfully received and it will process it in the backend


Success
Full Response
`{
    "result": {
        "ack": "true"
    }
}`
Lite Response
`{
    "r": {
        "a": "true"
    }
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


2300
400
Order cancel time-to-live settings currently disabled.


2301
400
Order cancel time-to-live exceeds maximum allowed value.


3021
400
Either order ID or client order ID must be supplied


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042",
    "time_to_live_ms": "500"
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042",
        "time_to_live_ms": "500"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042",
    "tt": "500"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042",
        "tt": "500"
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042",
    "time_to_live_ms": "500"
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042",
        "time_to_live_ms": "500"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042",
    "tt": "500"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042",
        "tt": "500"
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042",
    "time_to_live_ms": "500"
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042",
        "time_to_live_ms": "500"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042",
    "tt": "500"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042",
        "tt": "500"
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042",
    "time_to_live_ms": "500"
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042",
        "time_to_live_ms": "500"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/cancel_order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042",
    "tt": "500"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042",
        "tt": "500"
    },
    "i": 123
}
' -w 360`


### Cancel All Orders

`FULL ENDPOINT: full/v1/cancel_all_orders
LITE ENDPOINT: lite/v1/cancel_all_orders`
RequestResponseErrorsTry it out


[ApiCancelAllOrdersRequest](/../../schemas/api_cancel_all_orders_request)
Cancel all orders on the orderbook for this trading account. This may not match new orders in flight.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The subaccount ID cancelling all orders


kind`k`
[Kind]
False`all`
The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be cancelled


base`b`
[string]
False`all`
The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be cancelled


quote`q`
[string]
False`all`
The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be cancelled


[Kind](/../../schemas/kind)
The list of asset kinds that are supported on the GRVT exchange


Value
Description


`PERPETUAL` = 1
the perpetual asset kind


`FUTURE` = 2
the future asset kind


`CALL` = 3
the call option asset kind


`PUT` = 4
the put option asset kind


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}`


[AckResponse](/../../schemas/ack_response)
Used to acknowledge a request has been received and will be processed


Name`Lite`
Type
Required`Default`
Description


result`r`
Ack
True
The Ack Object


[Ack](/../../schemas/ack)


Name`Lite`
Type
Required`Default`
Description


ack`a`
boolean
True
Gravity has acknowledged that the request has been successfully received and it will process it in the backend


Success
Full Response
`{
    "result": {
        "ack": "true"
    }
}`
Lite Response
`{
    "r": {
        "a": "true"
    }
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_all_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_all_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_all_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_all_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_all_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_all_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_all_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/cancel_all_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_all_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


### Get Order

`FULL ENDPOINT: full/v1/order
LITE ENDPOINT: lite/v1/order`
RequestResponseErrorsTry it out


[ApiGetOrderRequest](/../../schemas/api_get_order_request)
Retrieve the order for the account. Either `order_id` or `client_order_id` must be provided.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The subaccount ID to filter by


order_id`oi`
string
False`0`
Filter for `order_id`


client_order_id`co`
string
False`0`
Filter for `client_order_id`


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042"
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042"
}`


[ApiGetOrderResponse](/../../schemas/api_get_order_response)


Name`Lite`
Type
Required`Default`
Description


result`r`
Order
True
The order object for the requested filter


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
If True, Order must be a maker order. It has to fill the orderbook instead of match it.If False, Order can be either a maker or taker order. In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.****reduce_only`ro`
boolean
False`false`
If True, Order must reduce the position size, or be cancelled


legs`l`
[OrderLeg]
True
The legs present in this orderThe legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice


signature`s`
Signature
True
The signature approving this order


metadata`m`
OrderMetadata
True
Order Metadata, ignored by the smart contract, and unsigned by the client


state`s1`
OrderState
False`''`
[Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client


builder`b`
string
True
The main account ID of the builder


builder_fee`bf`
string
True
Builder fee charged for this order, expressed as a percentage (e.g., 0.001 means 0.001%).


[TimeInForce](/../../schemas/time_in_force)


Must Fill All
Can Fill Partial


Must Fill Immediately
FOK
IOC


Can Fill Till Time
AON
GTC


Value
Description


`GOOD_TILL_TIME` = 1
GTT - Remains open until it is cancelled, or expired


`ALL_OR_NONE` = 2
AON - Either fill the whole order or none of it (Block Trades Only)


`IMMEDIATE_OR_CANCEL` = 3
IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it


`FILL_OR_KILL` = 4
FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it


`RETAIL_PRICE_IMPROVEMENT` = 5
RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users.


[OrderLeg](/../../schemas/order_leg)


Name`Lite`
Type
Required`Default`
Description


instrument`i`
string
True
The instrument to trade in this leg


size`s`
string
True
The total number of assets to trade in this leg, expressed in base asset decimal units.


limit_price`lp`
string
False`0`
The limit price of the order leg, expressed in `9` decimals.This is the number of quote currency units to pay/receive for this leg.This should be `null/0` if the order is a market order


is_buying_asset`ib`
boolean
True
Specifies if the order leg is a buy or sell


[Signature](/../../schemas/signature)


Name`Lite`
Type
Required`Default`
Description


signer`s`
string
True
The address (public key) of the wallet signing the payload


r`r`
string
True
Signature R


s`s1`
string
True
Signature S


v`v`
integer
True
Signature V


expiration`e`
string
True
Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days


nonce`n`
integer
True
Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32)


chain_id`ci`
string
True
Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID.


[OrderMetadata](/../../schemas/order_metadata)
Metadata fields are used to support Backend only operations. These operations are not trustless by nature.Hence, fields in here are never signed, and is never transmitted to the smart contract.


Name`Lite`
Type
Required`Default`
Description


client_order_id`co`
string
True
A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId


create_time`ct`
string
False`0`
[Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds


trigger`t`
TriggerOrderMetadata
False``
Trigger fields are used to support any type of trigger order such as TP/SL


broker`b`
BrokerTag
False``
Specifies the broker who brokered the order


[TriggerOrderMetadata](/../../schemas/trigger_order_metadata)
Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.


Name`Lite`
Type
Required`Default`
Description


trigger_type`tt`
TriggerType
True
Type of the trigger order. eg: Take Profit, Stop Loss, etc


tpsl`t`
TPSLOrderMetadata
True
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


[TriggerType](/../../schemas/trigger_type)
Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.


Value
Description


`UNSPECIFIED` = 0
Not a trigger order. The order executes normally without any trigger conditions.


`TAKE_PROFIT` = 1
Take Profit Order - Executes when the price reaches a specified level to secure profits.


`STOP_LOSS` = 2
Stop Loss Order - Executes when the price reaches a specified level to limit losses.


[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


Name`Lite`
Type
Required`Default`
Description


trigger_by`tb`
TriggerBy
True
Defines the price type (e.g., index price) that activates a Take Profit (TP) or Stop Loss (SL) order


trigger_price`tp`
string
True
The Trigger Price of the order, expressed in `9` decimals.


close_position`cp`
boolean
True
If True, the order will close the position when the trigger price is reached


is_split_position`is`
boolean
True
If True, the order will be treated as part of a position's split-TP/SL set, subject to aggregate size/count limits.


[TriggerBy](/../../schemas/trigger_by)
Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.


Value
Description


`UNSPECIFIED` = 0
no trigger condition


`INDEX` = 1
INDEX - Order is activated when the index price reaches the trigger price


`LAST` = 2
LAST - Order is activated when the last trade price reaches the trigger price


`MID` = 3
MID - Order is activated when the mid price reaches the trigger price


`MARK` = 4
MARK - Order is activated when the mark price reaches the trigger price


[BrokerTag](/../../schemas/broker_tag)
BrokerTag is a tag for the broker that the order is sent from.


Value
Description


`UNSPECIFIED` = 0


`COIN_ROUTES` = 1
CoinRoutes


`ALERTATRON` = 2
Alertatron


`ORIGAMI` = 3
Origami


[OrderState](/../../schemas/order_state)


Name`Lite`
Type
Required`Default`
Description


status`s`
OrderStatus
True
The status of the order


reject_reason`rr`
OrderRejectReason
True
The reason for rejection or cancellation


book_size`bs`
[string]
True
The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs


traded_size`ts`
[string]
True
The total number of assets traded. Sorted in same order as Order.Legs


update_time`ut`
string
True
Time at which the order was updated by GRVT, expressed in unix nanoseconds


avg_fill_price`af`
[string]
True
The average fill price of the order. Sorted in same order as Order.Legs


[OrderStatus](/../../schemas/order_status)


Value
Description


`PENDING` = 1
Order has been sent to the matching engine and is pending a transition to open/filled/rejected.


`OPEN` = 2
Order is actively matching on the matching engine, could be unfilled or partially filled.


`FILLED` = 3
Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.


`REJECTED` = 4
Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.


`CANCELLED` = 5
Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.


[OrderRejectReason](/../../schemas/order_reject_reason)


Value
Description


`UNSPECIFIED` = 0
order is not cancelled or rejected


`CLIENT_CANCEL` = 1
client called a Cancel API


`CLIENT_BULK_CANCEL` = 2
client called a Bulk Cancel API


`CLIENT_SESSION_END` = 3
client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate'


`MARKET_CANCEL` = 4
the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons


`IOC_CANCEL` = 5
the IOC order was cancelled after no/partial fill


`AON_CANCEL` = 6
the AON order was cancelled as it could not be fully matched


`FOK_CANCEL` = 7
the FOK order was cancelled as it could not be fully matched


`EXPIRED` = 8
the order was cancelled as it has expired


`FAIL_POST_ONLY` = 9
the post-only order could not be posted into the orderbook


`FAIL_REDUCE_ONLY` = 10
the reduce-only order would have caused position size to increase


`MM_PROTECTION` = 11
the order was cancelled due to market maker protection trigger


`SELF_TRADE_PROTECTION` = 12
the order was cancelled due to self-trade protection trigger


`SELF_MATCHED_SUBACCOUNT` = 13
the order matched with another order from the same sub account


`OVERLAPPING_CLIENT_ORDER_ID` = 14
an active order on your sub account shares the same clientOrderId


`BELOW_MARGIN` = 15
the order will bring the sub account below initial margin requirement


`LIQUIDATION` = 16
the sub account is liquidated (and all open orders are cancelled by Gravity)


`INSTRUMENT_INVALID` = 17
instrument is invalid or not found on Gravity


`INSTRUMENT_DEACTIVATED` = 18
instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry)


`SYSTEM_FAILOVER` = 19
system failover resulting in loss of order state


`UNAUTHORISED` = 20
the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action


`SESSION_KEY_EXPIRED` = 21
the session key used to sign the order expired


`SUB_ACCOUNT_NOT_FOUND` = 22
the subaccount does not exist


`NO_TRADE_PERMISSION` = 23
the signature used to sign the order has no trade permission


`UNSUPPORTED_TIME_IN_FORCE` = 24
the order payload does not contain a supported TimeInForce value


`MULTI_LEGGED_ORDER` = 25
the order has multiple legs, but multiple legs are not supported by this venue


`EXCEED_MAX_POSITION_SIZE` = 26
the order would have caused the subaccount to exceed the max position size


`EXCEED_MAX_SIGNATURE_EXPIRATION` = 27
the signature supplied is more than 30 days in the future


`MARKET_ORDER_WITH_LIMIT_PRICE` = 28
the market order has a limit price set


`CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29
client cancel on disconnect triggered


`OCO_COUNTER_PART_TRIGGERED` = 30
the OCO counter part order was triggered


`REDUCE_ONLY_LIMIT` = 31
the remaining order size was cancelled because it exceeded current position size


`CLIENT_REPLACE` = 32
the order was replaced by a client replace request


`DERISK_MUST_BE_IOC` = 33
the derisk order must be an IOC order


`DERISK_MUST_BE_REDUCE_ONLY` = 34
the derisk order must be a reduce-only order


`DERISK_NOT_SUPPORTED` = 35
derisk is not supported


`INVALID_ORDER_TYPE` = 36
the order type is invalid


`CURRENCY_NOT_DEFINED` = 37
the currency is not defined


`INVALID_CHAIN_ID` = 38
the chain ID is invalid


`BUILDER_ORDER_FEE_EXCEED` = 39
Builder fee exceed the limit


`BUILDER_ORDER_FEE_NEGATIVE` = 40
Builder fee is below 0


`BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41
Builder is not an authorized builder for client


`BUILDER_ORDER_BUILDER_NOT_EXIST` = 42
Builder does not exist


`TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44
the trade price is worse than the bankruptcy price


`TOO_MANY_MAKER_ORDERS` = 45
the order was cancelled due to matching with too many maker orders


`INSUFFICIENT_BALANCE` = 49
the subaccount has insufficient balance


`BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51
the order will bring the sub account below initial margin requirement considering wide price deviation


Success
Full Response
`{
    "result": {
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
Lite Response
`{
    "r": {
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


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


1004
404
Data Not Found


3021
400
Either order ID or client order ID must be supplied


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042"
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042"
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042"
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042"
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042"
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042"
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "order_id": "0x1028403",
    "client_order_id": "23042"
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "order_id": "0x1028403",
        "client_order_id": "23042"
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/order' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "oi": "0x1028403",
    "co": "23042"
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "oi": "0x1028403",
        "co": "23042"
    },
    "i": 123
}
' -w 360`


### Open Orders

`FULL ENDPOINT: full/v1/open_orders
LITE ENDPOINT: lite/v1/open_orders`
RequestResponseErrorsTry it out


[ApiOpenOrdersRequest](/../../schemas/api_open_orders_request)


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The subaccount ID to filter by


kind`k`
[Kind]
False`all`
The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned


base`b`
[string]
False`all`
The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned


quote`q`
[string]
False`all`
The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned


[Kind](/../../schemas/kind)
The list of asset kinds that are supported on the GRVT exchange


Value
Description


`PERPETUAL` = 1
the perpetual asset kind


`FUTURE` = 2
the future asset kind


`CALL` = 3
the call option asset kind


`PUT` = 4
the put option asset kind


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}`


[ApiOpenOrdersResponse](/../../schemas/api_open_orders_response)
Retrieves all open orders for the account. This may not match new orders in flight.


Name`Lite`
Type
Required`Default`
Description


result`r`
[Order]
True
The Open Orders matching the request filter


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
If True, Order must be a maker order. It has to fill the orderbook instead of match it.If False, Order can be either a maker or taker order. In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.****reduce_only`ro`
boolean
False`false`
If True, Order must reduce the position size, or be cancelled


legs`l`
[OrderLeg]
True
The legs present in this orderThe legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice


signature`s`
Signature
True
The signature approving this order


metadata`m`
OrderMetadata
True
Order Metadata, ignored by the smart contract, and unsigned by the client


state`s1`
OrderState
False`''`
[Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client


builder`b`
string
True
The main account ID of the builder


builder_fee`bf`
string
True
Builder fee charged for this order, expressed as a percentage (e.g., 0.001 means 0.001%).


[TimeInForce](/../../schemas/time_in_force)


Must Fill All
Can Fill Partial


Must Fill Immediately
FOK
IOC


Can Fill Till Time
AON
GTC


Value
Description


`GOOD_TILL_TIME` = 1
GTT - Remains open until it is cancelled, or expired


`ALL_OR_NONE` = 2
AON - Either fill the whole order or none of it (Block Trades Only)


`IMMEDIATE_OR_CANCEL` = 3
IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it


`FILL_OR_KILL` = 4
FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it


`RETAIL_PRICE_IMPROVEMENT` = 5
RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users.


[OrderLeg](/../../schemas/order_leg)


Name`Lite`
Type
Required`Default`
Description


instrument`i`
string
True
The instrument to trade in this leg


size`s`
string
True
The total number of assets to trade in this leg, expressed in base asset decimal units.


limit_price`lp`
string
False`0`
The limit price of the order leg, expressed in `9` decimals.This is the number of quote currency units to pay/receive for this leg.This should be `null/0` if the order is a market order


is_buying_asset`ib`
boolean
True
Specifies if the order leg is a buy or sell


[Signature](/../../schemas/signature)


Name`Lite`
Type
Required`Default`
Description


signer`s`
string
True
The address (public key) of the wallet signing the payload


r`r`
string
True
Signature R


s`s1`
string
True
Signature S


v`v`
integer
True
Signature V


expiration`e`
string
True
Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days


nonce`n`
integer
True
Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32)


chain_id`ci`
string
True
Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID.


[OrderMetadata](/../../schemas/order_metadata)
Metadata fields are used to support Backend only operations. These operations are not trustless by nature.Hence, fields in here are never signed, and is never transmitted to the smart contract.


Name`Lite`
Type
Required`Default`
Description


client_order_id`co`
string
True
A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId


create_time`ct`
string
False`0`
[Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds


trigger`t`
TriggerOrderMetadata
False``
Trigger fields are used to support any type of trigger order such as TP/SL


broker`b`
BrokerTag
False``
Specifies the broker who brokered the order


[TriggerOrderMetadata](/../../schemas/trigger_order_metadata)
Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.


Name`Lite`
Type
Required`Default`
Description


trigger_type`tt`
TriggerType
True
Type of the trigger order. eg: Take Profit, Stop Loss, etc


tpsl`t`
TPSLOrderMetadata
True
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


[TriggerType](/../../schemas/trigger_type)
Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.


Value
Description


`UNSPECIFIED` = 0
Not a trigger order. The order executes normally without any trigger conditions.


`TAKE_PROFIT` = 1
Take Profit Order - Executes when the price reaches a specified level to secure profits.


`STOP_LOSS` = 2
Stop Loss Order - Executes when the price reaches a specified level to limit losses.


[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


Name`Lite`
Type
Required`Default`
Description


trigger_by`tb`
TriggerBy
True
Defines the price type (e.g., index price) that activates a Take Profit (TP) or Stop Loss (SL) order


trigger_price`tp`
string
True
The Trigger Price of the order, expressed in `9` decimals.


close_position`cp`
boolean
True
If True, the order will close the position when the trigger price is reached


is_split_position`is`
boolean
True
If True, the order will be treated as part of a position's split-TP/SL set, subject to aggregate size/count limits.


[TriggerBy](/../../schemas/trigger_by)
Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.


Value
Description


`UNSPECIFIED` = 0
no trigger condition


`INDEX` = 1
INDEX - Order is activated when the index price reaches the trigger price


`LAST` = 2
LAST - Order is activated when the last trade price reaches the trigger price


`MID` = 3
MID - Order is activated when the mid price reaches the trigger price


`MARK` = 4
MARK - Order is activated when the mark price reaches the trigger price


[BrokerTag](/../../schemas/broker_tag)
BrokerTag is a tag for the broker that the order is sent from.


Value
Description


`UNSPECIFIED` = 0


`COIN_ROUTES` = 1
CoinRoutes


`ALERTATRON` = 2
Alertatron


`ORIGAMI` = 3
Origami


[OrderState](/../../schemas/order_state)


Name`Lite`
Type
Required`Default`
Description


status`s`
OrderStatus
True
The status of the order


reject_reason`rr`
OrderRejectReason
True
The reason for rejection or cancellation


book_size`bs`
[string]
True
The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs


traded_size`ts`
[string]
True
The total number of assets traded. Sorted in same order as Order.Legs


update_time`ut`
string
True
Time at which the order was updated by GRVT, expressed in unix nanoseconds


avg_fill_price`af`
[string]
True
The average fill price of the order. Sorted in same order as Order.Legs


[OrderStatus](/../../schemas/order_status)


Value
Description


`PENDING` = 1
Order has been sent to the matching engine and is pending a transition to open/filled/rejected.


`OPEN` = 2
Order is actively matching on the matching engine, could be unfilled or partially filled.


`FILLED` = 3
Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.


`REJECTED` = 4
Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.


`CANCELLED` = 5
Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.


[OrderRejectReason](/../../schemas/order_reject_reason)


Value
Description


`UNSPECIFIED` = 0
order is not cancelled or rejected


`CLIENT_CANCEL` = 1
client called a Cancel API


`CLIENT_BULK_CANCEL` = 2
client called a Bulk Cancel API


`CLIENT_SESSION_END` = 3
client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate'


`MARKET_CANCEL` = 4
the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons


`IOC_CANCEL` = 5
the IOC order was cancelled after no/partial fill


`AON_CANCEL` = 6
the AON order was cancelled as it could not be fully matched


`FOK_CANCEL` = 7
the FOK order was cancelled as it could not be fully matched


`EXPIRED` = 8
the order was cancelled as it has expired


`FAIL_POST_ONLY` = 9
the post-only order could not be posted into the orderbook


`FAIL_REDUCE_ONLY` = 10
the reduce-only order would have caused position size to increase


`MM_PROTECTION` = 11
the order was cancelled due to market maker protection trigger


`SELF_TRADE_PROTECTION` = 12
the order was cancelled due to self-trade protection trigger


`SELF_MATCHED_SUBACCOUNT` = 13
the order matched with another order from the same sub account


`OVERLAPPING_CLIENT_ORDER_ID` = 14
an active order on your sub account shares the same clientOrderId


`BELOW_MARGIN` = 15
the order will bring the sub account below initial margin requirement


`LIQUIDATION` = 16
the sub account is liquidated (and all open orders are cancelled by Gravity)


`INSTRUMENT_INVALID` = 17
instrument is invalid or not found on Gravity


`INSTRUMENT_DEACTIVATED` = 18
instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry)


`SYSTEM_FAILOVER` = 19
system failover resulting in loss of order state


`UNAUTHORISED` = 20
the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action


`SESSION_KEY_EXPIRED` = 21
the session key used to sign the order expired


`SUB_ACCOUNT_NOT_FOUND` = 22
the subaccount does not exist


`NO_TRADE_PERMISSION` = 23
the signature used to sign the order has no trade permission


`UNSUPPORTED_TIME_IN_FORCE` = 24
the order payload does not contain a supported TimeInForce value


`MULTI_LEGGED_ORDER` = 25
the order has multiple legs, but multiple legs are not supported by this venue


`EXCEED_MAX_POSITION_SIZE` = 26
the order would have caused the subaccount to exceed the max position size


`EXCEED_MAX_SIGNATURE_EXPIRATION` = 27
the signature supplied is more than 30 days in the future


`MARKET_ORDER_WITH_LIMIT_PRICE` = 28
the market order has a limit price set


`CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29
client cancel on disconnect triggered


`OCO_COUNTER_PART_TRIGGERED` = 30
the OCO counter part order was triggered


`REDUCE_ONLY_LIMIT` = 31
the remaining order size was cancelled because it exceeded current position size


`CLIENT_REPLACE` = 32
the order was replaced by a client replace request


`DERISK_MUST_BE_IOC` = 33
the derisk order must be an IOC order


`DERISK_MUST_BE_REDUCE_ONLY` = 34
the derisk order must be a reduce-only order


`DERISK_NOT_SUPPORTED` = 35
derisk is not supported


`INVALID_ORDER_TYPE` = 36
the order type is invalid


`CURRENCY_NOT_DEFINED` = 37
the currency is not defined


`INVALID_CHAIN_ID` = 38
the chain ID is invalid


`BUILDER_ORDER_FEE_EXCEED` = 39
Builder fee exceed the limit


`BUILDER_ORDER_FEE_NEGATIVE` = 40
Builder fee is below 0


`BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41
Builder is not an authorized builder for client


`BUILDER_ORDER_BUILDER_NOT_EXIST` = 42
Builder does not exist


`TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44
the trade price is worse than the bankruptcy price


`TOO_MANY_MAKER_ORDERS` = 45
the order was cancelled due to matching with too many maker orders


`INSUFFICIENT_BALANCE` = 49
the subaccount has insufficient balance


`BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51
the order will bring the sub account below initial margin requirement considering wide price deviation


Success
Full Response
`{
    "result": [{
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
    }]
}`
Lite Response
`{
    "r": [{
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
    }]
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


1003
400
Request could not be processed due to malformed syntax


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/open_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/open_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/open_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/open_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/open_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/open_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/open_orders",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/open_orders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/open_orders",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


### Order History

`FULL ENDPOINT: full/v1/order_history
LITE ENDPOINT: lite/v1/order_history`
RequestResponseErrorsTry it out


[ApiOrderHistoryRequest](/../../schemas/api_order_history_request)
Retrieves the order history for the account.Pagination works as follows:We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.If a `cursor` is provided, it will be used to fetch results from that point onwards.Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The subaccount ID to filter by


kind`k`
[Kind]
False`all`
The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned


base`b`
[string]
False`all`
The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned


quote`q`
[string]
False`all`
The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned


start_time`st`
string
False`0`
The start time to apply in nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned


end_time`et`
string
False`now()`
The end time to apply in nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned


limit`l`
integer
False`500`
The limit to query for. Defaults to 500; Max 1000


cursor`c`
string
False`''`
The cursor to indicate when to start the query from


[Kind](/../../schemas/kind)
The list of asset kinds that are supported on the GRVT exchange


Value
Description


`PERPETUAL` = 1
the perpetual asset kind


`FUTURE` = 2
the future asset kind


`CALL` = 3
the call option asset kind


`PUT` = 4
the put option asset kind


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}`


[ApiOrderHistoryResponse](/../../schemas/api_order_history_response)


Name`Lite`
Type
Required`Default`
Description


result`r`
[Order]
True
The Open Orders matching the request filter


next`n`
string
True
The cursor to indicate when to start the query from


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
If True, Order must be a maker order. It has to fill the orderbook instead of match it.If False, Order can be either a maker or taker order. In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.****reduce_only`ro`
boolean
False`false`
If True, Order must reduce the position size, or be cancelled


legs`l`
[OrderLeg]
True
The legs present in this orderThe legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice


signature`s`
Signature
True
The signature approving this order


metadata`m`
OrderMetadata
True
Order Metadata, ignored by the smart contract, and unsigned by the client


state`s1`
OrderState
False`''`
[Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client


builder`b`
string
True
The main account ID of the builder


builder_fee`bf`
string
True
Builder fee charged for this order, expressed as a percentage (e.g., 0.001 means 0.001%).


[TimeInForce](/../../schemas/time_in_force)


Must Fill All
Can Fill Partial


Must Fill Immediately
FOK
IOC


Can Fill Till Time
AON
GTC


Value
Description


`GOOD_TILL_TIME` = 1
GTT - Remains open until it is cancelled, or expired


`ALL_OR_NONE` = 2
AON - Either fill the whole order or none of it (Block Trades Only)


`IMMEDIATE_OR_CANCEL` = 3
IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it


`FILL_OR_KILL` = 4
FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it


`RETAIL_PRICE_IMPROVEMENT` = 5
RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users.


[OrderLeg](/../../schemas/order_leg)


Name`Lite`
Type
Required`Default`
Description


instrument`i`
string
True
The instrument to trade in this leg


size`s`
string
True
The total number of assets to trade in this leg, expressed in base asset decimal units.


limit_price`lp`
string
False`0`
The limit price of the order leg, expressed in `9` decimals.This is the number of quote currency units to pay/receive for this leg.This should be `null/0` if the order is a market order


is_buying_asset`ib`
boolean
True
Specifies if the order leg is a buy or sell


[Signature](/../../schemas/signature)


Name`Lite`
Type
Required`Default`
Description


signer`s`
string
True
The address (public key) of the wallet signing the payload


r`r`
string
True
Signature R


s`s1`
string
True
Signature S


v`v`
integer
True
Signature V


expiration`e`
string
True
Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days


nonce`n`
integer
True
Users can randomly generate this value, used as a signature deconflicting key.ie. You can send the same exact instruction twice with different nonces.When the same nonce is used, the same payload will generate the same signature.Our system will consider the payload a duplicate, and ignore it.Range: 0 to 4,294,967,295 (uint32)


chain_id`ci`
string
True
Chain ID used in EIP-712 domain. Zero value fallbacks to GRVT Chain ID.


[OrderMetadata](/../../schemas/order_metadata)
Metadata fields are used to support Backend only operations. These operations are not trustless by nature.Hence, fields in here are never signed, and is never transmitted to the smart contract.


Name`Lite`
Type
Required`Default`
Description


client_order_id`co`
string
True
A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId


create_time`ct`
string
False`0`
[Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds


trigger`t`
TriggerOrderMetadata
False``
Trigger fields are used to support any type of trigger order such as TP/SL


broker`b`
BrokerTag
False``
Specifies the broker who brokered the order


[TriggerOrderMetadata](/../../schemas/trigger_order_metadata)
Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.


Name`Lite`
Type
Required`Default`
Description


trigger_type`tt`
TriggerType
True
Type of the trigger order. eg: Take Profit, Stop Loss, etc


tpsl`t`
TPSLOrderMetadata
True
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


[TriggerType](/../../schemas/trigger_type)
Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.


Value
Description


`UNSPECIFIED` = 0
Not a trigger order. The order executes normally without any trigger conditions.


`TAKE_PROFIT` = 1
Take Profit Order - Executes when the price reaches a specified level to secure profits.


`STOP_LOSS` = 2
Stop Loss Order - Executes when the price reaches a specified level to limit losses.


[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)
Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


Name`Lite`
Type
Required`Default`
Description


trigger_by`tb`
TriggerBy
True
Defines the price type (e.g., index price) that activates a Take Profit (TP) or Stop Loss (SL) order


trigger_price`tp`
string
True
The Trigger Price of the order, expressed in `9` decimals.


close_position`cp`
boolean
True
If True, the order will close the position when the trigger price is reached


is_split_position`is`
boolean
True
If True, the order will be treated as part of a position's split-TP/SL set, subject to aggregate size/count limits.


[TriggerBy](/../../schemas/trigger_by)
Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.


Value
Description


`UNSPECIFIED` = 0
no trigger condition


`INDEX` = 1
INDEX - Order is activated when the index price reaches the trigger price


`LAST` = 2
LAST - Order is activated when the last trade price reaches the trigger price


`MID` = 3
MID - Order is activated when the mid price reaches the trigger price


`MARK` = 4
MARK - Order is activated when the mark price reaches the trigger price


[BrokerTag](/../../schemas/broker_tag)
BrokerTag is a tag for the broker that the order is sent from.


Value
Description


`UNSPECIFIED` = 0


`COIN_ROUTES` = 1
CoinRoutes


`ALERTATRON` = 2
Alertatron


`ORIGAMI` = 3
Origami


[OrderState](/../../schemas/order_state)


Name`Lite`
Type
Required`Default`
Description


status`s`
OrderStatus
True
The status of the order


reject_reason`rr`
OrderRejectReason
True
The reason for rejection or cancellation


book_size`bs`
[string]
True
The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs


traded_size`ts`
[string]
True
The total number of assets traded. Sorted in same order as Order.Legs


update_time`ut`
string
True
Time at which the order was updated by GRVT, expressed in unix nanoseconds


avg_fill_price`af`
[string]
True
The average fill price of the order. Sorted in same order as Order.Legs


[OrderStatus](/../../schemas/order_status)


Value
Description


`PENDING` = 1
Order has been sent to the matching engine and is pending a transition to open/filled/rejected.


`OPEN` = 2
Order is actively matching on the matching engine, could be unfilled or partially filled.


`FILLED` = 3
Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.


`REJECTED` = 4
Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.


`CANCELLED` = 5
Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.


[OrderRejectReason](/../../schemas/order_reject_reason)


Value
Description


`UNSPECIFIED` = 0
order is not cancelled or rejected


`CLIENT_CANCEL` = 1
client called a Cancel API


`CLIENT_BULK_CANCEL` = 2
client called a Bulk Cancel API


`CLIENT_SESSION_END` = 3
client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate'


`MARKET_CANCEL` = 4
the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons


`IOC_CANCEL` = 5
the IOC order was cancelled after no/partial fill


`AON_CANCEL` = 6
the AON order was cancelled as it could not be fully matched


`FOK_CANCEL` = 7
the FOK order was cancelled as it could not be fully matched


`EXPIRED` = 8
the order was cancelled as it has expired


`FAIL_POST_ONLY` = 9
the post-only order could not be posted into the orderbook


`FAIL_REDUCE_ONLY` = 10
the reduce-only order would have caused position size to increase


`MM_PROTECTION` = 11
the order was cancelled due to market maker protection trigger


`SELF_TRADE_PROTECTION` = 12
the order was cancelled due to self-trade protection trigger


`SELF_MATCHED_SUBACCOUNT` = 13
the order matched with another order from the same sub account


`OVERLAPPING_CLIENT_ORDER_ID` = 14
an active order on your sub account shares the same clientOrderId


`BELOW_MARGIN` = 15
the order will bring the sub account below initial margin requirement


`LIQUIDATION` = 16
the sub account is liquidated (and all open orders are cancelled by Gravity)


`INSTRUMENT_INVALID` = 17
instrument is invalid or not found on Gravity


`INSTRUMENT_DEACTIVATED` = 18
instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry)


`SYSTEM_FAILOVER` = 19
system failover resulting in loss of order state


`UNAUTHORISED` = 20
the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action


`SESSION_KEY_EXPIRED` = 21
the session key used to sign the order expired


`SUB_ACCOUNT_NOT_FOUND` = 22
the subaccount does not exist


`NO_TRADE_PERMISSION` = 23
the signature used to sign the order has no trade permission


`UNSUPPORTED_TIME_IN_FORCE` = 24
the order payload does not contain a supported TimeInForce value


`MULTI_LEGGED_ORDER` = 25
the order has multiple legs, but multiple legs are not supported by this venue


`EXCEED_MAX_POSITION_SIZE` = 26
the order would have caused the subaccount to exceed the max position size


`EXCEED_MAX_SIGNATURE_EXPIRATION` = 27
the signature supplied is more than 30 days in the future


`MARKET_ORDER_WITH_LIMIT_PRICE` = 28
the market order has a limit price set


`CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29
client cancel on disconnect triggered


`OCO_COUNTER_PART_TRIGGERED` = 30
the OCO counter part order was triggered


`REDUCE_ONLY_LIMIT` = 31
the remaining order size was cancelled because it exceeded current position size


`CLIENT_REPLACE` = 32
the order was replaced by a client replace request


`DERISK_MUST_BE_IOC` = 33
the derisk order must be an IOC order


`DERISK_MUST_BE_REDUCE_ONLY` = 34
the derisk order must be a reduce-only order


`DERISK_NOT_SUPPORTED` = 35
derisk is not supported


`INVALID_ORDER_TYPE` = 36
the order type is invalid


`CURRENCY_NOT_DEFINED` = 37
the currency is not defined


`INVALID_CHAIN_ID` = 38
the chain ID is invalid


`BUILDER_ORDER_FEE_EXCEED` = 39
Builder fee exceed the limit


`BUILDER_ORDER_FEE_NEGATIVE` = 40
Builder fee is below 0


`BUILDER_ORDER_BUILDER_NOT_AUTHORIZED` = 41
Builder is not an authorized builder for client


`BUILDER_ORDER_BUILDER_NOT_EXIST` = 42
Builder does not exist


`TRADE_PRICE_WORSE_THAN_BANKRUPTCY_PRICE` = 44
the trade price is worse than the bankruptcy price


`TOO_MANY_MAKER_ORDERS` = 45
the order was cancelled due to matching with too many maker orders


`INSUFFICIENT_BALANCE` = 49
the subaccount has insufficient balance


`BELOW_MARGIN_WITH_PENALTY_DEVIATION` = 51
the order will bring the sub account below initial margin requirement considering wide price deviation


Success
Full Response
`{
    "result": [{
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
    }],
    "next": "Qw0918="
}`
Lite Response
`{
    "r": [{
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
    }],
    "n": "Qw0918="
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/order_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/order_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/order_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


### Cancel On Disconnect

`FULL ENDPOINT: full/v1/cancel_on_disconnect
LITE ENDPOINT: lite/v1/cancel_on_disconnect`
RequestResponseErrorsTry it out


[ApiCancelOnDisconnectRequest](/../../schemas/api_cancel_on_disconnect_request)
Auto-Cancel All Open Orders when the countdown time hits zero.Market Maker inputs a countdown time parameter in milliseconds (e.g. 120000 for 120s) rounded down to the smallest second follows the following logic:  - Market Maker initially entered a value between 0 -> 1000, which is rounded to 0: will result in termination of their COD  - Market Maker initially entered a value between 1001 -> 300_000, which is rounded to the nearest second: will result in refresh of their COD  - Market Maker initially entered a value bigger than 300_000, which will result in error (upper bound)Market Maker will send a heartbeat message by calling the endpoint at specific intervals (ex. every 30 seconds) to the server to refresh the count down.If the server does not receive a heartbeat message within the countdown time, it will cancel all open orders for the specified Sub Account ID.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The subaccount ID cancelling the orders for


countdown_time`ct`
string
False`1000`
Countdown time in milliseconds (ex. 120000 for 120s).0 to disable the timer.Does not accept negative values.Minimum acceptable value is 1,000.Maximum acceptable value is 300,000


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "countdown_time": 300
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "ct": 300
}`


[AckResponse](/../../schemas/ack_response)
Used to acknowledge a request has been received and will be processed


Name`Lite`
Type
Required`Default`
Description


result`r`
Ack
True
The Ack Object


[Ack](/../../schemas/ack)


Name`Lite`
Type
Required`Default`
Description


ack`a`
boolean
True
Gravity has acknowledged that the request has been successfully received and it will process it in the backend


Success
Full Response
`{
    "result": {
        "ack": "true"
    }
}`
Lite Response
`{
    "r": {
        "a": "true"
    }
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


6000
400
Countdown time is bigger than 300s supported


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "countdown_time": 300
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_on_disconnect",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "countdown_time": 300
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "ct": 300
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_on_disconnect",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "ct": 300
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "countdown_time": 300
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_on_disconnect",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "countdown_time": 300
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "ct": 300
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_on_disconnect",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "ct": 300
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "countdown_time": 300
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_on_disconnect",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "countdown_time": 300
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "ct": 300
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_on_disconnect",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "ct": 300
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "countdown_time": 300
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/cancel_on_disconnect",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "countdown_time": 300
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/cancel_on_disconnect' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "ct": 300
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/cancel_on_disconnect",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "ct": 300
    },
    "i": 123
}
' -w 360`


## Execution


### Fill History

`FULL ENDPOINT: full/v1/fill_history
LITE ENDPOINT: lite/v1/fill_history`
RequestResponseErrorsTry it out


[ApiFillHistoryRequest](/../../schemas/api_fill_history_request)
Query for all historical fills made by a single account. A single order can be matched multiple times, hence there is no real way to uniquely identify a trade.Pagination works as follows:We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.If a `cursor` is provided, it will be used to fetch results from that point onwards.Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The sub account ID to request for


kind`k`
[Kind]
False`all`
The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned


base`b`
[string]
False`all`
The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned


quote`q`
[string]
False`all`
The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned


start_time`st`
string
False`0`
The start time to apply in unix nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned


end_time`et`
string
False`now()`
The end time to apply in unix nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned


limit`l`
integer
False`500`
The limit to query for. Defaults to 500; Max 1000


cursor`c`
string
False`''`
The cursor to indicate when to start the query from


[Kind](/../../schemas/kind)
The list of asset kinds that are supported on the GRVT exchange


Value
Description


`PERPETUAL` = 1
the perpetual asset kind


`FUTURE` = 2
the future asset kind


`CALL` = 3
the call option asset kind


`PUT` = 4
the put option asset kind


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}`


[ApiFillHistoryResponse](/../../schemas/api_fill_history_response)


Name`Lite`
Type
Required`Default`
Description


result`r`
[Fill]
True
The private trades matching the request asset


next`n`
string
True
The cursor to indicate when to start the query from


[Fill](/../../schemas/fill)


Name`Lite`
Type
Required`Default`
Description


event_time`et`
string
True
Time at which the event was emitted in unix nanoseconds


sub_account_id`sa`
string
True
The sub account ID that participated in the trade


instrument`i`
string
True
The instrument being represented


is_buyer`ib`
boolean
True
The side that the subaccount took on the trade


is_taker`it`
boolean
True
The role that the subaccount took on the trade


size`s`
string
True
The number of assets being traded, expressed in base asset decimal units


price`p`
string
True
The traded price, expressed in `9` decimals


mark_price`mp`
string
False`None`
The mark price of the instrument at point of trade, expressed in `9` decimals


index_price`ip`
string
True
The index price of the instrument at point of trade, expressed in `9` decimals


interest_rate`ir`
string
True
The interest rate of the underlying at point of trade, expressed in centibeeps (1/100th of a basis point)


forward_price`fp`
string
False`None`
[Options] The forward price of the option at point of trade, expressed in `9` decimals


realized_pnl`rp`
string
True
The realized PnL of the trade, expressed in quote asset decimal units (0 if increasing position size)


fee`f`
string
True
The fees paid on the trade, expressed in quote asset decimal unit (negative if maker rebate applied)


fee_rate`fr`
string
True
The fee rate paid on the trade


trade_id`ti`
string
True
A trade identifier, globally unique, and monotonically increasing (not by `1`).All trades sharing a single taker execution share the same first component (before `-`), and `event_time`.`trade_id` is guaranteed to be consistent across MarketData `Trade` and Trading `Fill`.


order_id`oi`
string
True
An order identifier


venue`v`
Venue
True
The venue where the trade occurred


is_liquidation`il`
boolean
True
If the trade was a liquidation


client_order_id`co`
string
True
A unique identifier for the active order within a subaccount, specified by the clientThis is used to identify the order in the client's systemThis field can be used for order amendment/cancellation, but has no bearing on the smart contract layerThis field will not be propagated to the smart contract, and should not be signed by the clientThis value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expectedGravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId


signer`s1`
string
True
The address (public key) of the wallet signing the payload


broker`b`
BrokerTag
False``
Specifies the broker who brokered the order


is_rpi`ir1`
boolean
True
If the trade is a RPI trade


builder`b1`
string
True
The main account ID of the builder. referred to Order.builder


builder_fee_rate`bf`
string
True
Builder fee percentage charged for this order. referred to Order.builder builderFee


builder_fee`bf1`
string
True
The builder fee paid on the trade, expressed in quote asset decimal unit. referred to Trade.builderFee


fee_currency`fc`
string
True
The currency of the fee paid on the trade


[Venue](/../../schemas/venue)
The list of Trading Venues that are supported on the GRVT exchange


Value
Description


`ORDERBOOK` = 1
the trade is cleared on the orderbook venue


`RFQ` = 2
the trade is cleared on the RFQ venue


[BrokerTag](/../../schemas/broker_tag)
BrokerTag is a tag for the broker that the order is sent from.


Value
Description


`UNSPECIFIED` = 0


`COIN_ROUTES` = 1
CoinRoutes


`ALERTATRON` = 2
Alertatron


`ORIGAMI` = 3
Origami


Success
Full Response
`{
    "result": [{
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
    }],
    "next": "Qw0918="
}`
Lite Response
`{
    "r": [{
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
    }],
    "n": "Qw0918="
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/fill_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/fill_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/fill_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/fill_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/fill_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/fill_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/fill_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/fill_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


### Funding Payment History

`FULL ENDPOINT: full/v1/funding_payment_history
LITE ENDPOINT: lite/v1/funding_payment_history`
RequestResponseErrorsTry it out


[ApiFundingPaymentHistoryRequest](/../../schemas/api_funding_payment_history_request)
Query for all historical funding payments made by a single account.Pagination works as follows:We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.If a `cursor` is provided, it will be used to fetch results from that point onwards.Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The sub account ID to request for


instrument`i`
string
False`all`
The perpetual instrument to filter for


start_time`st`
string
False`0`
The start time to apply in unix nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned


end_time`et`
string
False`now()`
The end time to apply in unix nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned


limit`l`
integer
False`500`
The limit to query for. Defaults to 500; Max 1000


cursor`c`
string
False`''`
The cursor to indicate when to start the query from


kind`k`
[Kind]
False`all`
The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned


base`b`
[string]
False`all`
The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned


quote`q`
[string]
False`all`
The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned


[Kind](/../../schemas/kind)
The list of asset kinds that are supported on the GRVT exchange


Value
Description


`PERPETUAL` = 1
the perpetual asset kind


`FUTURE` = 2
the future asset kind


`CALL` = 3
the call option asset kind


`PUT` = 4
the put option asset kind


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}`


[ApiFundingPaymentHistoryResponse](/../../schemas/api_funding_payment_history_response)


Name`Lite`
Type
Required`Default`
Description


result`r`
[FundingPayment]
True
The funding payments matching the request asset


next`n`
string
True
The cursor to indicate when to start the query from


[FundingPayment](/../../schemas/funding_payment)


Name`Lite`
Type
Required`Default`
Description


event_time`et`
string
True
Time at which the event was emitted in unix nanoseconds


sub_account_id`sa`
string
True
The sub account ID that made the funding payment


instrument`i`
string
True
The perpetual instrument being funded


currency`c`
string
True
The currency of the funding payment


amount`a`
string
True
The amount of the funding payment. Positive if paid, negative if received


tx_id`ti`
string
True
The transaction ID of the funding payment.Funding payments can be triggered by a trade, transfer, or liquidation.The `tx_id` will match the corresponding `trade_id` or `tx_id`.


Success
Full Response
`{
    "result": [{
        "event_time": "1697788800000000000",
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "instrument": "BTC_USDT_Perp",
        "currency": "USDT",
        "amount": "9.75",
        "tx_id": "209358"
    }],
    "next": "Qw0918="
}`
Lite Response
`{
    "r": [{
        "et": "1697788800000000000",
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "i": "BTC_USDT_Perp",
        "c": "USDT",
        "a": "9.75",
        "ti": "209358"
    }],
    "n": "Qw0918="
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding_payment_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/funding_payment_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding_payment_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/funding_payment_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding_payment_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/funding_payment_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding_payment_history",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/funding_payment_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/funding_payment_history",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


## Position


### Positions

`FULL ENDPOINT: full/v1/positions
LITE ENDPOINT: lite/v1/positions`
RequestResponseErrorsTry it out


[ApiPositionsRequest](/../../schemas/api_positions_request)
Query the positions of a sub account


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The sub account ID to request for


kind`k`
[Kind]
False`all`
The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned


base`b`
[string]
False`all`
The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned


quote`q`
[string]
False`all`
The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned


[Kind](/../../schemas/kind)
The list of asset kinds that are supported on the GRVT exchange


Value
Description


`PERPETUAL` = 1
the perpetual asset kind


`FUTURE` = 2
the future asset kind


`CALL` = 3
the call option asset kind


`PUT` = 4
the put option asset kind


Query
Full Request
`{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}`
Lite Request
`{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}`


[ApiPositionsResponse](/../../schemas/api_positions_response)


Name`Lite`
Type
Required`Default`
Description


result`r`
[Positions]
True
The positions matching the request filter


[Positions](/../../schemas/positions)


Name`Lite`
Type
Required`Default`
Description


event_time`et`
string
True
Time at which the event was emitted in unix nanoseconds


sub_account_id`sa`
string
True
The sub account ID that participated in the trade


instrument`i`
string
True
The instrument being represented


size`s`
string
True
The size of the position, expressed in base asset decimal units. Negative for short positions


notional`n`
string
True
The notional value of the position, negative for short assets, expressed in quote asset decimal units


entry_price`ep`
string
True
The entry price of the position, expressed in `9` decimalsWhenever increasing the size of a position, the entry price is updated to the new average entry price`new_entry_price = (old_entry_price * old_size + trade_price * trade_size) / (old_size + trade_size)`


exit_price`ep1`
string
True
The exit price of the position, expressed in `9` decimalsWhenever decreasing the size of a position, the exit price is updated to the new average exit price`new_exit_price = (old_exit_price * old_exit_trade_size + trade_price * trade_size) / (old_exit_trade_size + trade_size)`


mark_price`mp`
string
True
The mark price of the position, expressed in `9` decimals


unrealized_pnl`up`
string
True
The unrealized PnL of the position, expressed in quote asset decimal units`unrealized_pnl = (mark_price - entry_price) * size`


realized_pnl`rp`
string
True
The realized PnL of the position, expressed in quote asset decimal units`realized_pnl = (exit_price - entry_price) * exit_trade_size`


total_pnl`tp`
string
True
The total PnL of the position, expressed in quote asset decimal units`total_pnl = realized_pnl + unrealized_pnl`


roi`r`
string
True
The ROI of the position, expressed as a percentage`roi = (total_pnl / (entry_price * abs(size))) * 100^`


quote_index_price`qi`
string
True
The index price of the quote currency. (reported in `USD`)


est_liquidation_price`el`
string
True
The estimated liquidation price


leverage`l`
string
True
The current leverage value for this position


cumulative_fee`cf`
string
True
The cumulative fee paid on the position, expressed in quote asset decimal units


cumulative_realized_funding_payment`cr`
string
True
The cumulative realized funding payment of the position, expressed in quote asset decimal units. Positive if paid, negative if received


margin_type`mt`
PositionMarginType
True
The margin type of the position


isolated_balance`ib`
string
False`None`
[IsolatedOnly] The wallet balance reserved for this isolated margin position, expressed in quote asset decimal units. If this positions is liquidated, this is the maximal balance that can be lost


isolated_im`ii`
string
False`None`
[IsolatedOnly] The initial margin of the isolated margin position, expressed in quote asset decimal units. The `total_equity` required to open more size in the position


isolated_mm`im`
string
False`None`
[IsolatedOnly] The maintenance margin of the isolated margin position, expressed in quote asset decimal units. The `total_equity` required to avoid liquidation of the position


[PositionMarginType](/../../schemas/position_margin_type)


Value
Description


`ISOLATED` = 1
Isolated Margin Mode: each position is allocated a fixed amount of collateral


`CROSS` = 2
Cross Margin Mode: uses all available funds in your account as collateral across all cross margin positions


Success
Full Response
`{
    "result": [{
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
    }]
}`
Lite Response
`{
    "r": [{
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
    }]
}`


Error Codes


Code
HttpStatus
Description


1000
401
You need to authenticate prior to using this functionality


1001
403
You are not authorized to access this functionality


1002
500
Internal Server Error


1003
400
Request could not be processed due to malformed syntax


1006
429
You have surpassed the allocated rate limit for your tier


1008
401
Your IP has not been whitelisted for access


Failure
Full Error Response
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
Lite Error Response
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
}`


Authentication
GRVT supports two authentication methods: API Key and Wallet Login (EIP-712). Both return a session cookie used to authenticate subsequent requests.
API Key Login
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
Wallet Login
Authenticate using your EVM signing wallet via an EIP-712 typed-data signature — no API key required.
`POST /auth/wallet/login`
Sign the following struct with `eth_signTypedData_v4`:
`WalletLogin(address signer, uint32 nonce, int64 expiration)`


Field
Type
Description


`signer`
`address`
Your registered EVM wallet address


`nonce`
`uint32`
Random client-chosen number. Each `(address, nonce)` pair can only be used once.


`expiration`
`int64`
Unix timestamp in nanoseconds. Must be in the future, max 5 minutes from now. See [Server Time](../market_data_api/#server-time).


Request
The request uses the common [Signature](/../../schemas/signature) DTO shared across all signed endpoints.
`{
  "address": "0xYourWalletAddress",
  "signature": { "signer": "0xYourWalletAddress", "v": 27, "r": "0x...", "s": "0x...", "nonce": 305419896, "expiration": "1772159636314000000", "chain_id": "326" }
}`
Response
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


REST Full
`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/positions",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/positions",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/positions",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/positions",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.testnet.grvt.io/full/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/positions",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.testnet.grvt.io/lite/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/positions",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


REST Full
`curl --location 'https://trades.grvt.io/full/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"]
}
'`


JSONRPC Full
`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/positions",
    "params": {
        "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"]
    },
    "id": 123
}
' -w 360`


REST Lite
`curl --location 'https://trades.grvt.io/lite/v1/positions' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"]
}
'`


JSONRPC Lite
`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/positions",
    "p": {
        "sa": "'$GRVT_SUB_ACCOUNT_ID'",
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"]
    },
    "i": 123
}
' -w 360`


### Position History

`FULL ENDPOINT: full/v1/position_history
LITE ENDPOINT: lite/v1/position_history`
RequestResponseErrorsTry it out


[ApiPositionHistoryRequest](/../../schemas/api_position_history_request)
Query for position lifecycle records for a single sub account.Returns both fully closed positions and positions that are still open but have been partially reduced (`PARTIALLY_CLOSED`).Results are ordered as follows: partially closed positions (most recently opened first), then fully closed positions (most recently closed first).Partially closed positions are included only when all of the following are true:`start_time` is unset (partially closed positions have no close time)`end_time` is unset (partially closed positions have no close time)`cursor` is unset (they are only returned on the initial page)`status` is nil or includes `PARTIALLY_CLOSED`Since these positions have no close time, query-row limits, as well as time-range and cursor-based pagination, do not apply to them.Pagination works as follows:We perform a reverse chronological lookup by position-close time, starting from `end_time`. If `end_time` is not set, we start from the most recent data.The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.If a `cursor` is provided, it will be used to fetch results from that point onwards.Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.


Name`Lite`
Type
Required`Default`
Description


sub_account_id`sa`
string
True
The sub account ID to request for


start_time`st`
string
False`0`
Start of the close-time range in unix nanoseconds. If nil, defaults to no lower bound. Only positions with close_time >= start_time are returned. Does not apply to partially closed positions (they have no close time and will be excluded when this field is set)


end_time`et`
string
False`now()`
End of the close-time range in unix nanoseconds. If nil, defaults to now. Only positions with close_time 90% of the manager-defined maximum redemption period, have top priority (following insertion order).**Non-urgent** redemption requests are otherwise prioritized by insertion order, **unless** they are >5x the size of the smallest redemption request.

E.g., If FIFO ordering (all non-urgent) is 1k -> 50k -> 100k -> 20k -> 10k -> 25k, then priority ordering is 1k -> 10k -> 50k -> 20k -> 100k -> 25k.

Only displays redemption requests that are eligible for automated redemption, i.e., have been pending for the manager-defined minimum redemption period.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| vault_id`vi` 
| string 
| True 
| The unique identifier of the vault to fetch the redemption queue for. 
|


Query


**Full Request**
`{
    "vault_id": "3477045127917224"
}`
**Lite Request**
`{
    "vi": "3477045127917224"
}`


[ApiVaultViewRedemptionQueueResponse](/../../schemas/api_vault_view_redemption_queue_response)


Response payload for a vault manager to view the redemption queue for their vault, ordered by descending priority.

Also includes counters for total redemption sizes pending as well as urgent (refer to API integration guide for more detail on redemption request classifications).


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| redemption_queue`rq` 
| [VaultRedemptionRequest] 
| True 
| Outstanding vault redemption requests, ordered by descending priority. Excludes requests that have not yet aged past the minimum redemption period. 
|


| pending_redemption_token_count`pr` 
| string 
| True 
| Number of shares eligible for automated redemption (held in queue for at least the minimum redemption period). 
|


| urgent_redemption_token_count`ur` 
| string 
| True 
| Number of shares nearing the maximum redemption period (>= 90% of maximum redemption period). 
|


| auto_redeemable_balance`ar` 
| string 
| True 
| Amount available for automated redemption request servicing (in USD). 
|


| share_price`sp` 
| string 
| True 
| Current share price (in USD). 
|


| pre_min`pm` 
| PreMinRedemptions 
| True 
| Dedicated section for requests yet to wait at least the minimum redemption period. 
|


[VaultRedemptionRequest](/../../schemas/vault_redemption_request)

Representation of a pending redemption request for a given vault.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_time`rt` 
| string 
| True 
| [Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds 
|


| num_lp_tokens`nl` 
| string 
| True 
| The number of shares to redeem 
|


| max_redemption_period_timestamp`mr` 
| string 
| True 
| [Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed. 
|


| age_category`ac` 
| VaultRedemptionReqAgeCategory 
| True 
| Age category of this redemption request. 
|


| is_manager`im` 
| boolean 
| False`None` 
| `true` if this request belongs to the vault manager, omitted otherwise. 
|


| eligible_for_auto_redemption_timestamp`ef` 
| string 
| True 
| [Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be eligible for automated redemption. 
|


[VaultRedemptionReqAgeCategory](/../../schemas/vault_redemption_req_age_category)

Denotes the age category of a given redemption request.


| Value 
| Description 
|


| `NORMAL` = 1 
| This request is at least as old as the minimum redemption period, and is eligible for automated redemption. 
|


| `URGENT` = 2 
| This request is nearing the maxmimum redemption period and will be factored into pre-order check margin requirements. 
|


| `OVERDUE` = 3 
| This request has exceeded the maximum redemption period and will be considered for forced redemptions. 
|


| `PRE_MIN` = 4 
| This request has yet to exceed the minimum redemption period, and is not yet eligible for automated redemption. 
|


[PreMinRedemptions](/../../schemas/pre_min_redemptions)

Vault redemption queue section hidden from main view. All requests here have yet to age past the vault's minimum redemption period.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| requests`r` 
| [VaultRedemptionRequest] 
| True 
| Pre-minimum-age redemption requests, ordered by age (first element is the oldest request that is pre-minimum-age). 
|


| token_count`tc` 
| string 
| True 
| Number of shares in the pre-minimum-age section of the vault's redemption queue. 
|


[VaultRedemptionRequest](/../../schemas/vault_redemption_request)

Representation of a pending redemption request for a given vault.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| request_time`rt` 
| string 
| True 
| [Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds 
|


| num_lp_tokens`nl` 
| string 
| True 
| The number of shares to redeem 
|


| max_redemption_period_timestamp`mr` 
| string 
| True 
| [Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed. 
|


| age_category`ac` 
| VaultRedemptionReqAgeCategory 
| True 
| Age category of this redemption request. 
|


| is_manager`im` 
| boolean 
| False`None` 
| `true` if this request belongs to the vault manager, omitted otherwise. 
|


| eligible_for_auto_redemption_timestamp`ef` 
| string 
| True 
| [Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be eligible for automated redemption. 
|


[VaultRedemptionReqAgeCategory](/../../schemas/vault_redemption_req_age_category)

Denotes the age category of a given redemption request.


| Value 
| Description 
|


| `NORMAL` = 1 
| This request is at least as old as the minimum redemption period, and is eligible for automated redemption. 
|


| `URGENT` = 2 
| This request is nearing the maxmimum redemption period and will be factored into pre-order check margin requirements. 
|


| `OVERDUE` = 3 
| This request has exceeded the maximum redemption period and will be considered for forced redemptions. 
|


| `PRE_MIN` = 4 
| This request has yet to exceed the minimum redemption period, and is not yet eligible for automated redemption. 
|


Success


**Full Response**
`{
    "redemption_queue": [{
        "request_time": "1697788800000000000",
        "num_lp_tokens": "1000000",
        "max_redemption_period_timestamp": "1727788800000000000",
        "age_category": "NORMAL",
        "is_manager": true,
        "eligible_for_auto_redemption_timestamp": "1727788800000000000"
    }],
    "pending_redemption_token_count": "1000000",
    "urgent_redemption_token_count": "0",
    "auto_redeemable_balance": "0",
    "share_price": "1.25",
    "pre_min": {
        "requests": [{
            "request_time": "1697788800000000000",
            "num_lp_tokens": "1000000",
            "max_redemption_period_timestamp": "1727788800000000000",
            "age_category": "NORMAL",
            "is_manager": true,
            "eligible_for_auto_redemption_timestamp": "1727788800000000000"
        }],
        "token_count": "1000000"
    }
}`
**Lite Response**
`{
    "rq": [{
        "rt": "1697788800000000000",
        "nl": "1000000",
        "mr": "1727788800000000000",
        "ac": "NORMAL",
        "im": true,
        "ef": "1727788800000000000"
    }],
    "pr": "1000000",
    "ur": "0",
    "ar": "0",
    "sp": "1.25",
    "pm": {
        "r": [{
            "rt": "1697788800000000000",
            "nl": "1000000",
            "mr": "1727788800000000000",
            "ac": "NORMAL",
            "im": true,
            "ef": "1727788800000000000"
        }],
        "tc": "1000000"
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


| 7000 
| 400 
| Vault ID provided is invalid and does not belong to any vault 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
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


REST Full


`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "3477045127917224"
}
'`


JSONRPC Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_view_redemption_queue",
    "params": {
        "vault_id": "3477045127917224"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "3477045127917224"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_view_redemption_queue",
    "p": {
        "vi": "3477045127917224"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "3477045127917224"
}
'`


JSONRPC Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_view_redemption_queue",
    "params": {
        "vault_id": "3477045127917224"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "3477045127917224"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_view_redemption_queue",
    "p": {
        "vi": "3477045127917224"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.testnet.grvt.io/full/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "3477045127917224"
}
'`


JSONRPC Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_view_redemption_queue",
    "params": {
        "vault_id": "3477045127917224"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "3477045127917224"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_view_redemption_queue",
    "p": {
        "vi": "3477045127917224"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.grvt.io/full/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "3477045127917224"
}
'`


JSONRPC Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_view_redemption_queue",
    "params": {
        "vault_id": "3477045127917224"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.grvt.io/lite/v1/vault_view_redemption_queue' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "3477045127917224"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_view_redemption_queue",
    "p": {
        "vi": "3477045127917224"
    },
    "i": 123
}
' -w 360`


### Vault Manager Investment History

`FULL ENDPOINT: full/v1/vault_manager_investor_history
LITE ENDPOINT: lite/v1/vault_manager_investor_history`
RequestResponseErrorsTry it out


[ApiQueryVaultManagerInvestorHistoryRequest](/../../schemas/api_query_vault_manager_investor_history_request)


Request for the manager to retrieve the vault investor history for their vault


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| vault_id`vi` 
| string 
| True 
| The unique identifier of the vault to filter by 
|


| only_own_investments`oo` 
| boolean 
| True 
| Whether to only return investments made by the manager 
|


| start_time`st` 
| string 
| False`0` 
| Optional. Start time in unix nanoseconds 
|


| end_time`et` 
| string 
| False`now()` 
| Optional. End time in unix nanoseconds 
|


Query


**Full Request**
`{
    "vault_id": "2312134",
    "only_own_investments": true,
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000"
}`
**Lite Request**
`{
    "vi": "2312134",
    "oo": true,
    "st": "1697788800000000000",
    "et": "1697788800000000000"
}`


[ApiQueryVaultManagerInvestorHistoryResponse](/../../schemas/api_query_vault_manager_investor_history_response)


Response to retrieve the vault summary for a given vault


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [ApiVaultInvestorHistory] 
| True 
| The list of vault investor history belong to the manager 
|


[ApiVaultInvestorHistory](/../../schemas/api_vault_investor_history)

The vault investor history returned by the service to client


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


| off_chain_account_id`oc` 
| string 
| True 
| The off chain account id of the investor, only visible to the manager 
|


| vault_id`vi` 
| string 
| True 
| The unique identifier of the vault. 
|


| type`t` 
| VaultInvestorAction 
| True 
| The type of transaction that occurred. List of types: vaultInvest, vaultBurnLpToken, vaultRedeem 
|


| price`p` 
| string 
| True 
| The price of the vault LP tokens at the time of the event. 
|


| size`s` 
| string 
| True 
| The amount of Vault LP tokens invested or redeemed. 
|


| realized_pnl`rp` 
| string 
| True 
| The realized PnL of the vault. 
|


| performance_fee`pf` 
| string 
| True 
| The performance fee of the vault. 
|


[VaultInvestorAction](/../../schemas/vault_investor_action)

| Value 
| Description 
|


| `UNSPECIFIED` = 0 
|  
|


| `VAULT_INVEST` = 1 
|  
|


| `VAULT_BURN_LP_TOKEN` = 2 
|  
|


| `VAULT_REDEEM` = 3 
|  
|


Success


**Full Response**
`{
    "result": [{
        "event_time": "1697788800000000000",
        "off_chain_account_id": "ACC:123456",
        "vault_id": "2312134",
        "type": "VAULT_INVEST",
        "price": "1000000",
        "size": "1000000",
        "realized_pnl": "1000000",
        "performance_fee": "1000000"
    }]
}`
**Lite Response**
`{
    "r": [{
        "et": "1697788800000000000",
        "oc": "ACC:123456",
        "vi": "2312134",
        "t": "VAULT_INVEST",
        "p": "1000000",
        "s": "1000000",
        "rp": "1000000",
        "pf": "1000000"
    }]
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
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


REST Full


`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "2312134",
    "only_own_investments": true,
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000"
}
'`


JSONRPC Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_manager_investor_history",
    "params": {
        "vault_id": "2312134",
        "only_own_investments": true,
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "2312134",
    "oo": true,
    "st": "1697788800000000000",
    "et": "1697788800000000000"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_manager_investor_history",
    "p": {
        "vi": "2312134",
        "oo": true,
        "st": "1697788800000000000",
        "et": "1697788800000000000"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "2312134",
    "only_own_investments": true,
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000"
}
'`


JSONRPC Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_manager_investor_history",
    "params": {
        "vault_id": "2312134",
        "only_own_investments": true,
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "2312134",
    "oo": true,
    "st": "1697788800000000000",
    "et": "1697788800000000000"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_manager_investor_history",
    "p": {
        "vi": "2312134",
        "oo": true,
        "st": "1697788800000000000",
        "et": "1697788800000000000"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.testnet.grvt.io/full/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "2312134",
    "only_own_investments": true,
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000"
}
'`


JSONRPC Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_manager_investor_history",
    "params": {
        "vault_id": "2312134",
        "only_own_investments": true,
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "2312134",
    "oo": true,
    "st": "1697788800000000000",
    "et": "1697788800000000000"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_manager_investor_history",
    "p": {
        "vi": "2312134",
        "oo": true,
        "st": "1697788800000000000",
        "et": "1697788800000000000"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.grvt.io/full/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vault_id": "2312134",
    "only_own_investments": true,
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000"
}
'`


JSONRPC Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/vault_manager_investor_history",
    "params": {
        "vault_id": "2312134",
        "only_own_investments": true,
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.grvt.io/lite/v1/vault_manager_investor_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "vi": "2312134",
    "oo": true,
    "st": "1697788800000000000",
    "et": "1697788800000000000"
}
'`


JSONRPC Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/vault_manager_investor_history",
    "p": {
        "vi": "2312134",
        "oo": true,
        "st": "1697788800000000000",
        "et": "1697788800000000000"
    },
    "i": 123
}
' -w 360`


## Builder


### Get Authorized Builders

`FULL ENDPOINT: full/v1/get_authorized_builders
LITE ENDPOINT: lite/v1/get_authorized_builders`
RequestResponseErrorsTry it out


[EmptyRequest](/../../schemas/empty_request)


Used for requests that do not require any parameters


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


|  
|  
|  
|  
|


Query


**Full Request**
`{
}`
**Lite Request**
`{
}`


[ApiGetAuthorizedBuildersResponse](/../../schemas/api_get_authorized_builders_response)


Returns list of authorized builders and the associated fee


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| results`r` 
| [ApiAuthorizedBuilder] 
| True 
| The list of authorized builders 
|


[ApiAuthorizedBuilder](/../../schemas/api_authorized_builder)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| builder_account_id`ba` 
| string 
| True 
| The main account ID of the builder 
|


| max_futures_fee_rate`mf` 
| string 
| True 
| The maximum fee rate for the authorized builder 
|


| max_spot_fee_rate`ms` 
| string 
| True 
| The maximum fee rate for the authorized builder 
|


Success


**Full Response**
`{
    "results": [{
        "builder_account_id": "'$GRVT_MAIN_ACCOUNT_ID'",
        "max_futures_fee_rate": 0.001,
        "max_spot_fee_rate": 0.0001
    }]
}`
**Lite Response**
`{
    "r": [{
        "ba": "'$GRVT_MAIN_ACCOUNT_ID'",
        "mf": 0.001,
        "ms": 0.0001
    }]
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
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


REST Full


`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/get_authorized_builders",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/get_authorized_builders",
    "p": {
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/get_authorized_builders",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/get_authorized_builders",
    "p": {
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.testnet.grvt.io/full/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/get_authorized_builders",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.testnet.grvt.io/lite/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/get_authorized_builders",
    "p": {
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.grvt.io/full/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/get_authorized_builders",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.grvt.io/lite/v1/get_authorized_builders' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/get_authorized_builders",
    "p": {
    },
    "i": 123
}
' -w 360`


## Execution


### Builder Fill History

`FULL ENDPOINT: full/v1/builder_fill_history
LITE ENDPOINT: lite/v1/builder_fill_history`
RequestResponseErrorsTry it out


[ApiBuilderFillHistoryRequest](/../../schemas/api_builder_fill_history_request)


The request to get the historical builder trade of a builder
The history is returned in reverse chronological order

Pagination works as follows:
- We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.
- The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.
- If a `cursor` is provided, it will be used to fetch results from that point onwards.
- Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| start_time`st` 
| string 
| False`0` 
| The start time to query for in unix nanoseconds 
|


| end_time`et` 
| string 
| False`now()` 
| The end time to query for in unix nanoseconds 
|


| limit`l` 
| integer 
| False`500` 
| The limit to query for. Defaults to 500; Max 1000 
|


| cursor`c` 
| string 
| False`''` 
| The cursor to indicate when to start the next query from 
|


Query


**Full Request**
`{
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}`
**Lite Request**
`{
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}`


[ApiBuilderFillHistoryResponse](/../../schemas/api_builder_fill_history_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [BuilderFillHistory] 
| True 
| The builder fill history matching the request builder account 
|


| next`n` 
| string 
| False`''` 
| The cursor to indicate when to start the next query from 
|


[BuilderFillHistory](/../../schemas/builder_fill_history)

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


| off_chain_account_id`oc` 
| string 
| True 
| The off chain account id 
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
| True 
| The mark price of the instrument at point of trade, expressed in `9` decimals 
|


| index_price`ip` 
| string 
| True 
| The index price of the instrument at point of trade, expressed in `9` decimals 
|


| fee_rate`fr` 
| string 
| True 
| Builder fee percentage charged for this order. referred to Order.builder builderFee 
|


| fee`f` 
| string 
| True 
| The builder fee paid on the trade, expressed in quote asset decimal unit. referred to Trade.builderFee 
|


Success


**Full Response**
`{
    "result": [{
        "event_time": "1697788800000000000",
        "off_chain_account_id": "ACC:123456",
        "instrument": "BTC_USDT_Perp",
        "is_buyer": true,
        "is_taker": true,
        "size": "0.30",
        "price": "65038.01",
        "mark_price": "65038.01",
        "index_price": "65038.01",
        "fee_rate": 0.001,
        "fee": null
    }],
    "next": "Qw0918="
}`
**Lite Response**
`{
    "r": [{
        "et": "1697788800000000000",
        "oc": "ACC:123456",
        "i": "BTC_USDT_Perp",
        "ib": true,
        "it": true,
        "s": "0.30",
        "p": "65038.01",
        "mp": "65038.01",
        "ip": "65038.01",
        "fr": 0.001,
        "f": null
    }],
    "n": "Qw0918="
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


| 1008 
| 401 
| Your IP has not been whitelisted for access 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1000,
    "message":"You need to authenticate prior to using this functionality",
    "status":401
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1000,
    "m":"You need to authenticate prior to using this functionality",
    "s":401
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


REST Full


`curl --location 'https://trades.dev.gravitymarkets.io/full/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/builder_fill_history",
    "params": {
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/builder_fill_history",
    "p": {
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.staging.gravitymarkets.io/full/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/builder_fill_history",
    "params": {
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/builder_fill_history",
    "p": {
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.testnet.grvt.io/full/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://trades.testnet.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/builder_fill_history",
    "params": {
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.testnet.grvt.io/lite/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/builder_fill_history",
    "p": {
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://trades.grvt.io/full/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://trades.grvt.io/ws/full" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/builder_fill_history",
    "params": {
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://trades.grvt.io/lite/v1/builder_fill_history' \
--header "Cookie: $GRVT_COOKIE" \
--header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
--data '{
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://trades.grvt.io/ws/lite" \
-H "Cookie: $GRVT_COOKIE" \
-H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
-x '
{
    "j": "2.0",
    "m": "v1/builder_fill_history",
    "p": {
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`