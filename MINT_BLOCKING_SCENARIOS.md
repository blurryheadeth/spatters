# Public Mint Blocking Scenarios - Comprehensive Analysis

## Design Principle
**CONSERVATIVE DEFAULT**: If any critical data is missing or uncertain, DEFAULT TO BLOCKING the mint interface.

## Critical Data Dependencies
1. `mintSelectionData` - Is someone currently selecting?
2. `pendingCommitData` - Is there a pending commit?
3. `totalSupply` - How many tokens minted?
4. `ownerReserve` - How many tokens reserved for owner?
5. `maxSupply` - What's the max supply?
6. `lastGlobalMintTime` - When was the last mint (for cooldown)?

## Blocking Logic Flow (Order of Checks)

### 1. Not Connected
**Check**: `!isConnected`
**Action**: Show "Connect wallet" message
**Conservative**: ✅ Blocks when not connected

### 2. Data Loading
**Check**: `!isDataLoaded && previewSeeds.length === 0`
**Definition**: `isDataLoaded = all 6 critical data points !== undefined`
**Action**: Show "Loading mint status..."
**Conservative**: ✅ Blocks until ALL data loaded

**Scenarios**:
| totalSupply | ownerReserve | maxSupply | lastGlobalMintTime | mintSelectionData | pendingCommitData | Result |
|-------------|--------------|-----------|-------------------|-------------------|-------------------|--------|
| undefined   | 30          | 999       | 0                 | [false, null, 0]  | [0,0,false,false] | BLOCKS (loading) ✅ |
| 50          | undefined   | 999       | 0                 | [false, null, 0]  | [0,0,false,false] | BLOCKS (loading) ✅ |
| 50          | 30          | undefined | 0                 | [false, null, 0]  | [0,0,false,false] | BLOCKS (loading) ✅ |
| 50          | 30          | 999       | undefined         | [false, null, 0]  | [0,0,false,false] | BLOCKS (loading) ✅ |
| 50          | 30          | 999       | 0                 | undefined         | [0,0,false,false] | BLOCKS (loading) ✅ |
| 50          | 30          | 999       | 0                 | [false, null, 0]  | undefined         | BLOCKS (loading) ✅ |

### 3. Owner Reserve Not Met
**Check**: `supply < reserve`
**Defaults**: `supply = totalSupply || 0`, `reserve = ownerReserve || 30`
**Action**: Show "Public minting not yet available"
**Conservative**: ✅ Since we require `totalSupply` and `ownerReserve` to be defined before reaching this check

**Scenarios**:
| totalSupply | ownerReserve | supply | reserve | Check Result | Action |
|-------------|--------------|--------|---------|--------------|--------|
| 0           | 30           | 0      | 30      | 0 < 30 = TRUE | BLOCKS ✅ |
| 29          | 30           | 29     | 30      | 29 < 30 = TRUE | BLOCKS ✅ |
| 30          | 30           | 30     | 30      | 30 < 30 = FALSE | Proceeds |
| 50          | 30           | 50     | 30      | 50 < 30 = FALSE | Proceeds |

### 4. Max Supply Reached
**Check**: `supply >= max`
**Defaults**: `max = maxSupply || 999`
**Action**: Show "All tokens have been minted!"
**Conservative**: ✅ Since we require `maxSupply` to be defined

**Scenarios**:
| totalSupply | maxSupply | supply | max | Check Result | Action |
|-------------|-----------|--------|-----|--------------|--------|
| 999         | 999       | 999    | 999 | 999 >= 999 = TRUE | BLOCKS ✅ |
| 1000        | 999       | 1000   | 999 | 1000 >= 999 = TRUE | BLOCKS ✅ |
| 50          | 999       | 50     | 999 | 50 >= 999 = FALSE | Proceeds |

### 5. Mint Selection In Progress or Pending Owner Commit
**Check**: `(mintSelectionInProgress || hasPendingOwnerCommit) && !isCurrentUserPending && previewSeeds.length === 0`
**Action**: Show "Minting Temporarily Blocked"
**Conservative**: ✅ Blocks if EITHER condition is true

**Sub-scenarios**:

#### 5a. Active Mint Selection (Step 2 or 3 in progress)
**When**: Someone has called `requestMint` or `requestOwnerMint`
**Contract State**: `activeMintRequester != address(0)`
**Frontend**: `mintSelectionData = [true, requesterAddress, expiryTime]`

| User Type | activeMintRequester | isCurrentUserPending | Result |
|-----------|---------------------|---------------------|--------|
| Owner (not minting) | 0xOtherUser | false | BLOCKS ✅ |
| Non-owner | 0xOwner | false | BLOCKS ✅ |
| Same user (refresh) | 0xCurrentUser | true | ALLOWS (their mint) ✅ |

