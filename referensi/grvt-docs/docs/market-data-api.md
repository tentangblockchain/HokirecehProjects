# Market Data API - Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/market_data_api/
> Fetched : 2026-04-07T15:12:36.047Z
> Engine  : MkDocs Material



# MarketData APIs


All requests should be made using the `POST` HTTP method.


## Instrument


### Get Instrument


`FULL ENDPOINT: full/v1/instrument
LITE ENDPOINT: lite/v1/instrument`
RequestResponseErrorsTry it out


[ApiGetInstrumentRequest](/../../schemas/api_get_instrument_request)


Fetch a single instrument by supplying the asset or instrument name


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


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp"
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp"
}`


[ApiGetInstrumentResponse](/../../schemas/api_get_instrument_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| InstrumentDisplay 
| True 
| The instrument matching the request asset 
|


[InstrumentDisplay](/../../schemas/instrument_display)

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


| instrument_hash`ih` 
| string 
| True 
| The asset ID used for instrument signing. 
|


| base`b` 
| string 
| True 
| The base currency 
|


| quote`q` 
| string 
| True 
| The quote currency 
|


| kind`k` 
| Kind 
| True 
| The kind of instrument 
|


| venues`v` 
| [Venue] 
| True 
| Venues that this instrument can be traded at 
|


| settlement_period`sp1` 
| InstrumentSettlementPeriod 
| False`None` 
| The settlement period of the instrument 
|


| base_decimals`bd` 
| integer 
| True 
| The smallest denomination of the base asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1) 
|


| quote_decimals`qd` 
| integer 
| True 
| The smallest denomination of the quote asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1) 
|


| tick_size`ts` 
| string 
| True 
| The size of a single tick, expressed in price decimal units 
|


| min_size`ms` 
| string 
| True 
| The minimum contract size, expressed in base asset decimal units 
|


| create_time`ct` 
| string 
| True 
| Creation time in unix nanoseconds 
|


| max_position_size`mp` 
| string 
| False`None` 
| The maximum position size, expressed in base asset decimal units 
|


| funding_interval_hours`fi` 
| integer 
| False`None` 
| Defines the funding interval to be applied. 
|


| adjusted_funding_rate_cap`af` 
| string 
| False`None` 
| Funding rate cap over the defined `intervalHours`. 
|


| adjusted_funding_rate_floor`af1` 
| string 
| False`None` 
| Funding rate floor over the defined `intervalHours`. 
|


| min_notional`mn` 
| string 
| True 
| The minimum order notional value, expressed in quote currency decimal units 
|


[Kind](/../../schemas/kind)

The list of asset kinds that are supported on the GRVT exchange


| Value 
| Description 
|


| `PERPETUAL` = 1 
| the perpetual asset kind 
|


| `FUTURE` = 2 
| the future asset kind 
|


| `CALL` = 3 
| the call option asset kind 
|


| `PUT` = 4 
| the put option asset kind 
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


[InstrumentSettlementPeriod](/../../schemas/instrument_settlement_period)

| Value 
| Description 
|


| `PERPETUAL` = 1 
| Instrument settles through perpetual funding cycles 
|


| `DAILY` = 2 
| Instrument settles at an expiry date, marked as a daily instrument 
|


| `WEEKLY` = 3 
| Instrument settles at an expiry date, marked as a weekly instrument 
|


| `MONTHLY` = 4 
| Instrument settles at an expiry date, marked as a monthly instrument 
|


| `QUARTERLY` = 5 
| Instrument settles at an expiry date, marked as a quarterly instrument 
|


Success


**Full Response**
`{
    "result": {
        "instrument": "BTC_USDT_Perp",
        "instrument_hash": "0x030501",
        "base": "BTC",
        "quote": "USDT",
        "kind": "PERPETUAL",
        "venues": ["ORDERBOOK"],
        "settlement_period": "PERPETUAL",
        "base_decimals": 3,
        "quote_decimals": 3,
        "tick_size": "0.01",
        "min_size": "0.01",
        "create_time": "1697788800000000000",
        "max_position_size": "100.0",
        "funding_interval_hours": 8,
        "adjusted_funding_rate_cap": 2.5,
        "adjusted_funding_rate_floor": -2.5,
        "min_notional": "20.0"
    }
}`
**Lite Response**
`{
    "r": {
        "i": "BTC_USDT_Perp",
        "ih": "0x030501",
        "b": "BTC",
        "q": "USDT",
        "k": "PERPETUAL",
        "v": ["ORDERBOOK"],
        "sp1": "PERPETUAL",
        "bd": 3,
        "qd": 3,
        "ts": "0.01",
        "ms": "0.01",
        "ct": "1697788800000000000",
        "mp": "100.0",
        "fi": 8,
        "af": 2.5,
        "af1": -2.5,
        "mn": "20.0"
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1004 
| 404 
| Data Not Found 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/instrument' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instrument",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/instrument' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instrument",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/instrument' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instrument",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/instrument' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instrument",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/instrument' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instrument",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/instrument' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instrument",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/instrument' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instrument",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/instrument' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instrument",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


### Get All Instruments

`FULL ENDPOINT: full/v1/all_instruments
LITE ENDPOINT: lite/v1/all_instruments`
RequestResponseErrorsTry it out


[ApiGetAllInstrumentsRequest](/../../schemas/api_get_all_instruments_request)


Fetch all instruments


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| is_active`ia` 
| boolean 
| False`false` 
| Fetch only active instruments 
|


Query


**Full Request**
`{
    "is_active": true
}`
**Lite Request**
`{
    "ia": true
}`


[ApiGetAllInstrumentsResponse](/../../schemas/api_get_all_instruments_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [InstrumentDisplay] 
| True 
| List of instruments 
|


[InstrumentDisplay](/../../schemas/instrument_display)

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


| instrument_hash`ih` 
| string 
| True 
| The asset ID used for instrument signing. 
|


| base`b` 
| string 
| True 
| The base currency 
|


| quote`q` 
| string 
| True 
| The quote currency 
|


| kind`k` 
| Kind 
| True 
| The kind of instrument 
|


| venues`v` 
| [Venue] 
| True 
| Venues that this instrument can be traded at 
|


| settlement_period`sp1` 
| InstrumentSettlementPeriod 
| False`None` 
| The settlement period of the instrument 
|


| base_decimals`bd` 
| integer 
| True 
| The smallest denomination of the base asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1) 
|


| quote_decimals`qd` 
| integer 
| True 
| The smallest denomination of the quote asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1) 
|


| tick_size`ts` 
| string 
| True 
| The size of a single tick, expressed in price decimal units 
|


| min_size`ms` 
| string 
| True 
| The minimum contract size, expressed in base asset decimal units 
|


| create_time`ct` 
| string 
| True 
| Creation time in unix nanoseconds 
|


| max_position_size`mp` 
| string 
| False`None` 
| The maximum position size, expressed in base asset decimal units 
|


| funding_interval_hours`fi` 
| integer 
| False`None` 
| Defines the funding interval to be applied. 
|


| adjusted_funding_rate_cap`af` 
| string 
| False`None` 
| Funding rate cap over the defined `intervalHours`. 
|


| adjusted_funding_rate_floor`af1` 
| string 
| False`None` 
| Funding rate floor over the defined `intervalHours`. 
|


| min_notional`mn` 
| string 
| True 
| The minimum order notional value, expressed in quote currency decimal units 
|


[Kind](/../../schemas/kind)

The list of asset kinds that are supported on the GRVT exchange


| Value 
| Description 
|


| `PERPETUAL` = 1 
| the perpetual asset kind 
|


| `FUTURE` = 2 
| the future asset kind 
|


| `CALL` = 3 
| the call option asset kind 
|


| `PUT` = 4 
| the put option asset kind 
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


[InstrumentSettlementPeriod](/../../schemas/instrument_settlement_period)

| Value 
| Description 
|


| `PERPETUAL` = 1 
| Instrument settles through perpetual funding cycles 
|


| `DAILY` = 2 
| Instrument settles at an expiry date, marked as a daily instrument 
|


| `WEEKLY` = 3 
| Instrument settles at an expiry date, marked as a weekly instrument 
|


| `MONTHLY` = 4 
| Instrument settles at an expiry date, marked as a monthly instrument 
|


| `QUARTERLY` = 5 
| Instrument settles at an expiry date, marked as a quarterly instrument 
|


Success


**Full Response**
`{
    "result": [{
        "instrument": "BTC_USDT_Perp",
        "instrument_hash": "0x030501",
        "base": "BTC",
        "quote": "USDT",
        "kind": "PERPETUAL",
        "venues": ["ORDERBOOK"],
        "settlement_period": "PERPETUAL",
        "base_decimals": 3,
        "quote_decimals": 3,
        "tick_size": "0.01",
        "min_size": "0.01",
        "create_time": "1697788800000000000",
        "max_position_size": "100.0",
        "funding_interval_hours": 8,
        "adjusted_funding_rate_cap": 2.5,
        "adjusted_funding_rate_floor": -2.5,
        "min_notional": "20.0"
    }]
}`
**Lite Response**
`{
    "r": [{
        "i": "BTC_USDT_Perp",
        "ih": "0x030501",
        "b": "BTC",
        "q": "USDT",
        "k": "PERPETUAL",
        "v": ["ORDERBOOK"],
        "sp1": "PERPETUAL",
        "bd": 3,
        "qd": 3,
        "ts": "0.01",
        "ms": "0.01",
        "ct": "1697788800000000000",
        "mp": "100.0",
        "fi": 8,
        "af": 2.5,
        "af1": -2.5,
        "mn": "20.0"
    }]
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/all_instruments' \
--data '{
    "is_active": true
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/all_instruments",
    "params": {
        "is_active": true
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/all_instruments' \
--data '{
    "ia": true
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/all_instruments",
    "p": {
        "ia": true
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/all_instruments' \
--data '{
    "is_active": true
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/all_instruments",
    "params": {
        "is_active": true
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/all_instruments' \
--data '{
    "ia": true
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/all_instruments",
    "p": {
        "ia": true
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/all_instruments' \
--data '{
    "is_active": true
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/all_instruments",
    "params": {
        "is_active": true
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/all_instruments' \
--data '{
    "ia": true
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/all_instruments",
    "p": {
        "ia": true
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/all_instruments' \
--data '{
    "is_active": true
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/all_instruments",
    "params": {
        "is_active": true
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/all_instruments' \
--data '{
    "ia": true
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/all_instruments",
    "p": {
        "ia": true
    },
    "i": 123
}
' -w 360`


### Get Filtered Instruments

`FULL ENDPOINT: full/v1/instruments
LITE ENDPOINT: lite/v1/instruments`
RequestResponseErrorsTry it out


[ApiGetFilteredInstrumentsRequest](/../../schemas/api_get_filtered_instruments_request)


Fetch a list of instruments based on the filters provided


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| kind`k` 
| [Kind] 
| False`all` 
| The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned 
|


| base`b` 
| [string] 
| False`all` 
| The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned 
|


| quote`q` 
| [string] 
| False`all` 
| The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned 
|


| is_active`ia` 
| boolean 
| False`false` 
| Request for active instruments only 
|


| limit`l` 
| integer 
| False`500` 
| The limit to query for. Defaults to 500; Max 100000 
|


[Kind](/../../schemas/kind)

The list of asset kinds that are supported on the GRVT exchange


| Value 
| Description 
|


| `PERPETUAL` = 1 
| the perpetual asset kind 
|


| `FUTURE` = 2 
| the future asset kind 
|


| `CALL` = 3 
| the call option asset kind 
|


| `PUT` = 4 
| the put option asset kind 
|


Query


**Full Request**
`{
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "is_active": true,
    "limit": 500
}`
**Lite Request**
`{
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "ia": true,
    "l": 500
}`


[ApiGetFilteredInstrumentsResponse](/../../schemas/api_get_filtered_instruments_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [InstrumentDisplay] 
| True 
| The instruments matching the request filter 
|


[InstrumentDisplay](/../../schemas/instrument_display)

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


| instrument_hash`ih` 
| string 
| True 
| The asset ID used for instrument signing. 
|


| base`b` 
| string 
| True 
| The base currency 
|


| quote`q` 
| string 
| True 
| The quote currency 
|


| kind`k` 
| Kind 
| True 
| The kind of instrument 
|


| venues`v` 
| [Venue] 
| True 
| Venues that this instrument can be traded at 
|


| settlement_period`sp1` 
| InstrumentSettlementPeriod 
| False`None` 
| The settlement period of the instrument 
|


| base_decimals`bd` 
| integer 
| True 
| The smallest denomination of the base asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1) 
|


| quote_decimals`qd` 
| integer 
| True 
| The smallest denomination of the quote asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1) 
|


