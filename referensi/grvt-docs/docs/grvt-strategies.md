# GRVT Strategies - Gravity Markets API Docs

> Source  : https://api-docs.grvt.io/grvt_strategies/
> Fetched : 2026-04-07T15:12:41.003Z
> Engine  : MkDocs Material



# GRVT Strategies: API Usage Guide


## Overview


This document is for strategy managers who want to programmatically monitor and fulfill strategy requirements using GRVT’s strategy-monitoring APIs.


Endpoints referenced can be found [here](https://api-docs.grvt.io/trading_api/#vault)


## Strategy Creation


### Step 1: Become a strategy manager


To create a strategy:


- Go to the **Invest** page and click **Become a Strategy Manager**.

- You must invest a minimum of **1000 USDT** to activate your strategy.

- Strategy creation is currently limited to **whitelisted accounts**. To request access, [fill out this form](https://forms.gle/qmt8oW61Kef8ouodA).


For more details, see the [Strategy Setup Guide](https://help.grvt.io/en/articles/11640733-strategy-setup-guide-how-to-configure-fees-redemptions-and-rewards-on-grvt).


### Step 2: Switch to strategy trading account and start trading.


You would need to then switch to your strategy trading account. and the The UI (user center icon on top right) will show that you are now trading from a strategy.


Strategy trading accounts function like regular trading accounts but with key restrictions: you can only `invest` into your own strategy from your funding account, `redeem` shares for USDT to your trading account, and internal/external transfers via the [Transfer API](https://api-docs.grvt.io/trading_api/#transfer_1) are not allowed.


### Step 3: Invest and redeem from your own strategy.


You can invest and redeem from your own strategy. Investing allows you to add more capital to the strategy in exchange for shares, and redeeming allows you to redeem your own shares for USDT.


### Leverage Configuration


- Strategy trading accounts are held to a fixed opening leverage ratio of 5x (i.e., position size can be no larger than 5x of total equity).

- Like general trading accounts, liquidation occurs if the account's leverage ratio exceeds 100x (i.e., trading account sustains unrealized losses such that total equity falls under 0.01x of position size).


### Additional Margin Requirements


Strategy trading accounts have an additional margin requirement equal to the total value of urgent redemptions. The value of the additional margin requirement from urgent redemption requests can be read from the [Sub-Account Summary API](https://api-docs.grvt.io/trading_api/#sub-account-summary), via the `vault_im_additions` field.


For example, if Strategy A has 100k USDT in equity and 80k USDT in initial margin, and 30k USDT in redemptions become "urgent", the margin requirement rises to 110k USDT. Since this exceeds total equity, Strategy A is limited to risk-reducing orders only.


## Delist Triggers


GRVT delists strategies that fail to meet baseline standards of performance and/or care. Delisting is irreversible and happens in any of the following events:


### Automatic Delist Conditions


- **Share price falls below US$0.10** _(notable trigger: liquidation)_

- **Forced redemption fails for 48 hours**


Delisted strategies cannot receive investment, nor will they be able to update fields such as name, description, or redemption window.


### Avoiding Price-Triggered Delists


We compute your Share Price as follows:


`Share Price = Strategy Equity / Share Count`
If at risk of a share price-based delist, you have the following options:


- Burn your shares and reduce total share count via the [Burn API](https://api-docs.grvt.io/trading_api/#vault-burn-tokens)

- Invest further in your strategy to raise strategy equity


### Avoiding Redemption-Triggered Delists


Look at our [dedicated section](#consequences-of-sustained-redemption-failure) for more details.


## Monitoring & Servicing Redemptions


GRVT provides an automated redemption-queueing system which fulfills redemption requests sequentially upon sufficient balance being available. This approach means you need only ensure sufficient balance to serve redemptions, without manually tracking and fulfilling individual redemption requests.


Investors (including you, the strategy manager) can create a redemption request via the [Redeem API](https://api-docs.grvt.io/trading_api/#vault-redeem).


### Calculating Balance Available for Automated Redemption


GRVT calculates a strategy's auto-redeemable balance as follows:


`Auto-Redeemable Balance = Available Balance - (Auto Redemption Barrier * Initial Margin)

where:
Available Balance = Total Equity - Initial Margin - max(Unrealized PnL, 0)
0.8x 
Intuitively, this balance is your strategy's equity in excess of initial margin requirements, buffering for unrealized losses and accounting for strategy-specific risk tolerance (in the form of the manager-defined auto redemption barrier – a larger barrier value is more conservative).


On each price tick, GRVT considers the redemption request at the head of a strategy's redemption queue and executes it if the strategy's balance available for automated redemption is at least as large as that request's value.


## Redemption Queue - Priority Assignment


Redemption Requests fall into 3 categories: **Urgent**, **Normal-Priority**, and **Pre-Minimum Age**.


### Urgent Redemption Requests


- Requests are urgent if their age exceeds 90% of your pre-defined maximum redemption period

- Urgent requests are always considered first, in FIFO order

- For strategies with urgent redemption requests, the oldest urgent redemption gets treated as the head of the queue


### Normal-Priority Redemption Requests


- Requests are normal-priority if they have not aged past the 90% threshold described above

- Normal-priority requests are considered in FIFO order, unless the FIFO head's requested redemption size is at least 5x larger than that of the smallest normal-priority request


#### Example


To begin, assume all requests are normal-priority:


**FIFO Ordering:** 1k → 50k → 100k → 20k → 10k → 25k

**Priority Ordering:** 1k → 10k → 50k → 20k → 100k → 25k


If, instead, the 1k and 50k requests were urgent, they would then be considered in FIFO order regardless of relative sizing:


**Result:** 1k → 50k → 10k → 20k → 100k → 25k


### Pre-Minimum Age Redemption Requests


- Requests are pre-minimum age if they are younger than your pre-defined minimum redemption period

- We track these requests upon investors creating the request, but make you aware of them only when they age past the minimum required age


## Strategy Manager Responsibilities


GRVT's [Redemption Queue API](https://api-docs.grvt.io/trading_api/#vault-redemption-queue) lets you:


- Track your strategy's redemption queue

- Ensure that you have sufficient auto-redeemable balance to service redemption requests in your queue before they exceed their maximum redemption period


### What happens if requests age past the maximum redemption period?


To ensure capital gets returned to investors where possible, GRVT applies **forced redemption** on any requests that exceed your stipulated redemption period. GRVT executes these requests for you even if you might have insufficient auto-redeemable balance (likely, given that the request failed to automatically redeem in the first place).


**Important:** Forced redemptions will deplete a strategy's equity balance.


### Could forced redemptions place me at risk of liquidation?


GRVT will not force redemptions if doing so would leave the strategy in negative available balance (calculated per the above formula), so as to avoid pushing distressed strategies into liquidation.


At this point, both you and your investor would begin receiving recurring email and UI notifications that your strategy is defaulting on redemption requests. You would need to either:


- Increase strategy equity (e.g., by investing further in your strategy, realizing profit on a position, etc.)

- Reduce margin requirements (e.g., by closing a losing position)


This would allow leverage to decrease sufficiently for GRVT to continue forcing redemptions. Our de-risking algorithm, when it becomes active, will automate this for you by bring you back to a healthy available balance (more details will become available following the launch of said de-risking algorithm).


All redemption requests will still need to be serviced in the order specified.


### Consequences of Sustained Redemption Failure


Leaving any given redemption request blocked on forced redemption for more than 48 hours would result in the strategy being delisted and unwound for maximum funds to be returned to shareholders.


## Strategy Permissions for Business accounts


We offer fine-grained permission-based access control for business accounts that would like to utilize this when interacting or creating strategies.


### A. Strategy Trading Account Permissions


These permissions are used to manage strategies by strategy managers.


- `Strategy Admin` (Same as Trading Admin)

- Can trade

- Can add and manage users

- Can invest and redeem

- Can burn shares

- Can close and delist a strategy

- Can create API keys


**Note:** A Funding Admin is inherently a Strategy Admin as well.


- `Trade` - Can trade

- `Transfer` - Not used for strategies


### B. Funding Account Permissions


These permissions are used to invest into strategies from the funding account.


- `Funding Admin`

- Can invest into strategies from funding and trading accounts

- Can redeem from strategies

- Can burn shares

- `Internal Transfer`, `External Transfer`, `Withdraw` - Cannot interact with strategies

- `Strategy Investor` - Can invest into strategies from the funding account