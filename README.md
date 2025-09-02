# DNTEL Insurance Claims Dashboard

A Next.js project for managing and displaying insurance claims data with a modern, responsive interface.

## Features

- **📊 Insurance Claims Table**: Interactive table displaying 300+ auto-generated insurance claims
- **🔄 Build-time Data Generation**: Leverages [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) to generate realistic dummy data at build time
- **💻 Responsive Design**: Built with Tailwind CSS for optimal viewing across devices
- **⚡ Static Generation**: Data is pre-generated for optimal performance and faster page loads
- **📋 Realistic Data**: Includes patient info, insurance carriers, claim statuses, sync statuses, and more

### Why Build-time Generation?

1. **Performance**: No runtime overhead for data generation
2. **Consistency**: Same dataset across all environments
3. **Static Optimization**: Leverages Next.js Static Site Generation (SSG)
4. **CDN Ready**: Can be deployed to static hosting services

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

To manually regenerate the insurance data:

```bash
npm run generate-data
```

The data generation happens automatically during the build process:

```bash
npm run build  # Runs prebuild script to generate fresh data
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the insurance claims dashboard.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── DataTable.tsx         # Main table component
│   ├── ClaimRow.tsx          # Individual row component
│   ├── TableFooter.tsx       # Pagination footer
│   └── columns/              # Column-specific components
├── data/
│   └── insurance-data.ts     # Auto-generated claims data (300 records)
└── fonts/                    # Custom PolySans font family
scripts/
└── generate-insurance-data.mjs  # Data generation script
```

## Tech Stack

- **Next.js 15** with Turbopack
- **React 19**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **@faker-js/faker** for realistic dummy data
- **Custom PolySans fonts**

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