| tick_size`ts` 
| string 
| True 
| The size of a single tick, expressed in price decimal units 
|


| min_size`ms` 
| string 
| True 
| The minimum contract size, expressed in base asset decimal units 
|


| create_time`ct` 
| string 
| True 
| Creation time in unix nanoseconds 
|


| max_position_size`mp` 
| string 
| False`None` 
| The maximum position size, expressed in base asset decimal units 
|


| funding_interval_hours`fi` 
| integer 
| False`None` 
| Defines the funding interval to be applied. 
|


| adjusted_funding_rate_cap`af` 
| string 
| False`None` 
| Funding rate cap over the defined `intervalHours`. 
|


| adjusted_funding_rate_floor`af1` 
| string 
| False`None` 
| Funding rate floor over the defined `intervalHours`. 
|


| min_notional`mn` 
| string 
| True 
| The minimum order notional value, expressed in quote currency decimal units 
|


[Kind](/../../schemas/kind)

The list of asset kinds that are supported on the GRVT exchange


| Value 
| Description 
|


| `PERPETUAL` = 1 
| the perpetual asset kind 
|


| `FUTURE` = 2 
| the future asset kind 
|


| `CALL` = 3 
| the call option asset kind 
|


| `PUT` = 4 
| the put option asset kind 
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


