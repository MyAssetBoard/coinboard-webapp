import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/header/header.component';
import { FooterComponent } from './modules/footer/footer.component';
import { CardblockComponent } from './modules/cardblock/cardblock.component';
import { FormblockComponent } from './modules/formblock/formblock.component';

describe('AppComponent', () => {
        beforeEach(async(() => {
                TestBed.configureTestingModule({
                        declarations: [
                                AppComponent,
                                HeaderComponent,
                                CardblockComponent,
                                FormblockComponent,
                                FooterComponent
                        ],
                }).compileComponents();
        }));
        it('should create the app', async(() => {
                const fixture = TestBed.createComponent(AppComponent);
                const app = fixture.debugElement.componentInstance;
                expect(app).toBeTruthy();
        }));
        it(`should have as title 'app'`, async(() => {
                const fixture = TestBed.createComponent(AppComponent);
                const app = fixture.debugElement.componentInstance;
                expect(app.title).toEqual('CoinBoard');
        }));
        it('should have an <app-header> tag with content', async(() => {
                const fixture = TestBed.createComponent(AppComponent);
                fixture.detectChanges();
                const compiled = fixture.debugElement.nativeElement;
                expect(compiled.querySelector('app-header').textContent).toBeTruthy();
        }));
        it('should have an <app-cardblock> with content', async(() => {
                const fixture = TestBed.createComponent(AppComponent);
                fixture.detectChanges();
                const compiled = fixture.debugElement.nativeElement;
                expect(compiled.querySelector('app-cardblock').textContent).toBeTruthy();
        }));
        it('should have an <app-footer> with content', async(() => {
                const fixture = TestBed.createComponent(AppComponent);
                fixture.detectChanges();
                const compiled = fixture.debugElement.nativeElement;
                expect(compiled.querySelector('app-footer').textContent).toBeTruthy();
        }));
});
