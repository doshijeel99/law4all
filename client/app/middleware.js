import { NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'hi', 'mr'];
const defaultLocale = 'en';

function getPreferredLocale(request) {
    const negotiator = new Negotiator({ headers: { 'accept-language': request.headers.get('accept-language') } });
    const languages = negotiator.languages();
    return match(languages, locales, defaultLocale);
}

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));
    if (pathnameHasLocale) return;

    const locale = getPreferredLocale(request);

    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        '/((?!_next).*)',
    ],
};
