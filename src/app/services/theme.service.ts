import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


import * as Color from 'color';
import {GlobalFields} from '../GlobalFields';

const defaults = {
    primary: '#3880ff',
    secondary: '#4ca6ff',
    tertiary: '#8a7fff',
    success: '#40dc7e',
    warning: '#ffce00',
    danger: '#ff4c6a',
    dark: '#222428',
    medium: '#989aa2',
    light: '#f4f5f8'
};

function contrast(color, ratio = 10) {
    color = Color(color);
    return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}

function CSSTextGenerator(colors) {
    colors = { ...defaults, ...colors };

    const {
        primary,
        secondary,
        tertiary,
        success,
        warning,
        danger,
        dark,
        medium,
        light
    } = colors;

    const shadeRatio = 0.1;
    const tintRatio = 0.1;

    return `
    --ion-color-base: ${light};
    --ion-color-contrast: ${dark};

    --ion-color-primary: ${primary};
    --ion-color-primary-rgb: 56,128,255;
    --ion-color-primary-contrast: ${contrast(primary)};
    --ion-color-primary-contrast-rgb: 255,255,255;
    --ion-color-primary-shade:  ${Color(primary).darken(shadeRatio)};

    --ion-color-light-contrast: ${primary};
    --ion-color-light: ${primary};



    // omitted other styles, see full source code
`;
}


// Doc: https://angularfirebase.com/lessons/css-variables-in-ionic-4/?fbclid=IwAR24aJCajuVIrr3LwT7iyi78uiFdWaBhPbSvJaJ3NDj5dgDSGodjPbGP9z0

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {}

    // Override all global variables with a new theme
    setTheme(theme) {
        const cssText = CSSTextGenerator(theme);
        this.setGlobalCSS(cssText);
    }

    // Define a single CSS variable
    setVariable(name, value) {
        this.document.documentElement.style.setProperty(name, value);
    }

    private setGlobalCSS(css: string) {
        this.document.documentElement.style.cssText = css;
    }

    setGlobalFont(fontFamily: string) {
      let head: HTMLElement = <HTMLElement>document.getElementsByTagName("head")[0];
      console.log(head)
      if (head) {
        const linkTag1: HTMLLinkElement = document.createElement('link')
        linkTag1.rel = 'preconnect'
        linkTag1.href = 'https://fonts.gstatic.com'

        const linkTag2: HTMLLinkElement = document.createElement('link')
        linkTag2.rel = 'stylesheet'
        linkTag2.href = 'https://fonts.googleapis.com/css2?family=' + fontFamily.replace(' ', '+') + '&display=swap'

        head.appendChild(linkTag1);
        head.appendChild(linkTag2);

      }

      //Change Ionic variable
      document.documentElement.style.setProperty(`--ion-font-family`, this.getGlobalFontStyle());

    }

    getGlobalFontStyle(){
     if(GlobalFields.site_details && GlobalFields.site_details.customGoogleFontFamily)
      return "'" + GlobalFields.site_details.customGoogleFontFamily + "', sans-serif";
     else
      return "'Didact Gothic', sans-serif";

    }



}
