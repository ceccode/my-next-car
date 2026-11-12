# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (mobile-first single-page app)

## Stack

React 19, Vite, TypeScript, Tailwind CSS 4. Frontend only, no backend. Deployed on Netlify as a static SPA.

## Users and job

Italian consumers about to buy a vehicle (car, motorcycle, van, new or used). Two situations, served by the same flow:

- They are still dreaming about the car: they know roughly the price and want to see what it really costs with each way of paying.
- They already hold a dealer quote (monthly payment, down payment, balloon, buyout) and want to check whether it is a good deal against the alternatives.

The flow starts from the price alone; quote details are entered later, only by whoever has them.

## What the product does

Compares four ways to pay for the same vehicle: cash (contanti), traditional loan (finanziamento classico), balloon loan (finanziamento con maxirata) and financial leasing. The primary answer is the **total cost** of each option, made comparable at a glance. Every change recalculates instantly.

## Product truth to preserve

- Financial engine in `src/domain/financing/` is tested and authoritative; UI never re-implements math.
- Amounts in EUR including VAT, it-IT formatting, Italian copy.
- The TAEG shown is an estimate, never the official contract TAEG.
- Costs outside purchase and financing (fuel, insurance, maintenance, tax, depreciation) are out of scope and must be stated as such.
- The app never suggests real offers, market rates or incentive amounts; example values are labelled hypothetical.
- State persists in localStorage and can be shared through the URL hash.

## Accessibility

WCAG 2.2 AA. Fully usable by keyboard and screen reader, touch targets of at least 44px, respects reduced motion, works at 360px width.

## Voice

Plain Italian, second person (tu), no jargon without an inline explanation. Calm and honest: it helps people avoid a bad contract, it does not sell one.
