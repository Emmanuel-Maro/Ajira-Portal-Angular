import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { SettingMenuItems } from './menu-items/setting';
import { NgSelectModule } from "@ng-select/ng-select";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NumberToWordsPipe } from './pipes/number-to-words.pipe';
import { DialogService } from './service/dialog.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SafePipe } from './pipes/SafePipe';
import { translocoLoader } from '../transloco.loader';
import { TranslocoModule, TranslocoConfig, TRANSLOCO_CONFIG } from '@ngneat/transloco';
import { CacheInterceptor } from './service/cache.interceptor';
import { HttpCacheService } from './service/cache.service';
import { SafeHtmlPipe } from './pipes/SafeHtmlPipe';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    SafePipe,
    SafeHtmlPipe,
    NumberToWordsPipe,
  ],
  exports: [
    CommonModule,
    TranslocoModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    SafePipe,
    SafeHtmlPipe,
    NumberToWordsPipe,
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule
   ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true },
    { provide: HTTP_INTERCEPTORS, useClass:CacheInterceptor, multi:true },
     HttpCacheService,
     MenuItems, 
     SettingMenuItems, 
     DialogService,
     translocoLoader,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ["en", "sw"],
        reRenderOnLangChange: true,
        fallbackLang: "en",
        defaultLang: "en"
      } as TranslocoConfig
    },
    ]
})
export class SharedModule { }