[InstrumentSettlementPeriod](/../../schemas/instrument_settlement_period)

| Value 
| Description 
|


| `PERPETUAL` = 1 
| Instrument settles through perpetual funding cycles 
|


| `DAILY` = 2 
| Instrument settles at an expiry date, marked as a daily instrument 
|


| `WEEKLY` = 3 
| Instrument settles at an expiry date, marked as a weekly instrument 
|


| `MONTHLY` = 4 
| Instrument settles at an expiry date, marked as a monthly instrument 
|


| `QUARTERLY` = 5 
| Instrument settles at an expiry date, marked as a quarterly instrument 
|


Success


**Full Response**
`{
    "result": [{
        "instrument": "BTC_USDT_Perp",
        "instrument_hash": "0x030501",
        "base": "BTC",
        "quote": "USDT",
        "kind": "PERPETUAL",
        "venues": ["ORDERBOOK"],
        "settlement_period": "PERPETUAL",
        "base_decimals": 3,
        "quote_decimals": 3,
        "tick_size": "0.01",
        "min_size": "0.01",
        "create_time": "1697788800000000000",
        "max_position_size": "100.0",
        "funding_interval_hours": 8,
        "adjusted_funding_rate_cap": 2.5,
        "adjusted_funding_rate_floor": -2.5,
        "min_notional": "20.0"
    }]
}`
**Lite Response**
`{
    "r": [{
        "i": "BTC_USDT_Perp",
        "ih": "0x030501",
        "b": "BTC",
        "q": "USDT",
        "k": "PERPETUAL",
        "v": ["ORDERBOOK"],
        "sp1": "PERPETUAL",
        "bd": 3,
        "qd": 3,
        "ts": "0.01",
        "ms": "0.01",
        "ct": "1697788800000000000",
        "mp": "100.0",
        "fi": 8,
        "af": 2.5,
        "af1": -2.5,
        "mn": "20.0"
    }]
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/instruments' \
--data '{
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "is_active": true,
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instruments",
    "params": {
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "is_active": true,
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/instruments' \
--data '{
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "ia": true,
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instruments",
    "p": {
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "ia": true,
        "l": 500
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/instruments' \
--data '{
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "is_active": true,
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instruments",
    "params": {
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "is_active": true,
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/instruments' \
--data '{
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "ia": true,
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instruments",
    "p": {
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "ia": true,
        "l": 500
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/instruments' \
--data '{
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "is_active": true,
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instruments",
    "params": {
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "is_active": true,
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/instruments' \
--data '{
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "ia": true,
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instruments",
    "p": {
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "ia": true,
        "l": 500
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/instruments' \
--data '{
    "kind": ["PERPETUAL"],
    "base": ["BTC", "ETH"],
    "quote": ["USDT", "USDC"],
    "is_active": true,
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/instruments",
    "params": {
        "kind": ["PERPETUAL"],
        "base": ["BTC", "ETH"],
        "quote": ["USDT", "USDC"],
        "is_active": true,
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/instruments' \
--data '{
    "k": ["PERPETUAL"],
    "b": ["BTC", "ETH"],
    "q": ["USDT", "USDC"],
    "ia": true,
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/instruments",
    "p": {
        "k": ["PERPETUAL"],
        "b": ["BTC", "ETH"],
        "q": ["USDT", "USDC"],
        "ia": true,
        "l": 500
    },
    "i": 123
}
' -w 360`


