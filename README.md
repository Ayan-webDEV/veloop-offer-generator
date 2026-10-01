# VELoop Rewards Offer Letter Generator

This version uses the supplied `demo_alpha.pdf` as the actual PDF template. It does **not** rasterize the template to PNG for generation, so the downloaded offer letter remains vector/sharp.

## Install

```bash
npm install
npm run dev
```

## Template behavior

- The original PDF artwork, icons, QR, logo, signature, stamp and footer remain in the source PDF.
- The supplied PDF intentionally leaves the first opening line blank. The application writes that missing line using the embedded Calibri/Calibri Bold fonts extracted from the source PDF.
- The following `VELOOP REWARDS...` paragraph lines are untouched.
- Intern name is automatically uppercased.
- Issue date is automatically the current date in Asia/Kolkata.
- Start date is selected separately.
- Intern ID is generated locally in sequence.
- Stipend is fixed to `UnPaid`.