#### 5b. Pending Owner Commit (Step 1 complete, Step 2 not started)
**When**: Owner has called `commitOwnerMint` but not yet `requestOwnerMint`
**Contract State**: 
- `pendingCommit.timestamp > 0` 
- `pendingCommit.isOwnerMint = true`
- `activeMintRequester = owner` (set in commitOwnerMint)
**Frontend**: 
- `pendingCommitData = [block, timestamp > 0, hasCustomPalette, true]`
- `mintSelectionData = [true, owner, expiryTime]`

| User Type | hasPendingOwnerCommit | mintSelectionInProgress | isCurrentUserPending | Result |
|-----------|----------------------|------------------------|---------------------|--------|
| Owner | true | true | true | ALLOWS (their mint) ✅ |
| Non-owner | true | true | false | BLOCKS ✅ |

**Note**: Both `mintSelectionInProgress` AND `hasPendingOwnerCommit` would be true in this case, providing double protection.

### 6. Cooldown Active
**Check**: `isCooldownActive && previewSeeds.length === 0 && !isCurrentUserPending`
**Calculation**: `lastGlobalMintTime + GLOBAL_COOLDOWN > currentTime`
**Action**: Show "Cooldown Active" with countdown
**Conservative**: ✅ Since we require `lastGlobalMintTime` to be defined

**Scenarios**:
| lastGlobalMintTime | currentTime | GLOBAL_COOLDOWN | isCooldownActive | Result |
|--------------------|-------------|-----------------|------------------|--------|
| now - 1 hour       | now         | 24 hours        | true             | BLOCKS ✅ |
| now - 25 hours     | now         | 24 hours        | false            | Proceeds |
| 0 (never minted)   | now         | 24 hours        | false            | Proceeds |

### 7. Mint UI Shown
**Condition**: All checks passed
**Requirements**:
- Connected ✅
- All data loaded ✅
- Public mint unlocked (supply >= reserve) ✅
- Supply not maxed (supply < max) ✅
- No active selection (or user's own) ✅
- No cooldown (or user's own pending) ✅

## Edge Cases - All Conservative ✅

### Race Conditions
1. **Page load, data loads in different order**
   - Result: Shows "Loading..." until ALL data ready ✅

2. **Owner commits, page refreshes mid-transaction**
   - `mintSelectionData` might load before `pendingCommitData`
   - Result: Shows "Loading..." until both ready ✅
   - Then: Both `mintSelectionInProgress=true` AND `hasPendingOwnerCommit=true` ✅

3. **Network delays, some queries slow**
   - Result: Shows "Loading..." for slower queries ✅

### Data Staleness
1. **Cached data shows no mint, but mint just started**
   - wagmi `staleTime: 0` forces fresh fetches for critical data
   - User can click "Refresh Status" to force re-fetch

2. **Transaction just confirmed, UI not updated yet**
   - User in middle of their own mint, has `previewSeeds.length > 0`
   - Blocking checks have `&& previewSeeds.length === 0`, so won't block their own flow ✅

### User Perspective Scenarios

#### Non-Owner Wallet
1. **Normal state, no active mints**
   - All data loaded → mint available if past reserve & cooldown ✅

2. **Owner is minting**
   - `mintSelectionInProgress=true` OR `hasPendingOwnerCommit=true` → BLOCKS ✅

3. **Another non-owner is minting**
   - `mintSelectionInProgress=true` → BLOCKS ✅

4. **24h cooldown active**
   - `isCooldownActive=true` → BLOCKS ✅

#### Owner Wallet
1. **Normal state, no active mints**
   - Sees both tabs (public & owner)
   - Public tab shows same logic as non-owner

2. **Owner starts mint, refreshes during step 1**
   - Landing page auto-switches to owner tab ✅
   - OwnerMint shows 30s countdown modal ✅
   - PublicMint (if owner switches tabs) shows "Temporarily Blocked" ✅

3. **Owner in preview selection**
   - `isCurrentUserPending=true` → bypasses blocking logic, shows their preview UI ✅

## Failure Modes - All Conservative ✅

| Failure | Default Behavior | Result |
|---------|-----------------|--------|
| RPC node down | All queries return undefined | Shows "Loading..." forever ✅ |
| Contract address wrong | Queries fail | Shows "Loading..." ✅ |
| Network congestion | Slow queries | Shows "Loading..." while waiting ✅ |
| Browser storage quota exceeded | sessionStorage fails | Consent still works, just asks again on refresh ✅ |
| Wallet disconnects mid-flow | `address` becomes undefined | Various checks fail → blocks ✅ |

## Conclusion
✅ **ALL undefined/uncertain scenarios default to BLOCKING**
✅ **Only shows mint UI when ALL 6 critical data points are loaded AND all blocking conditions are false**
✅ **User's own active mint bypasses blocking logic** (via `isCurrentUserPending` and `previewSeeds.length > 0`)