### Get Currency

`FULL ENDPOINT: full/v1/currency
LITE ENDPOINT: lite/v1/currency`
RequestResponseErrorsTry it out


[ApiGetCurrencyRequest](/../../schemas/api_get_currency_request)


Fetch all currencies


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


[ApiGetCurrencyResponse](/../../schemas/api_get_currency_response)


The list of currencies


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [CurrencyDetail] 
| True 
| The list of currencies 
|


[CurrencyDetail](/../../schemas/currency_detail)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| id`i` 
| integer 
| True 
| The integer value of the currency 
|


| symbol`s` 
| string 
| True 
| The name of the currency 
|


| balance_decimals`bd` 
| integer 
| True 
| The balance decimals of the currency 
|


| quantity_multiplier`qm` 
| string 
| True 
| The quantity multiplier of the currency 
|


Success


**Full Response**
`{
    "result": [{
        "id": 3,
        "symbol": "USDT",
        "balance_decimals": 6,
        "quantity_multiplier": 1000000
    }]
}`
**Lite Response**
`{
    "r": [{
        "i": 3,
        "s": "USDT",
        "bd": 6,
        "qm": 1000000
    }]
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1004 
| 404 
| Data Not Found 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/currency' \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/currency",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/currency' \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/currency",
    "p": {
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/currency' \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/currency",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/currency' \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/currency",
    "p": {
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/currency' \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/currency",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/currency' \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/currency",
    "p": {
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/currency' \
--data '{
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/currency",
    "params": {
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/currency' \
--data '{
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/currency",
    "p": {
    },
    "i": 123
}
' -w 360`


### Get Margin Rules

`FULL ENDPOINT: full/v1/margin_rules
LITE ENDPOINT: lite/v1/margin_rules`
RequestResponseErrorsTry it out


[ApiGetMarginRulesRequest](/../../schemas/api_get_margin_rules_request)


