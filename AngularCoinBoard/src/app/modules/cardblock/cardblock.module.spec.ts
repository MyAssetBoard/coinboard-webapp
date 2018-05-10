import { CardblockModule } from './cardblock.module';

describe('CardblockModule', () => {
  let cardblockModule: CardblockModule;

  beforeEach(() => {
    cardblockModule = new CardblockModule();
  });

  it('should create an instance', () => {
    expect(cardblockModule).toBeTruthy();
  });
});
