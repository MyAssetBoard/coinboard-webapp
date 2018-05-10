import { FormblockModule } from './formblock.module';

describe('FormblockModule', () => {
  let formblockModule: FormblockModule;

  beforeEach(() => {
    formblockModule = new FormblockModule();
  });

  it('should create an instance', () => {
    expect(formblockModule).toBeTruthy();
  });
});
