<!-- markdownlint-disable MD014 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD029 -->

<div align="center">

<h1 style="font-size: 2.5rem; font-weight: bold;">Keypom [Redacted] Event App</h1>

  <p>
    <strong>Modular PWA with Keypom ticketing for <a href="https://redactedbangkok.ai/" target="_blank">[Redacted] Event</a>.</strong>
  </p>

</div>

<details>
  <summary>Table of Contents</summary>

- [Getting Started](#getting-started)
  - [Installing dependencies](#installing-dependencies)
  - [Running the app](#running-the-app)
  - [Building for production](#building-for-production)
  - [Running tests](#running-tests)
- [Contributing](#contributing)

</details>

## Getting Started

### Installing dependencies

```bash
pnpm install
```

### Running the app

First, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.

### Building for production

```bash
pnpm run build
```

To analyze the production build bundle using [vite-bundle-visualizer](https://www.npmjs.com/package/vite-bundle-visualizer), run:

```bash
pnpm run build:analyze
```

### Running tests

```bash
pnpm run test
```

See the full [testing guide](./playwright-tests/README.md).

## Project Structure

This project is a [Vite.js](https://vitejs.dev/) app made possible by [Keypom](https://github.com/keypom/keypom) contracts.

It uses [Zustand](https://github.com/pmndrs/zustand) for global state management, [TanStack Query](https://github.com/TanStack/query) for asynchronous data fetching, and [ChakraUI](https://chakra-ui.com/) for modular and customizable styles.

### Routes

Routes are defined using [React Router v6](https://reactrouter.com/en/main) in `src/router.tsx`. The routing structure is split into two core user functionalities: **sponsor/admin flows** and **ticketed user flows**.

- Routes that do not require authentication can be configured in `src/constants/common.ts` under `UNAUTHENTICATED_ROUTES`.
- Routes that should not render the App Footer can be configured in `src/constants/common.ts` under `HIDDEN_FOOTER_ROUTES`.

### Global State

The application uses [Zustand](https://github.com/pmndrs/zustand) for state management. This handles the ticketed user's credentials, event data, and modules for handling modal states.

The state is stored in `src/stores`. The most important is `event-credentials`, which manages the `eventId` and `secretKey` derived from the user's ticket.

### Hooks

The application utilizes React hooks for managing various data-fetching and parameter extraction tasks related to event tickets and user credentials.

The hooks are located in `src/hooks`:

- `useConferenceData`: Fetches conference-related data such as ticket info, drop info, key info, and event info based on the provided or stored secret key.
- `useTicketClaimParams`: Extracts `dropId` and `secretKey` from the URL parameters and hash when claiming a ticket.
- `useTicketScanningParams`: Parses the `funderId` and `eventId` from the URL parameters for scanning tickets.
- `useAccountData`: Retrieves account information (account ID, display name, and balance) using the secret key.
- `useConferenceClaimParams`: Manages ticket claim credentials, storing `dropId` and `secretKey` in local storage if found in the URL.

### PWA

To enhance offline capabilities and provide a better user experience, this app is structured as a [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA) using [@vite-pwa/plugin](https://vite-pwa-org.netlify.app/). The PWA setup ensures that essential assets are cached and available even when the user is offline, improving reliability and performance.

Some helpful commands include:

- `pnpm run generate-pwa-assets`: This command uses [@vite-pwa/assets-generator](https://vite-pwa-org.netlify.app/assets-generator/) to automatically generate and optimize icons, splash screens, and other assets necessary for PWA functionality across various devices and screen sizes.

## Customizing the app

This application was designed in such a way to be easy for most customizations.

### Theme

You can customize the **Chakra UI** theme and components in `src/theme`.

- **Theme:** Modify colors, fonts, and spacing in the theme configuration.
- **Components:** Customize icons, buttons, layouts, etc. These will reflect across the app.

### Constants

You can customize the app's contracts, environment, and authentication in `src/common/constants`.

- **Contracts:** Update the contract addresses for testnet, mainnet, and other environments.
- **Routes:** Modify routes for controlling access and footer visibility.
- **Environment Variables:** Set up network IDs and API keys.

### Assets

Replace existing assets with new ones by dropping images with the same names in the `/public/assets` folder.

```txt
├── background.webp
├── boxes-background.webp
├── claim-blocks.webp
├── custom-button-bg.webp
├── image-fallback.png
├── lines-bg.webp
├── logo.webp
├── scan-bg.webp
├── wallet-bg.webp
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you're interested in contributing to this project, please read the [contribution guide](./CONTRIBUTING).

<div align="right">
<a href="https://nearbuilders.org" target="_blank">
<img
  src="https://builders.mypinata.cloud/ipfs/QmWt1Nm47rypXFEamgeuadkvZendaUvAkcgJ3vtYf1rBFj"
  alt="Near Builders"
  height="40"
/>
</a>
</div>
