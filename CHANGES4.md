Frontend UX & Interaction Blueprint
===================================

1\. Objective
-------------

This document provides a detailed technical specification for implementing a superior user experience (UX) and sophisticated user interface (UI) for the 1inch Fusion+ Resolver dApp. The goal is to move beyond a basic functional interface to a polished, intuitive, and trustworthy application that guides the user seamlessly through the complex, multi-stage swap process.

This blueprint focuses on state-driven rendering, micro-interactions, and clear communication during asynchronous waiting periods.

2\. Core UX Principle: The State-Driven Interface
-------------------------------------------------

The entire UI will be a direct reflection of the state managed within the **`ExchangeStore`**. We will not use local component state (`useState`) for any data related to the swap lifecycle. The `swapStatus` observable in `ExchangeStore` will be the primary driver for all conditional rendering.

**Key `swapStatus` values and their UI implications:**

-   **`IDLE`**: The default state. The swap input form is active.

-   **`QUOTING`**: A quote is being fetched. The form inputs and "Get Quote" button will be disabled, and a spinner will be shown.

-   **`QUOTED`**: A quote has been received. The quote details are displayed, and the "Confirm Swap" button is enabled.

-   **`INITIATING`**: The user has confirmed the swap. A full-screen overlay or modal appears with a message like "Contacting resolver to prepare your swap..."

-   **`PENDING_DEPOSIT`**: The backend has created the HTLC. The UI transitions to the "BTC Deposit View."

-   **`BTC_CONFIRMING`**: The backend has seen the deposit but is waiting for confirmations. The "Status Timeline" becomes the primary UI element.

-   **`EVM_FULFILLING`**: BTC is confirmed. The timeline updates to show the EVM leg is in progress.

-   **`COMPLETED`**: The swap is finished. A success summary view is displayed.

-   **`ERROR`**: An error occurred. A clear error message is displayed with actionable next steps.

3\. Component-Level UX Implementation
-------------------------------------

### 3.1. Swap Input Component (`QuickActionsSection.js`)

This component must be intelligent and guide the user, preventing invalid states.

-   **Dynamic Button Logic:** The primary action button will change its text and state based on the `ExchangeStore`.

    -   **Initial State:** Button is disabled with text "Enter an amount".

    -   **Amount Entered:** Button becomes enabled with text "Get Quote".

    -   **`onClick`:** Triggers `exchangeStore.fetchQuote()`.

    -   **During `QUOTING`:** Button is disabled with a spinner and text "Getting Quote...".

    -   **`QUOTED` State:** The button text changes to "Confirm Swap". Its `onClick` handler now triggers `exchangeStore.initiateBtcSwap()`.

-   **Real-time Validation:** Implement `onChange` handlers for input fields that provide immediate feedback for invalid inputs (e.g., insufficient balance, non-numeric input) by showing a subtle red border and a small error message below the input field.

-   **Debouncing:** The "Get Quote" action should be debounced. If the user is typing quickly, don't fire off an API request for every keystroke. Wait until they have paused for ~300ms before enabling the quote button or auto-fetching a quote.

### 3.2. Status Timeline Component (`StatusSection.js`) - **CRITICAL UX ELEMENT**

This component is the user's anchor during the long waiting period. It must be detailed, reactive, and transparent.

-   **Visual Design:** Implement as a vertical stepper with 4-5 distinct stages. Each stage should have an icon, a title, and a dynamic description.

-   **Stateful Styling:** Each step will have visual states driven by the `exchangeStore.swapStatus`:

    -   **`complete`**: Icon changes to a checkmark (✓), line connecting to it is solid.

    -   **`active`**: Icon is a pulsing circle (CSS animation), text is highlighted. This is the current stage.

    -   **`pending`**: Icon and text are greyed out.

-   **Dynamic Content & Links:**

    1.  **Awaiting Deposit:** "Please send the exact BTC amount to the provided address."

    2.  **Confirming Deposit:** "Deposit seen! Waiting for confirmations: **{exchangeStore.confirmationCount} / 3**. <br/> <a href='...' target='_blank'>View on Block Explorer</a>"

    3.  **Fulfilling on L2:** "BTC locked. Finalizing your swap on Polygon... <br/> <a href='...' target='_blank'>View EVM Transaction</a>"

    4.  **Complete:** "Success! Your swap is complete."

-   **Implementation:** This component will be a MobX `observer` that re-renders whenever `swapStatus` or any other relevant observable (like `evmTxHash`) changes in the `ExchangeStore`.

### 3.3. BTC Deposit View/Modal

When `swapStatus` becomes `PENDING_DEPOSIT`, the main UI should be replaced by a focused "Deposit" view.

-   **QR Code:** Use a library like `qrcode.react` to generate a large, easily scannable QR code for the `exchangeStore.btcDepositAddress`.

-   **Copy-to-Clipboard Functionality:**

    -   Display the full address text next to a "Copy" icon.

    -   On click, execute `navigator.clipboard.writeText(...)`.

    -   Provide immediate visual feedback: change the icon to a checkmark and the text to "Copied!" for 2 seconds.

-   **Clear Instructions:** Use large, bold text to emphasize critical information:

    -   "**Step 1: Send EXACTLY `0.1` BTC**"

    -   "**Step 2: DO NOT close this window.**"

    -   "This address is for single use only. Do not send funds to it again."

-   **Expiration Timer:** Display a countdown timer showing when the quote/swap will expire (e.g., "This address will expire in `29:59`").

4\. Micro-interactions and Animations
-------------------------------------

Subtle animations provide a feeling of a high-quality, responsive application. Use a library like **`Framer Motion`** for easy implementation.

-   **Page Transitions:** When the UI transitions between major states (e.g., from Swap Form to Deposit View), use a gentle fade or slide animation.

-   **Component Mounting:** When new data arrives (like a quote), have the component gently animate in, rather than just appearing.

-   **Button Feedback:** All buttons must have clear `hover` and `active` (on-click) states (e.g., slightly change background color or scale).

-   **Loading States:** Instead of just showing a spinner, use "skeleton loaders" for UI elements that are waiting for data. This preserves the layout and prevents jarring content shifts.

5\. Error Handling UX
---------------------

How errors are presented is crucial for user trust.

-   **Toast Notifications (`react-hot-toast`):** Use for non-critical, temporary errors.

    -   **Example:** "Failed to fetch quote. The network may be busy. Retrying..."

    -   **Example:** "Wallet connection request was rejected."

-   **Modal Dialogs:** Use for critical, blocking errors that require user action.

    -   **Example:** "Swap Failed: The resolver was unable to fulfill your order on the EVM chain. Your BTC deposit was not affected. Please click 'Initiate Refund' after the timelock expires in `X` hours."

-   **Inline Errors:** Use for form validation, displayed directly below the relevant input field.

By implementing these detailed UX enhancements, the dApp will feel professional, trustworthy, and intuitive, significantly increasing its chances of impressing the judges and winning the hackathon.