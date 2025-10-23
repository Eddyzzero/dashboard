# FinTrack — Gestion de finances personnelles (Angular)

Stack: Angular + TailwindCSS + DaisyUI + Firebase (Auth + Firestore) + GSAP + Chart.js

Quickstart

1. Install dependencies

```bash
npm install
```

2. Configure Firebase

- Copy `.env.example` to `.env` or fill `src/environments/environment.ts` with your Firebase config.
- Deploy rules by using Firebase CLI or use emulators for local development.

3. Tailwind setup

- Ensure `tailwindcss` and `daisyui` are installed. If not, run:

```bash
npm install -D tailwindcss postcss autoprefixer daisyui
npx tailwindcss init
```

- The project contains `tailwind.config.js` and `src/styles/theme.css` — ensure `angular.json` includes `src/styles/theme.css`.

4. Run the app

```bash
npm run start
```

Notes

- Replace demo collection paths (`demo_transactions`, `demo_categories`) with `users/{uid}/transactions` for real users.
- Services use Firebase modular SDK (v9+). Install Firebase:

```bash
npm install firebase
```

- Install GSAP and Chart.js:

```bash
npm install gsap chart.js
```

Security

- See `firestore.rules` for example rules that validate ownership and transaction data.

# DashboardFinances

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
