import { JumboModule } from './jumbo.module';

describe('JumboModule', () => {
  let jumboModule: JumboModule;

  beforeEach(() => {
    jumboModule = new JumboModule();
  });

  it('should create an instance', () => {
    expect(jumboModule).toBeTruthy();
  });
});
