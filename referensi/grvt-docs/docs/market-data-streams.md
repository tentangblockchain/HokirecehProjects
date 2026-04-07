# Market Data Websocket - Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/market_data_streams/
> Fetched : 2026-04-07T15:10:54.862Z
> Engine  : MkDocs Material



# MarketData Websocket Streams


## Ticker


### Mini Ticker Snap


`STREAM: v1.mini.s`
Feed SelectorFeed DataErrorsTry it out


[WSMiniTickerFeedSelectorV1](/../../schemas/ws_mini_ticker_feed_selector_v1)


Subscribes to a mini ticker feed for a single instrument. The `mini.s` channel offers simpler integration. To experience higher publishing rates, please use the `mini.d` channel.
Unlike the `mini.d` channel which publishes an initial snapshot, then only streams deltas after, the `mini.s` channel publishes full snapshots at each feed.

The Delta feed will work as follows:
- On subscription, the server will send a full snapshot of the mini ticker.
- After the snapshot, the server will only send deltas of the mini ticker.
- The server will send a delta if any of the fields in the mini ticker have changed.


Field Semantics:
- [DeltaOnly] If a field is not updated, {}
- If a field is updated, {field: '123'}
- If a field is set to zero, {field: '0'}
- If a field is set to null, {field: ''}


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| rate`r` 
| integer 
| True 
| The minimal rate at which we publish feeds (in milliseconds)Delta (0 - `raw`, 50, 100, 200, 500, 1000, 5000)Snapshot (200, 500, 1000, 5000) 
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
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.mini.s",
        "subs": ["BTC_USDT_Perp@500"],
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
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.mini.s",
        "unsubs": ["BTC_USDT_Perp@500"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.mini.s",
    "subs":["BTC_USDT_Perp@500"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSMiniTickerFeedDataV1](/../../schemas/ws_mini_ticker_feed_data_v1)


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
| MiniTicker 
| True 
| A mini ticker matching the request filter 
|


[MiniTicker](/../../schemas/mini_ticker)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| event_time`et` 
| string 
| False`None` 
| Time at which the event was emitted in unix nanoseconds 
|


| instrument`i` 
| string 
| False`None` 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| mark_price`mp` 
| string 
| False`None` 
| The mark price of the instrument, expressed in `9` decimals 
|


| index_price`ip` 
| string 
| False`None` 
| The index price of the instrument, expressed in `9` decimals 
|


| last_price`lp` 
| string 
| False`None` 
| The last traded price of the instrument (also close price), expressed in `9` decimals 
|


| last_size`ls` 
| string 
| False`None` 
| The number of assets traded in the last trade, expressed in base asset decimal units 
|


| mid_price`mp1` 
| string 
| False`None` 
| The mid price of the instrument, expressed in `9` decimals 
|


| best_bid_price`bb` 
| string 
| False`None` 
| The best bid price of the instrument, expressed in `9` decimals 
|


| best_bid_size`bb1` 
| string 
| False`None` 
| The number of assets offered on the best bid price of the instrument, expressed in base asset decimal units 
|


| best_ask_price`ba` 
| string 
| False`None` 
| The best ask price of the instrument, expressed in `9` decimals 
|


| best_ask_size`ba1` 
| string 
| False`None` 
| The number of assets offered on the best ask price of the instrument, expressed in base asset decimal units 
|


Success


**Full Feed Response**
`{
    "stream": "v1.mini.s",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "instrument": "BTC_USDT_Perp",
        "mark_price": "65038.01",
        "index_price": "65038.01",
        "last_price": "65038.01",
        "last_size": "123456.78",
        "mid_price": "65038.01",
        "best_bid_price": "65038.01",
        "best_bid_size": "123456.78",
        "best_ask_price": "65038.01",
        "best_ask_size": "123456.78"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.mini.s",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "i": "BTC_USDT_Perp",
        "mp": "65038.01",
        "ip": "65038.01",
        "lp": "65038.01",
        "ls": "123456.78",
        "mp1": "65038.01",
        "bb": "65038.01",
        "bb1": "123456.78",
        "ba": "65038.01",
        "ba1": "123456.78"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1004 
| 404 
| Data Not Found 
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


| 3030 
| 400 
| Feed rate is invalid 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Mini Ticker Delta

`STREAM: v1.mini.d`
Feed SelectorFeed DataErrorsTry it out


[WSMiniTickerFeedSelectorV1](/../../schemas/ws_mini_ticker_feed_selector_v1)


Subscribes to a mini ticker feed for a single instrument. The `mini.s` channel offers simpler integration. To experience higher publishing rates, please use the `mini.d` channel.
Unlike the `mini.d` channel which publishes an initial snapshot, then only streams deltas after, the `mini.s` channel publishes full snapshots at each feed.

The Delta feed will work as follows:
- On subscription, the server will send a full snapshot of the mini ticker.
- After the snapshot, the server will only send deltas of the mini ticker.
- The server will send a delta if any of the fields in the mini ticker have changed.


Field Semantics:
- [DeltaOnly] If a field is not updated, {}
- If a field is updated, {field: '123'}
- If a field is set to zero, {field: '0'}
- If a field is set to null, {field: ''}


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| rate`r` 
| integer 
| True 
| The minimal rate at which we publish feeds (in milliseconds)Delta (0 - `raw`, 50, 100, 200, 500, 1000, 5000)Snapshot (200, 500, 1000, 5000) 
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
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.mini.d",
        "subs": ["BTC_USDT_Perp@500"],
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
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.mini.d",
        "unsubs": ["BTC_USDT_Perp@500"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.mini.d",
    "subs":["BTC_USDT_Perp@500"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSMiniTickerFeedDataV1](/../../schemas/ws_mini_ticker_feed_data_v1)


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
| MiniTicker 
| True 
| A mini ticker matching the request filter 
|


[MiniTicker](/../../schemas/mini_ticker)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| event_time`et` 
| string 
| False`None` 
| Time at which the event was emitted in unix nanoseconds 
|


| instrument`i` 
| string 
| False`None` 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| mark_price`mp` 
| string 
| False`None` 
| The mark price of the instrument, expressed in `9` decimals 
|


| index_price`ip` 
| string 
| False`None` 
| The index price of the instrument, expressed in `9` decimals 
|


| last_price`lp` 
| string 
| False`None` 
| The last traded price of the instrument (also close price), expressed in `9` decimals 
|


| last_size`ls` 
| string 
| False`None` 
| The number of assets traded in the last trade, expressed in base asset decimal units 
|


| mid_price`mp1` 
| string 
| False`None` 
| The mid price of the instrument, expressed in `9` decimals 
|


| best_bid_price`bb` 
| string 
| False`None` 
| The best bid price of the instrument, expressed in `9` decimals 
|


| best_bid_size`bb1` 
| string 
| False`None` 
| The number of assets offered on the best bid price of the instrument, expressed in base asset decimal units 
|


| best_ask_price`ba` 
| string 
| False`None` 
| The best ask price of the instrument, expressed in `9` decimals 
|


| best_ask_size`ba1` 
| string 
| False`None` 
| The number of assets offered on the best ask price of the instrument, expressed in base asset decimal units 
|


Success


**Full Feed Response**
`{
    "stream": "v1.mini.d",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "instrument": "BTC_USDT_Perp",
        "mark_price": "65038.01",
        "index_price": "65038.01",
        "last_price": "65038.01",
        "last_size": "123456.78",
        "mid_price": "65038.01",
        "best_bid_price": "65038.01",
        "best_bid_size": "123456.78",
        "best_ask_price": "65038.01",
        "best_ask_size": "123456.78"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.mini.d",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "i": "BTC_USDT_Perp",
        "mp": "65038.01",
        "ip": "65038.01",
        "lp": "65038.01",
        "ls": "123456.78",
        "mp1": "65038.01",
        "bb": "65038.01",
        "bb1": "123456.78",
        "ba": "65038.01",
        "ba1": "123456.78"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1004 
| 404 
| Data Not Found 
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


| 3030 
| 400 
| Feed rate is invalid 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.mini.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.mini.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.mini.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Ticker Snap

`STREAM: v1.ticker.s`
Feed SelectorFeed DataErrorsTry it out


[WSTickerFeedSelectorV1](/../../schemas/ws_ticker_feed_selector_v1)


Subscribes to a ticker feed for a single instrument. The `ticker.s` channel offers simpler integration. To experience higher publishing rates, please use the `ticker.d` channel.
Unlike the `ticker.d` channel which publishes an initial snapshot, then only streams deltas after, the `ticker.s` channel publishes full snapshots at each feed.

The Delta feed will work as follows:
- On subscription, the server will send a full snapshot of the ticker.
- After the snapshot, the server will only send deltas of the ticker.
- The server will send a delta if any of the fields in the ticker have changed.


Field Semantics:
- [DeltaOnly] If a field is not updated, {}
- If a field is updated, {field: '123'}
- If a field is set to zero, {field: '0'}
- If a field is set to null, {field: ''}


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| rate`r` 
| integer 
| True 
| The minimal rate at which we publish feeds (in milliseconds)Delta (100, 200, 500, 1000, 5000)Snapshot (500, 1000, 5000) 
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
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.ticker.s",
        "subs": ["BTC_USDT_Perp@500"],
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
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.ticker.s",
        "unsubs": ["BTC_USDT_Perp@500"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.ticker.s",
    "subs":["BTC_USDT_Perp@500"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSTickerFeedDataV1](/../../schemas/ws_ticker_feed_data_v1)


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
| Ticker 
| True 
| A ticker matching the request filter 
|


[Ticker](/../../schemas/ticker)

Derived data such as the below, will not be included by default:
  - 24 hour volume (`buyVolume + sellVolume`)
  - 24 hour taker buy/sell ratio (`buyVolume / sellVolume`)
  - 24 hour average trade price (`volumeQ / volumeU`)
  - 24 hour average trade volume (`volume / trades`)
  - 24 hour percentage change (`24hStatChange / 24hStat`)
  - 48 hour statistics (`2 * 24hStat - 24hStatChange`)

To query for an extended ticker payload, leverage the `greeks` and the `derived` flags.
Ticker extensions are currently under design to offer you more convenience.
These flags are only supported on the `Ticker Snapshot` WS endpoint, and on the `Ticker` API endpoint.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| event_time`et` 
| string 
| False`None` 
| Time at which the event was emitted in unix nanoseconds 
|


| instrument`i` 
| string 
| False`None` 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| mark_price`mp` 
| string 
| False`None` 
| The mark price of the instrument, expressed in `9` decimals 
|


| index_price`ip` 
| string 
| False`None` 
| The index price of the instrument, expressed in `9` decimals 
|


| last_price`lp` 
| string 
| False`None` 
| The last traded price of the instrument (also close price), expressed in `9` decimals 
|


| last_size`ls` 
| string 
| False`None` 
| The number of assets traded in the last trade, expressed in base asset decimal units 
|


| mid_price`mp1` 
| string 
| False`None` 
| The mid price of the instrument, expressed in `9` decimals 
|


| best_bid_price`bb` 
| string 
| False`None` 
| The best bid price of the instrument, expressed in `9` decimals 
|


| best_bid_size`bb1` 
| string 
| False`None` 
| The number of assets offered on the best bid price of the instrument, expressed in base asset decimal units 
|


| best_ask_price`ba` 
| string 
| False`None` 
| The best ask price of the instrument, expressed in `9` decimals 
|


| best_ask_size`ba1` 
| string 
| False`None` 
| The number of assets offered on the best ask price of the instrument, expressed in base asset decimal units 
|


| funding_rate_8h_curr`fr` 
| string 
| False`None` 
| DEPRECATED: To be removed in a future release. Please refer to the field `funding_rate` instead, for the funding rate being applied over `funding_interval_hours` (interval ending at `next_funding_time`). 
|


| funding_rate_8h_avg`fr1` 
| string 
| False`None` 
| DEPRECATED: To be removed in a future release. Please refer to the field `funding_rate` instead, for the funding rate being applied over `funding_interval_hours` (interval ending at `next_funding_time`). 
|


| interest_rate`ir` 
| string 
| False`None` 
| The interest rate of the underlying, expressed in centibeeps (1/100th of a basis point) 
|


| forward_price`fp` 
| string 
| False`None` 
| [Options] The forward price of the option, expressed in `9` decimals 
|


| buy_volume_24h_b`bv` 
| string 
| False`None` 
| The 24 hour taker buy volume of the instrument, expressed in base asset decimal units 
|


| sell_volume_24h_b`sv` 
| string 
| False`None` 
| The 24 hour taker sell volume of the instrument, expressed in base asset decimal units 
|


| buy_volume_24h_q`bv1` 
| string 
| False`None` 
| The 24 hour taker buy volume of the instrument, expressed in quote asset decimal units 
|


| sell_volume_24h_q`sv1` 
| string 
| False`None` 
| The 24 hour taker sell volume of the instrument, expressed in quote asset decimal units 
|


| high_price`hp` 
| string 
| False`None` 
| The 24 hour highest traded price of the instrument, expressed in `9` decimals 
|


| low_price`lp1` 
| string 
| False`None` 
| The 24 hour lowest traded price of the instrument, expressed in `9` decimals 
|


| open_price`op` 
| string 
| False`None` 
| The 24 hour first traded price of the instrument, expressed in `9` decimals 
|


| open_interest`oi` 
| string 
| False`None` 
| The open interest in the instrument, expressed in base asset decimal units 
|


| long_short_ratio`ls1` 
| string 
| False`None` 
| The ratio of accounts that are net long vs net short on this instrument 
|


| funding_rate`fr2` 
| string 
| False`None` 
| The current indicative funding rate for the active interval, expressed in centibeeps 
|


| next_funding_time`nf` 
| string 
| False`None` 
| Timestamp in nanoseconds when the current funding interval ends 
|


Success


**Full Feed Response**
`{
    "stream": "v1.ticker.s",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "instrument": "BTC_USDT_Perp",
        "mark_price": "65038.01",
        "index_price": "65038.01",
        "last_price": "65038.01",
        "last_size": "123456.78",
        "mid_price": "65038.01",
        "best_bid_price": "65038.01",
        "best_bid_size": "123456.78",
        "best_ask_price": "65038.01",
        "best_ask_size": "123456.78",
        "funding_rate_8h_curr": 0.0003,
        "funding_rate_8h_avg": 0.0003,
        "interest_rate": 0.0003,
        "forward_price": "65038.01",
        "buy_volume_24h_b": "123456.78",
        "sell_volume_24h_b": "123456.78",
        "buy_volume_24h_q": "123456.78",
        "sell_volume_24h_q": "123456.78",
        "high_price": "65038.01",
        "low_price": "65038.01",
        "open_price": "65038.01",
        "open_interest": "123456.78",
        "long_short_ratio": "0.5",
        "funding_rate": 0.0003,
        "next_funding_time": "1697788800000000000"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.ticker.s",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "i": "BTC_USDT_Perp",
        "mp": "65038.01",
        "ip": "65038.01",
        "lp": "65038.01",
        "ls": "123456.78",
        "mp1": "65038.01",
        "bb": "65038.01",
        "bb1": "123456.78",
        "ba": "65038.01",
        "ba1": "123456.78",
        "fr": 0.0003,
        "fr1": 0.0003,
        "ir": 0.0003,
        "fp": "65038.01",
        "bv": "123456.78",
        "sv": "123456.78",
        "bv1": "123456.78",
        "sv1": "123456.78",
        "hp": "65038.01",
        "lp1": "65038.01",
        "op": "65038.01",
        "oi": "123456.78",
        "ls1": "0.5",
        "fr2": 0.0003,
        "nf": "1697788800000000000"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1004 
| 404 
| Data Not Found 
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


| 3030 
| 400 
| Feed rate is invalid 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.s",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.s",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.s",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Ticker Delta

`STREAM: v1.ticker.d`
Feed SelectorFeed DataErrorsTry it out


[WSTickerFeedSelectorV1](/../../schemas/ws_ticker_feed_selector_v1)


Subscribes to a ticker feed for a single instrument. The `ticker.s` channel offers simpler integration. To experience higher publishing rates, please use the `ticker.d` channel.
Unlike the `ticker.d` channel which publishes an initial snapshot, then only streams deltas after, the `ticker.s` channel publishes full snapshots at each feed.

The Delta feed will work as follows:
- On subscription, the server will send a full snapshot of the ticker.
- After the snapshot, the server will only send deltas of the ticker.
- The server will send a delta if any of the fields in the ticker have changed.


Field Semantics:
- [DeltaOnly] If a field is not updated, {}
- If a field is updated, {field: '123'}
- If a field is set to zero, {field: '0'}
- If a field is set to null, {field: ''}


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| rate`r` 
| integer 
| True 
| The minimal rate at which we publish feeds (in milliseconds)Delta (100, 200, 500, 1000, 5000)Snapshot (500, 1000, 5000) 
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
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.ticker.d",
        "subs": ["BTC_USDT_Perp@500"],
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
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.ticker.d",
        "unsubs": ["BTC_USDT_Perp@500"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.ticker.d",
    "subs":["BTC_USDT_Perp@500"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSTickerFeedDataV1](/../../schemas/ws_ticker_feed_data_v1)


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
| Ticker 
| True 
| A ticker matching the request filter 
|


[Ticker](/../../schemas/ticker)

Derived data such as the below, will not be included by default:
  - 24 hour volume (`buyVolume + sellVolume`)
  - 24 hour taker buy/sell ratio (`buyVolume / sellVolume`)
  - 24 hour average trade price (`volumeQ / volumeU`)
  - 24 hour average trade volume (`volume / trades`)
  - 24 hour percentage change (`24hStatChange / 24hStat`)
  - 48 hour statistics (`2 * 24hStat - 24hStatChange`)

To query for an extended ticker payload, leverage the `greeks` and the `derived` flags.
Ticker extensions are currently under design to offer you more convenience.
These flags are only supported on the `Ticker Snapshot` WS endpoint, and on the `Ticker` API endpoint.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| event_time`et` 
| string 
| False`None` 
| Time at which the event was emitted in unix nanoseconds 
|


| instrument`i` 
| string 
| False`None` 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| mark_price`mp` 
| string 
| False`None` 
| The mark price of the instrument, expressed in `9` decimals 
|


| index_price`ip` 
| string 
| False`None` 
| The index price of the instrument, expressed in `9` decimals 
|


| last_price`lp` 
| string 
| False`None` 
| The last traded price of the instrument (also close price), expressed in `9` decimals 
|


| last_size`ls` 
| string 
| False`None` 
| The number of assets traded in the last trade, expressed in base asset decimal units 
|


| mid_price`mp1` 
| string 
| False`None` 
| The mid price of the instrument, expressed in `9` decimals 
|


| best_bid_price`bb` 
| string 
| False`None` 
| The best bid price of the instrument, expressed in `9` decimals 
|


| best_bid_size`bb1` 
| string 
| False`None` 
| The number of assets offered on the best bid price of the instrument, expressed in base asset decimal units 
|


| best_ask_price`ba` 
| string 
| False`None` 
| The best ask price of the instrument, expressed in `9` decimals 
|


| best_ask_size`ba1` 
| string 
| False`None` 
| The number of assets offered on the best ask price of the instrument, expressed in base asset decimal units 
|


| funding_rate_8h_curr`fr` 
| string 
| False`None` 
| DEPRECATED: To be removed in a future release. Please refer to the field `funding_rate` instead, for the funding rate being applied over `funding_interval_hours` (interval ending at `next_funding_time`). 
|


| funding_rate_8h_avg`fr1` 
| string 
| False`None` 
| DEPRECATED: To be removed in a future release. Please refer to the field `funding_rate` instead, for the funding rate being applied over `funding_interval_hours` (interval ending at `next_funding_time`). 
|


| interest_rate`ir` 
| string 
| False`None` 
| The interest rate of the underlying, expressed in centibeeps (1/100th of a basis point) 
|


| forward_price`fp` 
| string 
| False`None` 
| [Options] The forward price of the option, expressed in `9` decimals 
|


| buy_volume_24h_b`bv` 
| string 
| False`None` 
| The 24 hour taker buy volume of the instrument, expressed in base asset decimal units 
|


| sell_volume_24h_b`sv` 
| string 
| False`None` 
| The 24 hour taker sell volume of the instrument, expressed in base asset decimal units 
|


| buy_volume_24h_q`bv1` 
| string 
| False`None` 
| The 24 hour taker buy volume of the instrument, expressed in quote asset decimal units 
|


| sell_volume_24h_q`sv1` 
| string 
| False`None` 
| The 24 hour taker sell volume of the instrument, expressed in quote asset decimal units 
|


| high_price`hp` 
| string 
| False`None` 
| The 24 hour highest traded price of the instrument, expressed in `9` decimals 
|


| low_price`lp1` 
| string 
| False`None` 
| The 24 hour lowest traded price of the instrument, expressed in `9` decimals 
|


| open_price`op` 
| string 
| False`None` 
| The 24 hour first traded price of the instrument, expressed in `9` decimals 
|


| open_interest`oi` 
| string 
| False`None` 
| The open interest in the instrument, expressed in base asset decimal units 
|


| long_short_ratio`ls1` 
| string 
| False`None` 
| The ratio of accounts that are net long vs net short on this instrument 
|


| funding_rate`fr2` 
| string 
| False`None` 
| The current indicative funding rate for the active interval, expressed in centibeeps 
|


| next_funding_time`nf` 
| string 
| False`None` 
| Timestamp in nanoseconds when the current funding interval ends 
|


Success


**Full Feed Response**
`{
    "stream": "v1.ticker.d",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "instrument": "BTC_USDT_Perp",
        "mark_price": "65038.01",
        "index_price": "65038.01",
        "last_price": "65038.01",
        "last_size": "123456.78",
        "mid_price": "65038.01",
        "best_bid_price": "65038.01",
        "best_bid_size": "123456.78",
        "best_ask_price": "65038.01",
        "best_ask_size": "123456.78",
        "funding_rate_8h_curr": 0.0003,
        "funding_rate_8h_avg": 0.0003,
        "interest_rate": 0.0003,
        "forward_price": "65038.01",
        "buy_volume_24h_b": "123456.78",
        "sell_volume_24h_b": "123456.78",
        "buy_volume_24h_q": "123456.78",
        "sell_volume_24h_q": "123456.78",
        "high_price": "65038.01",
        "low_price": "65038.01",
        "open_price": "65038.01",
        "open_interest": "123456.78",
        "long_short_ratio": "0.5",
        "funding_rate": 0.0003,
        "next_funding_time": "1697788800000000000"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.ticker.d",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "i": "BTC_USDT_Perp",
        "mp": "65038.01",
        "ip": "65038.01",
        "lp": "65038.01",
        "ls": "123456.78",
        "mp1": "65038.01",
        "bb": "65038.01",
        "bb1": "123456.78",
        "ba": "65038.01",
        "ba1": "123456.78",
        "fr": 0.0003,
        "fr1": 0.0003,
        "ir": 0.0003,
        "fp": "65038.01",
        "bv": "123456.78",
        "sv": "123456.78",
        "bv1": "123456.78",
        "sv1": "123456.78",
        "hp": "65038.01",
        "lp1": "65038.01",
        "op": "65038.01",
        "oi": "123456.78",
        "ls1": "0.5",
        "fr2": 0.0003,
        "nf": "1697788800000000000"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1004 
| 404 
| Data Not Found 
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


| 3030 
| 400 
| Feed rate is invalid 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.ticker.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.ticker.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.ticker.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


## Orderbook


### Orderbook Snap

`STREAM: v1.book.s`
Feed SelectorFeed DataErrorsTry it out


[WSOrderbookLevelsFeedSelectorV1](/../../schemas/ws_orderbook_levels_feed_selector_v1)


Subscribes to aggregated orderbook updates for a single instrument. The `book.s` channel offers simpler integration. To experience higher publishing rates, please use the `book.d` channel.
Unlike the `book.d` channel which publishes an initial snapshot, then only streams deltas after, the `book.s` channel publishes full snapshots at each feed.

The Delta feed will work as follows:
- On subscription, the server will send a full snapshot of all levels of the Orderbook.
- After the snapshot, the server will only send levels that have changed in value.


Subscription Pattern:
- Delta - `instrument@rate`
- Snapshot - `instrument@rate-depth`


Field Semantics:
- [DeltaOnly] If a level is not updated, level not published
- If a level is updated, {size: '123'}
- If a level is set to zero, {size: '0'}
- Incoming levels will be published as soon as price moves
- Outgoing levels will be published with `size = 0`


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| rate`r` 
| integer 
| True 
| The minimal rate at which we publish feeds (in milliseconds)Delta (50, 100, 500, 1000)Snapshot (500, 1000) 
|


| depth`d` 
| integer 
| False`'0'` 
| Depth of the order book to be retrievedDelta(0 - `unlimited`)Snapshot(10, 50, 100, 500) 
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
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.book.s",
        "subs": ["BTC_USDT_Perp@500-50"],
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
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.book.s",
        "unsubs": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.book.s",
    "subs":["BTC_USDT_Perp@500-50"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSOrderbookLevelsFeedDataV1](/../../schemas/ws_orderbook_levels_feed_data_v1)


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
| OrderbookLevels 
| True 
| An orderbook levels object matching the request filter 
|


[OrderbookLevels](/../../schemas/orderbook_levels)

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


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| bids`b` 
| [OrderbookLevel] 
| True 
| The list of best bids up till query depth 
|


| asks`a` 
| [OrderbookLevel] 
| True 
| The list of best asks up till query depth 
|


[OrderbookLevel](/../../schemas/orderbook_level)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| price`p` 
| string 
| True 
| The price of the level, expressed in `9` decimals 
|


| size`s` 
| string 
| True 
| The number of assets offered, expressed in base asset decimal units 
|


| num_orders`no` 
| integer 
| True 
| The number of open orders at this level 
|


[OrderbookLevel](/../../schemas/orderbook_level)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| price`p` 
| string 
| True 
| The price of the level, expressed in `9` decimals 
|


| size`s` 
| string 
| True 
| The number of assets offered, expressed in base asset decimal units 
|


| num_orders`no` 
| integer 
| True 
| The number of open orders at this level 
|


Success


**Full Feed Response**
`{
    "stream": "v1.book.s",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "instrument": "BTC_USDT_Perp",
        "bids": [{
            "price": "65038.01",
            "size": "3456.78",
            "num_orders": 123
        }],
        "asks": [{
            "price": "65038.01",
            "size": "3456.78",
            "num_orders": 123
        }]
    }
}`
**Lite Feed Response**
`{
    "s": "v1.book.s",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "i": "BTC_USDT_Perp",
        "b": [{
            "p": "65038.01",
            "s": "3456.78",
            "no": 123
        }],
        "a": [{
            "p": "65038.01",
            "s": "3456.78",
            "no": 123
        }]
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1004 
| 404 
| Data Not Found 
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


| 3030 
| 400 
| Feed rate is invalid 
|


| 3031 
| 400 
| Depth is invalid 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.s",
        "selectors": ["BTC_USDT_Perp@500-50"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.s",
        "s1": ["BTC_USDT_Perp@500-50"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.s",
    "feed":["BTC_USDT_Perp@500-50"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


### Orderbook Delta

`STREAM: v1.book.d`
Feed SelectorFeed DataErrorsTry it out


[WSOrderbookLevelsFeedSelectorV1](/../../schemas/ws_orderbook_levels_feed_selector_v1)


Subscribes to aggregated orderbook updates for a single instrument. The `book.s` channel offers simpler integration. To experience higher publishing rates, please use the `book.d` channel.
Unlike the `book.d` channel which publishes an initial snapshot, then only streams deltas after, the `book.s` channel publishes full snapshots at each feed.

The Delta feed will work as follows:
- On subscription, the server will send a full snapshot of all levels of the Orderbook.
- After the snapshot, the server will only send levels that have changed in value.


Subscription Pattern:
- Delta - `instrument@rate`
- Snapshot - `instrument@rate-depth`


Field Semantics:
- [DeltaOnly] If a level is not updated, level not published
- If a level is updated, {size: '123'}
- If a level is set to zero, {size: '0'}
- Incoming levels will be published as soon as price moves
- Outgoing levels will be published with `size = 0`


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| rate`r` 
| integer 
| True 
| The minimal rate at which we publish feeds (in milliseconds)Delta (50, 100, 500, 1000)Snapshot (500, 1000) 
|


| depth`d` 
| integer 
| False`'0'` 
| Depth of the order book to be retrievedDelta(0 - `unlimited`)Snapshot(10, 50, 100, 500) 
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
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.book.d",
        "subs": ["BTC_USDT_Perp@500"],
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
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.book.d",
        "unsubs": ["BTC_USDT_Perp@500"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.book.d",
    "subs":["BTC_USDT_Perp@500"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSOrderbookLevelsFeedDataV1](/../../schemas/ws_orderbook_levels_feed_data_v1)


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
| OrderbookLevels 
| True 
| An orderbook levels object matching the request filter 
|


[OrderbookLevels](/../../schemas/orderbook_levels)

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


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| bids`b` 
| [OrderbookLevel] 
| True 
| The list of best bids up till query depth 
|


| asks`a` 
| [OrderbookLevel] 
| True 
| The list of best asks up till query depth 
|


[OrderbookLevel](/../../schemas/orderbook_level)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| price`p` 
| string 
| True 
| The price of the level, expressed in `9` decimals 
|


| size`s` 
| string 
| True 
| The number of assets offered, expressed in base asset decimal units 
|


| num_orders`no` 
| integer 
| True 
| The number of open orders at this level 
|


[OrderbookLevel](/../../schemas/orderbook_level)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| price`p` 
| string 
| True 
| The price of the level, expressed in `9` decimals 
|


| size`s` 
| string 
| True 
| The number of assets offered, expressed in base asset decimal units 
|


| num_orders`no` 
| integer 
| True 
| The number of open orders at this level 
|


Success


**Full Feed Response**
`{
    "stream": "v1.book.d",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "instrument": "BTC_USDT_Perp",
        "bids": [{
            "price": "65038.01",
            "size": "3456.78",
            "num_orders": 123
        }],
        "asks": [{
            "price": "65038.01",
            "size": "3456.78",
            "num_orders": 123
        }]
    }
}`
**Lite Feed Response**
`{
    "s": "v1.book.d",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "i": "BTC_USDT_Perp",
        "b": [{
            "p": "65038.01",
            "s": "3456.78",
            "no": 123
        }],
        "a": [{
            "p": "65038.01",
            "s": "3456.78",
            "no": 123
        }]
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
|


| 1004 
| 404 
| Data Not Found 
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


| 3030 
| 400 
| Feed rate is invalid 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.book.d",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.book.d",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.book.d",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


## Trade


### Trade

`STREAM: v1.trade`
Feed SelectorFeed DataErrorsTry it out


[WSTradeFeedSelectorV1](/../../schemas/ws_trade_feed_selector_v1)


Subscribes to a stream of Public Trades for an instrument.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| limit`l` 
| integer 
| True 
| The limit to query for. Valid values are (50, 200, 500, 1000). Default is 50 
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
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.trade",
        "subs": ["BTC_USDT_Perp@500"],
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
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.trade",
        "unsubs": ["BTC_USDT_Perp@500"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.trade",
    "subs":["BTC_USDT_Perp@500"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSTradeFeedDataV1](/../../schemas/ws_trade_feed_data_v1)


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
| Trade 
| True 
| A public trade matching the request filter 
|


[Trade](/../../schemas/trade)

All private RFQs and Private AXEs will be filtered out from the responses


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


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| is_taker_buyer`it` 
| boolean 
| True 
| If taker was the buyer on the trade 
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


| trade_id`ti` 
| string 
| True 
| A trade identifier, globally unique, and monotonically increasing (not by `1`).All trades sharing a single taker execution share the same first component (before `-`), and `event_time`.`trade_id` is guaranteed to be consistent across MarketData `Trade` and Trading `Fill`. 
|


| venue`v` 
| Venue 
| True 
| The venue where the trade occurred 
|


| is_rpi`ir1` 
| boolean 
| True 
| If the trade is a RPI trade 
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


Success


**Full Feed Response**
`{
    "stream": "v1.trade",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "event_time": "1697788800000000000",
        "instrument": "BTC_USDT_Perp",
        "is_taker_buyer": true,
        "size": "123456.78",
        "price": "65038.01",
        "mark_price": "65038.01",
        "index_price": "65038.01",
        "interest_rate": 0.0003,
        "forward_price": "65038.01",
        "trade_id": "209358-2",
        "venue": "ORDERBOOK",
        "is_rpi": false
    }
}`
**Lite Feed Response**
`{
    "s": "v1.trade",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "et": "1697788800000000000",
        "i": "BTC_USDT_Perp",
        "it": true,
        "s": "123456.78",
        "p": "65038.01",
        "mp": "65038.01",
        "ip": "65038.01",
        "ir": 0.0003,
        "fp": "65038.01",
        "ti": "209358-2",
        "v": "ORDERBOOK",
        "ir1": false
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
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


| 3011 
| 400 
| Limit exceeds min or max value 
|


| 3013 
| 400 
| Exact limit value is not supported 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.trade",
        "selectors": ["BTC_USDT_Perp@500"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.trade",
        "s1": ["BTC_USDT_Perp@500"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.trade",
    "feed":["BTC_USDT_Perp@500"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


## Candlestick


### Candlestick

`STREAM: v1.candle`
Feed SelectorFeed DataErrorsTry it out


[WSCandlestickFeedSelectorV1](/../../schemas/ws_candlestick_feed_selector_v1)


Subscribes to a stream of Kline/Candlestick updates for an instrument. A Kline is uniquely identified by its open time.
A new Kline is published every interval (if it exists). Upon subscription, the server will send the 5 most recent Kline for the requested interval.


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| interval`i1` 
| CandlestickInterval 
| True 
| The interval of each candlestick 
|


| type`t` 
| CandlestickType 
| True 
| The type of candlestick data to retrieve 
|


[CandlestickInterval](/../../schemas/candlestick_interval)

| Value 
| Description 
|


| `CI_1_M` = 1 
| 1 minute 
|


| `CI_3_M` = 2 
| 3 minutes 
|


| `CI_5_M` = 3 
| 5 minutes 
|


| `CI_15_M` = 4 
| 15 minutes 
|


| `CI_30_M` = 5 
| 30 minutes 
|


| `CI_1_H` = 6 
| 1 hour 
|


| `CI_2_H` = 7 
| 2 hour 
|


| `CI_4_H` = 8 
| 4 hour 
|


| `CI_6_H` = 9 
| 6 hour 
|


| `CI_8_H` = 10 
| 8 hour 
|


| `CI_12_H` = 11 
| 12 hour 
|


| `CI_1_D` = 12 
| 1 day 
|


| `CI_3_D` = 13 
| 3 days 
|


| `CI_5_D` = 14 
| 5 days 
|


| `CI_1_W` = 15 
| 1 week 
|


| `CI_2_W` = 16 
| 2 weeks 
|


| `CI_3_W` = 17 
| 3 weeks 
|


| `CI_4_W` = 18 
| 4 weeks 
|


[CandlestickType](/../../schemas/candlestick_type)

| Value 
| Description 
|


| `TRADE` = 1 
| Tracks traded prices 
|


| `MARK` = 2 
| Tracks mark prices 
|


| `INDEX` = 3 
| Tracks index prices 
|


| `MID` = 4 
| Tracks book mid prices 
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
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}`
**Full Subscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.candle",
        "subs": ["BTC_USDT_Perp@CI_1M-TRADE"],
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
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}`
**Full Unsubscribe Response**
`{
    "jsonrpc": "2.0",
    "result": {
        "stream": "v1.candle",
        "unsubs": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123,
    "method": "subscribe"
}`


Legacy Subscribe

**Full Subscribe Request**
`{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":true
}`
**Full Subscribe Response**
`{
    "request_id":1,
    "stream":"v1.candle",
    "subs":["BTC_USDT_Perp@CI_1M-TRADE"],
    "unsubs":[],
    "num_snapshots":[1],
    "first_sequence_number":[2813]
}`


[WSCandlestickFeedDataV1](/../../schemas/ws_candlestick_feed_data_v1)


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
| Candlestick 
| True 
| A candlestick entry matching the request filters 
|


[Candlestick](/../../schemas/candlestick)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| open_time`ot` 
| string 
| True 
| Open time of kline bar in unix nanoseconds 
|


| close_time`ct` 
| string 
| True 
| Close time of kline bar in unix nanosecond 
|


| open`o` 
| string 
| True 
| The open price, expressed in underlying currency resolution units 
|


| close`c` 
| string 
| True 
| The close price, expressed in underlying currency resolution units 
|


| high`h` 
| string 
| True 
| The high price, expressed in underlying currency resolution units 
|


| low`l` 
| string 
| True 
| The low price, expressed in underlying currency resolution units 
|


| volume_b`vb` 
| string 
| True 
| The underlying volume transacted, expressed in base asset decimal units 
|


| volume_q`vq` 
| string 
| True 
| The quote volume transacted, expressed in quote asset decimal units 
|


| trades`t` 
| integer 
| True 
| The number of trades transacted 
|


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


Success


**Full Feed Response**
`{
    "stream": "v1.candle",
    "selector": "BTC_USDT_Perp",
    "sequence_number": "872634876",
    "feed": {
        "open_time": "1697788800000000000",
        "close_time": "1697788800000000000",
        "open": "123456.78",
        "close": "123456.78",
        "high": "123456.78",
        "low": "123456.78",
        "volume_b": "123456.78",
        "volume_q": "123456.78",
        "trades": 123456,
        "instrument": "BTC_USDT_Perp"
    }
}`
**Lite Feed Response**
`{
    "s": "v1.candle",
    "s1": "BTC_USDT_Perp",
    "sn": "872634876",
    "f": {
        "ot": "1697788800000000000",
        "ct": "1697788800000000000",
        "o": "123456.78",
        "c": "123456.78",
        "h": "123456.78",
        "l": "123456.78",
        "vb": "123456.78",
        "vq": "123456.78",
        "t": 123456,
        "i": "BTC_USDT_Perp"
    }
}`


Error Codes


| Code 
| HttpStatus 
| Description 
|


| 1002 
| 500 
| Internal Server Error 
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


| 3040 
| 400 
| Candlestick interval is invalid 
|


| 3041 
| 400 
| Candlestick type is invalid 
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
        "code": 1002,
        "message": "Internal Server Error"
    },
    "id": 123,
    "method": "subscribe"
}`
**Lite Error Response**
`{
    "j": "2.0",
    "e": {
        "c": 1002,
        "m": "Internal Server Error"
    },
    "i": 123,
    "m": "subscribe"
}`
**Legacy Error Response**
`{
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`


DEVSTAGINGTESTNETPROD


Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`


Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Unsubscribe Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "unsubscribe",
    "params": {
        "stream": "v1.candle",
        "selectors": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "id": 123
}
' -w 360`


Legacy Subscribe Full


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":true
}
' -w 360`


Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "subscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Unsubscribe Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "unsubscribe",
    "p": {
        "s": "v1.candle",
        "s1": ["BTC_USDT_Perp@CI_1M-TRADE"]
    },
    "i": 123
}
' -w 360`


Legacy Subscribe Lite


`wscat -c "wss://market-data.grvt.io/ws" \
-x '
{
    "request_id":1,
    "stream":"v1.candle",
    "feed":["BTC_USDT_Perp@CI_1M-TRADE"],
    "method":"subscribe",
    "is_full":false
}
' -w 360`