import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanPage } from './pan.page';

describe('PanPage', () => {
  let component: PanPage;
  let fixture: ComponentFixture<PanPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
