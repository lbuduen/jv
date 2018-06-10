import { MainNavRoutingModule } from './main-nav-routing.module';

describe('MainNavRoutingModule', () => {
  let mainNavRoutingModule: MainNavRoutingModule;

  beforeEach(() => {
    mainNavRoutingModule = new MainNavRoutingModule();
  });

  it('should create an instance', () => {
    expect(mainNavRoutingModule).toBeTruthy();
  });
});
