import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAdModalPage } from './view-ad-modal.page';

describe('ViewAdModalPage', () => {
  let component: ViewAdModalPage;
  let fixture: ComponentFixture<ViewAdModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewAdModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