API request payload to get margin rules for a particular instrument


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The instrument to query margin rules for 
|


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp"
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp"
}`


[ApiGetMarginRulesResponse](/../../schemas/api_get_margin_rules_response)


API response payload for margin rules of a particular instrument


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| instrument`i` 
| string 
| True 
| The instrument name 
|


| max_position_size`mp` 
| string 
| True 
| The maximum position size, expressed in base asset decimal units 
|


| risk_brackets`rb` 
| [RiskBracket] 
| True 
| List of risk brackets defining margin requirements at different notional tiers 
|


[RiskBracket](/../../schemas/risk_bracket)

| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| tier`t` 
| integer 
| True 
| 1-indexed tier number 
|


| notional_floor`nf` 
| string 
| True 
| Lower bound of notional value (inclusive) in quote currency 
|


| notional_cap`nc` 
| string 
| False`None` 
| Upper bound of notional value (exclusive) in quote currency, omitted for last tier 
|


| maintenance_margin_rate`mm` 
| string 
| True 
| Maintenance margin rate as a decimal (e.g., '0.01' for 1%) 
|


| initial_margin_rate`im` 
| string 
| True 
| Initial margin rate as a decimal (e.g., '0.02' for 2%) 
|


| max_leverage`ml` 
| integer 
| True 
| Maximum leverage allowed at this tier (floor of 1 / initial_margin_rate) 
|


| cumulative_maintenance_amount`cm` 
| string 
| True 
| Cumulative maintenance margin amount in quote currency 
|


Success


**Full Response**
`{
    "instrument": "BTC_USDT_Perp",
    "max_position_size": "100.0",
    "risk_brackets": [{
        "tier": 1,
        "notional_floor": "0",
        "notional_cap": "600000",
        "maintenance_margin_rate": "0.01",
        "initial_margin_rate": "0.02",
        "max_leverage": 50,
        "cumulative_maintenance_amount": "0"
    }]
}`
**Lite Response**
`{
    "i": "BTC_USDT_Perp",
    "mp": "100.0",
    "rb": [{
        "t": 1,
        "nf": "0",
        "nc": "600000",
        "mm": "0.01",
        "im": "0.02",
        "ml": 50,
        "cm": "0"
    }]
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 3000 
| 400 
| Instrument is invalid 
|


| 1004 
| 404 
| Data Not Found 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/margin_rules' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/margin_rules",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/margin_rules' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/margin_rules",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/margin_rules' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/margin_rules",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/margin_rules' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/margin_rules",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/margin_rules' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/margin_rules",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/margin_rules' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/margin_rules",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/margin_rules' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/margin_rules",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/margin_rules' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/margin_rules",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


## Ticker


### Mini Ticker

`FULL ENDPOINT: full/v1/mini
LITE ENDPOINT: lite/v1/mini`
RequestResponseErrorsTry it out


[ApiMiniTickerRequest](/../../schemas/api_mini_ticker_request)


Retrieves a single mini ticker value for a single instrument. Please do not use this to repeatedly poll for data -- a websocket subscription is much more performant, and useful.


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


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp"
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp"
}`


[ApiMiniTickerResponse](/../../schemas/api_mini_ticker_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| MiniTicker 
| True 
| The mini ticker matching the request asset 
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


**Full Response**
`{
    "result": {
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
**Lite Response**
`{
    "r": {
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1004 
| 404 
| Data Not Found 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/mini' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/mini",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/mini' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/mini",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/mini' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/mini",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/mini' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/mini",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/mini' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/mini",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/mini' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/mini",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/mini' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/mini",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/mini' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/mini",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


### Ticker

`FULL ENDPOINT: full/v1/ticker
LITE ENDPOINT: lite/v1/ticker`
RequestResponseErrorsTry it out


[ApiTickerRequest](/../../schemas/api_ticker_request)


Retrieves a single ticker value for a single instrument. Please do not use this to repeatedly poll for data -- a websocket subscription is much more performant, and useful.


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


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp"
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp"
}`


[ApiTickerResponse](/../../schemas/api_ticker_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| Ticker 
| True 
| The mini ticker matching the request asset 
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


**Full Response**
`{
    "result": {
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
**Lite Response**
`{
    "r": {
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1004 
| 404 
| Data Not Found 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/ticker' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/ticker",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/ticker' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/ticker",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/ticker' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/ticker",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/ticker' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/ticker",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/ticker' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/ticker",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/ticker' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/ticker",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/ticker' \
--data '{
    "instrument": "BTC_USDT_Perp"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/ticker",
    "params": {
        "instrument": "BTC_USDT_Perp"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/ticker' \
--data '{
    "i": "BTC_USDT_Perp"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/ticker",
    "p": {
        "i": "BTC_USDT_Perp"
    },
    "i": 123
}
' -w 360`


## Orderbook


### Orderbook Levels

`FULL ENDPOINT: full/v1/book
LITE ENDPOINT: lite/v1/book`
RequestResponseErrorsTry it out


[ApiOrderbookLevelsRequest](/../../schemas/api_orderbook_levels_request)


Retrieves aggregated price depth for a single instrument, with a maximum depth of 10 levels. Do not use this to poll for data -- a websocket subscription is much more performant, and useful.


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


| depth`d` 
| integer 
| True 
| Depth of the order book to be retrieved (10, 50, 100, 500) 
|


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp",
    "depth": 50
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp",
    "d": 50
}`


[ApiOrderbookLevelsResponse](/../../schemas/api_orderbook_levels_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| OrderbookLevels 
| True 
| The orderbook levels objects matching the request asset 
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


**Full Response**
`{
    "result": {
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
**Lite Response**
`{
    "r": {
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1004 
| 404 
| Data Not Found 
|


| 3000 
| 400 
| Instrument is invalid 
|


| 3031 
| 400 
| Depth is invalid 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/book' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "depth": 50
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/book",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "depth": 50
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/book' \
--data '{
    "i": "BTC_USDT_Perp",
    "d": 50
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/book",
    "p": {
        "i": "BTC_USDT_Perp",
        "d": 50
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/book' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "depth": 50
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/book",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "depth": 50
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/book' \
--data '{
    "i": "BTC_USDT_Perp",
    "d": 50
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/book",
    "p": {
        "i": "BTC_USDT_Perp",
        "d": 50
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/book' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "depth": 50
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/book",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "depth": 50
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/book' \
--data '{
    "i": "BTC_USDT_Perp",
    "d": 50
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/book",
    "p": {
        "i": "BTC_USDT_Perp",
        "d": 50
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/book' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "depth": 50
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/book",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "depth": 50
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/book' \
--data '{
    "i": "BTC_USDT_Perp",
    "d": 50
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/book",
    "p": {
        "i": "BTC_USDT_Perp",
        "d": 50
    },
    "i": 123
}
' -w 360`


## Trade


### Trade

`FULL ENDPOINT: full/v1/trade
LITE ENDPOINT: lite/v1/trade`
RequestResponseErrorsTry it out


[ApiTradeRequest](/../../schemas/api_trade_request)


Retrieves up to 1000 of the most recent trades in any given instrument. Do not use this to poll for data -- a websocket subscription is much more performant, and useful.
This endpoint offers public trading data, use the Trading APIs instead to query for your personalized trade tape.


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
| The limit to query for. Defaults to 500; Max 1000 
|


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp",
    "limit": 500
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp",
    "l": 500
}`


[ApiTradeResponse](/../../schemas/api_trade_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [Trade] 
| True 
| The public trades matching the request asset 
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


**Full Response**
`{
    "result": [{
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
    }]
}`
**Lite Response**
`{
    "r": [{
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
    }]
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/trade' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/trade' \
--data '{
    "i": "BTC_USDT_Perp",
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade",
    "p": {
        "i": "BTC_USDT_Perp",
        "l": 500
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/trade' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/trade' \
--data '{
    "i": "BTC_USDT_Perp",
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade",
    "p": {
        "i": "BTC_USDT_Perp",
        "l": 500
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/trade' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/trade' \
--data '{
    "i": "BTC_USDT_Perp",
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade",
    "p": {
        "i": "BTC_USDT_Perp",
        "l": 500
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/trade' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "limit": 500
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "limit": 500
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/trade' \
--data '{
    "i": "BTC_USDT_Perp",
    "l": 500
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade",
    "p": {
        "i": "BTC_USDT_Perp",
        "l": 500
    },
    "i": 123
}
' -w 360`


### Trade History

`FULL ENDPOINT: full/v1/trade_history
LITE ENDPOINT: lite/v1/trade_history`
RequestResponseErrorsTry it out


[ApiTradeHistoryRequest](/../../schemas/api_trade_history_request)


Perform historical lookup of public trades in any given instrument.
This endpoint offers public trading data, use the Trading APIs instead to query for your personalized trade tape.
Only data from the last three months will be retained.

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


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| start_time`st` 
| string 
| False`0` 
| The start time to apply in nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned 
|


| end_time`et` 
| string 
| False`now()` 
| The end time to apply in nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned 
|


| limit`l` 
| integer 
| False`500` 
| The limit to query for. Defaults to 500; Max 1000 
|


| cursor`c` 
| string 
| False`''` 
| The cursor to indicate when to start the query from 
|


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}`


[ApiTradeHistoryResponse](/../../schemas/api_trade_history_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [Trade] 
| True 
| The public trades matching the request asset 
|


| next`n` 
| string 
| False`''` 
| The cursor to indicate when to start the next query from 
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


**Full Response**
`{
    "result": [{
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
    }],
    "next": "Qw0918="
}`
**Lite Response**
`{
    "r": [{
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
    }],
    "n": "Qw0918="
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/trade_history' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade_history",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/trade_history' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade_history",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/trade_history' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade_history",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/trade_history' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade_history",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/trade_history' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade_history",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/trade_history' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade_history",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/trade_history' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/trade_history",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/trade_history' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/trade_history",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


## Candlestick


### Candlestick

`FULL ENDPOINT: full/v1/kline
LITE ENDPOINT: lite/v1/kline`
RequestResponseErrorsTry it out


[ApiCandlestickRequest](/../../schemas/api_candlestick_request)


Kline/Candlestick bars for an instrument. Klines are uniquely identified by their instrument, type, interval, and open time.

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


| start_time`st` 
| string 
| False`0` 
| Start time of kline data in unix nanoseconds 
|


| end_time`et` 
| string 
| False`now()` 
| End time of kline data in unix nanoseconds 
|


| limit`l` 
| integer 
| False`500` 
| The limit to query for. Defaults to 500; Max 1000 
|


| cursor`c` 
| string 
| False`''` 
| The cursor to indicate when to start the query from 
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


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp",
    "interval": "CI_1M",
    "type": "TRADE",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp",
    "i1": "CI_1M",
    "t": "TRADE",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}`


[ApiCandlestickResponse](/../../schemas/api_candlestick_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [Candlestick] 
| True 
| The candlestick result set for given interval 
|


| next`n` 
| string 
| False`''` 
| The cursor to indicate when to start the next query from 
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


**Full Response**
`{
    "result": [{
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
    }],
    "next": "Qw0918="
}`
**Lite Response**
`{
    "r": [{
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
    }],
    "n": "Qw0918="
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/kline' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "interval": "CI_1M",
    "type": "TRADE",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/kline",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "interval": "CI_1M",
        "type": "TRADE",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/kline' \
--data '{
    "i": "BTC_USDT_Perp",
    "i1": "CI_1M",
    "t": "TRADE",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/kline",
    "p": {
        "i": "BTC_USDT_Perp",
        "i1": "CI_1M",
        "t": "TRADE",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/kline' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "interval": "CI_1M",
    "type": "TRADE",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/kline",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "interval": "CI_1M",
        "type": "TRADE",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/kline' \
--data '{
    "i": "BTC_USDT_Perp",
    "i1": "CI_1M",
    "t": "TRADE",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/kline",
    "p": {
        "i": "BTC_USDT_Perp",
        "i1": "CI_1M",
        "t": "TRADE",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/kline' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "interval": "CI_1M",
    "type": "TRADE",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/kline",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "interval": "CI_1M",
        "type": "TRADE",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/kline' \
--data '{
    "i": "BTC_USDT_Perp",
    "i1": "CI_1M",
    "t": "TRADE",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/kline",
    "p": {
        "i": "BTC_USDT_Perp",
        "i1": "CI_1M",
        "t": "TRADE",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/kline' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "interval": "CI_1M",
    "type": "TRADE",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": ""
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/kline",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "interval": "CI_1M",
        "type": "TRADE",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": ""
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/kline' \
--data '{
    "i": "BTC_USDT_Perp",
    "i1": "CI_1M",
    "t": "TRADE",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": ""
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/kline",
    "p": {
        "i": "BTC_USDT_Perp",
        "i1": "CI_1M",
        "t": "TRADE",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": ""
    },
    "i": 123
}
' -w 360`


## Settlement


### Funding Rate

`FULL ENDPOINT: full/v1/funding
LITE ENDPOINT: lite/v1/funding`
RequestResponseErrorsTry it out


[ApiFundingRateRequest](/../../schemas/api_funding_rate_request)


Lookup the historical funding rate of a perpetual future.

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


| instrument`i` 
| string 
| True 
| The readable instrument name:Perpetual: `ETH_USDT_Perp`Future: `BTC_USDT_Fut_20Oct23`Call: `ETH_USDT_Call_20Oct23_2800`Put: `ETH_USDT_Put_20Oct23_2800` 
|


| start_time`st` 
| string 
| False`0` 
| Start time of funding rate in unix nanoseconds 
|


| end_time`et` 
| string 
| False`now()` 
| End time of funding rate in unix nanoseconds 
|


| limit`l` 
| integer 
| False`500` 
| The limit to query for. Defaults to 500; Max 1000 
|


| cursor`c` 
| string 
| False`''` 
| The cursor to indicate when to start the query from 
|


| agg_type`at` 
| FundingRateAggregationType 
| False`'FUNDING_INTERVAL'` 
| Aggregation method for historical funding rate observations. Defaults to using the instrument-specific funding interval. 
|


[FundingRateAggregationType](/../../schemas/funding_rate_aggregation_type)

Specifies different methods of aggregating historical funding rates


| Value 
| Description 
|


| `FUNDING_INTERVAL` = 1 
| Default value -- one record returned per funding interval. Query instruments endpoint to learn funding interval of each instrument. 
|


| `ONE_HOURLY` = 2 
| Returns one record per hour -- normalizes all funding rates to 1h durations, so `fundingRate`  value is cumulative and can exceed a funding interval's configured cap / floor. 
|


| `FOUR_HOURLY` = 3 
| Returns one record per 4 hours -- normalizes all funding rates to 4h durations, so `fundingRate`  value is cumulative and can exceed a funding interval's configured cap / floor. 
|


| `EIGHT_HOURLY` = 4 
| Returns one record for eight hours -- normalizes all funding rates to 8h durations, so `fundingRate`  value is cumulative and can exceed a funding interval's configured cap / floor. 
|


Query


**Full Request**
`{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "agg_type": "FUNDING_INTERVAL"
}`
**Lite Request**
`{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "at": "FUNDING_INTERVAL"
}`


[ApiFundingRateResponse](/../../schemas/api_funding_rate_response)


| Name`Lite` 
| Type 
| Required`Default` 
| Description 
|


| result`r` 
| [ApiFundingRate] 
| True 
| The funding rate result set for given interval 
|


| next`n` 
| string 
| False`''` 
| The cursor to indicate when to start the next query from 
|


[ApiFundingRate](/../../schemas/api_funding_rate)

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


| funding_rate`fr` 
| string 
| True 
| The funding rate of the instrument, expressed in percentage points 
|


| funding_time`ft` 
| string 
| True 
| The funding timestamp of the funding rate, expressed in unix nanoseconds 
|


| mark_price`mp` 
| string 
| True 
| The mark price of the instrument at funding timestamp, expressed in `9` decimals 
|


| funding_rate_8_h_avg`fr1` 
| string 
| True 
| Deprecated: Refer to `funding_rate` instead. Will be removed in a future release. 
|


| funding_interval_hours`fi` 
| integer 
| True 
| Funding interval in hours (e.g. 1/4/8/etc). 
|


Success


**Full Response**
`{
    "result": [{
        "instrument": "BTC_USDT_Perp",
        "funding_rate": 0.0003,
        "funding_time": "1697788800000000000",
        "mark_price": "65038.01",
        "funding_rate_8_h_avg": 0.0003,
        "funding_interval_hours": 8
    }],
    "next": "Qw0918="
}`
**Lite Response**
`{
    "r": [{
        "i": "BTC_USDT_Perp",
        "fr": 0.0003,
        "ft": "1697788800000000000",
        "mp": "65038.01",
        "fr1": 0.0003,
        "fi": 8
    }],
    "n": "Qw0918="
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


| 1003 
| 400 
| Request could not be processed due to malformed syntax 
|


| 1006 
| 429 
| You have surpassed the allocated rate limit for your tier 
|


Failure


**Full Error Response**
`{
    "request_id":1,
    "code":1002,
    "message":"Internal Server Error",
    "status":500
}`
**Lite Error Response**
`{
    "ri":1,
    "c":1002,
    "m":"Internal Server Error",
    "s":500
}`


DEVSTAGINGTESTNETPROD


REST Full


`curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/funding' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "agg_type": "FUNDING_INTERVAL"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "agg_type": "FUNDING_INTERVAL"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/funding' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "at": "FUNDING_INTERVAL"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/funding",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "at": "FUNDING_INTERVAL"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/funding' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "agg_type": "FUNDING_INTERVAL"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "agg_type": "FUNDING_INTERVAL"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/funding' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "at": "FUNDING_INTERVAL"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/funding",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "at": "FUNDING_INTERVAL"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.testnet.grvt.io/full/v1/funding' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "agg_type": "FUNDING_INTERVAL"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "agg_type": "FUNDING_INTERVAL"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.testnet.grvt.io/lite/v1/funding' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "at": "FUNDING_INTERVAL"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/funding",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "at": "FUNDING_INTERVAL"
    },
    "i": 123
}
' -w 360`


REST Full


`curl --location 'https://market-data.grvt.io/full/v1/funding' \
--data '{
    "instrument": "BTC_USDT_Perp",
    "start_time": "1697788800000000000",
    "end_time": "1697788800000000000",
    "limit": 500,
    "cursor": "",
    "agg_type": "FUNDING_INTERVAL"
}
'`


JSONRPC Full


`wscat -c "wss://market-data.grvt.io/ws/full" \
-x '
{
    "jsonrpc": "2.0",
    "method": "v1/funding",
    "params": {
        "instrument": "BTC_USDT_Perp",
        "start_time": "1697788800000000000",
        "end_time": "1697788800000000000",
        "limit": 500,
        "cursor": "",
        "agg_type": "FUNDING_INTERVAL"
    },
    "id": 123
}
' -w 360`


REST Lite


`curl --location 'https://market-data.grvt.io/lite/v1/funding' \
--data '{
    "i": "BTC_USDT_Perp",
    "st": "1697788800000000000",
    "et": "1697788800000000000",
    "l": 500,
    "c": "",
    "at": "FUNDING_INTERVAL"
}
'`


JSONRPC Lite


`wscat -c "wss://market-data.grvt.io/ws/lite" \
-x '
{
    "j": "2.0",
    "m": "v1/funding",
    "p": {
        "i": "BTC_USDT_Perp",
        "st": "1697788800000000000",
        "et": "1697788800000000000",
        "l": 500,
        "c": "",
        "at": "FUNDING_INTERVAL"
    },
    "i": 123
}
' -w 360`